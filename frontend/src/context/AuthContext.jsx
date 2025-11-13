import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout;

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
          try {
            // Fetch user role and metadata from profiles table
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("role, full_name, phone, location, skills, availability")
              .eq("id", session.user.id)
              .single();

            if (!isMounted) return;

            if (!error && profile) {
              console.log("[AuthContext] Profile fetched:", profile.role);
              setUserRole(profile.role);
              setUserMetadata(profile);
            } else {
              console.log(
                "[AuthContext] No profile found, using user metadata"
              );
              // Fallback to user metadata
              setUserRole(session.user.user_metadata?.role || "user");
              setUserMetadata(session.user.user_metadata || {});
            }
          } catch (profileError) {
            console.warn(
              "[AuthContext] Profile fetch error, using metadata fallback:",
              profileError.message
            );
            // Fallback to user metadata
            if (isMounted) {
              setUserRole(session.user.user_metadata?.role || "user");
              setUserMetadata(session.user.user_metadata || {});
            }
          }
        } else {
          console.log("[AuthContext] No user session");
          if (isMounted) {
            setUserRole(null);
            setUserMetadata(null);
          }
        }
      } catch (error) {
        console.error("[AuthContext] Session fetch error:", error);
      } finally {
        if (isMounted) {
          console.log("[AuthContext] Loading complete");
          setLoading(false);
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
      }
    }, 10000);

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          // Re-fetch user metadata on auth state change
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role, full_name, phone, location, skills, availability")
            .eq("id", session.user.id)
            .single();

          if (!isMounted) return;

          if (!error && profile) {
            setUserRole(profile.role);
            setUserMetadata(profile);
          } else {
            setUserRole(session.user.user_metadata?.role || "user");
            setUserMetadata(session.user.user_metadata || {});
          }
        } catch (profileError) {
          console.warn(
            "Profile fetch error, using metadata fallback:",
            profileError
          );
          if (isMounted) {
            setUserRole(session.user.user_metadata?.role || "user");
            setUserMetadata(session.user.user_metadata || {});
          }
        }
      } else {
        if (isMounted) {
          setUserRole(null);
          setUserMetadata(null);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription?.unsubscribe();
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

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error(
          "Please verify your email before logging in. A verification email has been sent to you."
        );
      }

      setSession(data.session);
      setUser(data.user);

      // Fetch user profile for role and metadata
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, phone, location, skills, availability")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
        setUserMetadata(profile);
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
          emailRedirectTo: `${window.location.origin}/login`,
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
    isAuthenticated: !!session,
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
