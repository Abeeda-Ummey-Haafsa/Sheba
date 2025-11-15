import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isSmallScreen = window.innerWidth < 768;
    setIsMobile(isMobileDevice || isSmallScreen);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || isMobileDevice);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for auth state changes
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout;
    let isInitialized = false;

    const fetchProfile = async (userId, userAuth = null) => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, full_name, phone, location, skills, availability")
          .eq("id", userId)
          .single();

        if (!isMounted) return;

        if (!error && profile) {
          console.log("[AuthContext] Profile fetched from DB:", profile);
          setUserRole(profile.role);
          setUserMetadata(profile);
          // Senior auto-redirect
          if (profile.role === "senior") {
            navigate("/senior", { replace: true });
          }
        } else {
          console.log(
            "[AuthContext] No profile found in DB, using user metadata fallback",
            userAuth?.user_metadata
          );
          // Fallback: use auth user metadata
          const role = userAuth?.user_metadata?.role || "guardian";
          const metadata = userAuth?.user_metadata || {};
          setUserRole(role);
          setUserMetadata(metadata);
          if (role === "senior") {
            navigate("/senior", { replace: true });
          }
        }
      } catch (profileError) {
        console.warn(
          "[AuthContext] Profile fetch error:",
          profileError.message,
          "- using fallback",
          userAuth?.user_metadata
        );
        if (isMounted) {
          // Fallback to user metadata on error
          const role = userAuth?.user_metadata?.role || "guardian";
          const metadata = userAuth?.user_metadata || {};
          setUserRole(role);
          setUserMetadata(metadata);
        }
      }
    };

    const getSession = async () => {
      try {
        console.log("[AuthContext] Fetching session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log(
          "[AuthContext] Session fetched:",
          session ? "exists" : "null"
        );

        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("[AuthContext] User authenticated, fetching profile...");
          await fetchProfile(session.user.id, session.user);
        } else {
          console.log("[AuthContext] No user session");
          setUserRole(null);
          setUserMetadata(null);
        }
      } catch (error) {
        console.error("[AuthContext] Session fetch error:", error);
        if (isMounted) {
          setUserRole(null);
          setUserMetadata(null);
        }
      } finally {
        if (isMounted) {
          console.log("[AuthContext] Loading complete");
          setLoading(false);
          isInitialized = true;
        }
      }
    };

    getSession();

    // Safety timeout to ensure loading is never stuck (10 seconds max)
    loadingTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn(
          "[AuthContext] Loading timeout reached, forcing loading to false"
        );
        setLoading(false);
        isInitialized = true;
      }
    }, 10000);

    // Subscribe to auth changes (only fire after initialization)
    let subscription = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted || !isInitialized) return;

          console.log(
            "[AuthContext] Auth state changed (event:",
            event,
            "session:",
            session ? "exists" : "null",
            ")"
          );

          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await fetchProfile(session.user.id, session.user);
          } else {
            setUserRole(null);
            setUserMetadata(null);
          }
        }
      );

      subscription = data?.subscription;
    } catch (subErr) {
      console.error(
        "[AuthContext] onAuthStateChange subscription error:",
        subErr
      );
      // Ensure loading doesn't remain stuck
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Please verify your email before logging in. Check your inbox for the verification link."
          );
        }
        throw error;
      }

      // Check if email is verified (DEVELOPMENT MODE: Skipped for testing)
      // TODO: Re-enable this check in production
      // if (!data.user.email_confirmed_at) {
      //   await supabase.auth.signOut();
      //   throw new Error(
      //     "Please verify your email before logging in. A verification email has been sent to you."
      //   );
      // }

      setSession(data.session);
      setUser(data.user);

      // Fetch user profile for role and metadata
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, phone, location, skills, availability")
          .eq("id", data.user.id)
          .single();

        if (profile) {
          console.log("[AuthContext] signIn - Profile loaded:", profile.role);
          setUserRole(profile.role);
          setUserMetadata(profile);
        } else {
          console.warn(
            "[AuthContext] signIn - Profile is null, using fallback"
          );
          // Fallback: try user metadata from auth
          const role = data.user.user_metadata?.role || "guardian";
          setUserRole(role);
          setUserMetadata(data.user.user_metadata || {});
        }
      } catch (profileFetchError) {
        console.warn(
          "[AuthContext] signIn - Profile fetch failed:",
          profileFetchError.message
        );
        // Fallback: use user metadata
        const role = data.user.user_metadata?.role || "guardian";
        setUserRole(role);
        setUserMetadata(data.user.user_metadata || {});
      }

      toast.success("Login successful! Welcome back.");
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, metadata) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          // DEVELOPMENT MODE: Disabled email redirect for testing
          // emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      // Create user profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: metadata.full_name,
            role: metadata.role,
            phone: metadata.phone || null,
            location: metadata.location || null,
            skills: metadata.skills || null,
            availability: metadata.availability || null,
            nid_number: metadata.nid_number || null,
            experience_years: metadata.experience_years || null,
            number_of_seniors: metadata.number_of_seniors || null,
            verification_status:
              metadata.role === "caregiver" ? "pending" : "verified",
            created_at: new Date(),
          },
        ]);

        if (profileError)
          console.error("Profile creation error:", profileError);
      }

      toast.success(
        "Signup successful! Please verify your email to complete registration."
      );
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.message || "Signup failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      setUserRole(null);
      setUserMetadata(null);
      toast.success("Logged out successfully.");
      return { success: true };
    } catch (error) {
      const message = error.message || "Logout failed.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success("Password reset link sent to your email.");
      return { success: true };
    } catch (error) {
      const message =
        error.message || "Password reset failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    userMetadata,
    signIn,
    signUp,
    signOut,
    resetPassword,
    // Programmatic senior login (paired device)
    loginAsSenior: (seniorProfile) => {
      setUser({ id: seniorProfile.id, email: seniorProfile.email || null });
      setSession({ senior: true });
      setUserRole("senior");
      setUserMetadata(seniorProfile);
    },
    isAuthenticated: !!session || userRole === "senior",
    isMobile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
