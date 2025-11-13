import React, { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

export default function Debug() {
  const [info, setInfo] = useState({
    configured: false,
    url: "",
    sessionStatus: "checking...",
    sessionData: null,
  });

  useEffect(() => {
    const checkStatus = async () => {
      const configured = isSupabaseConfigured();
      const url = import.meta.env.VITE_SUPABASE_URL || "NOT SET";

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        setInfo({
          configured,
          url,
          sessionStatus: error
            ? `Error: ${error.message}`
            : session
            ? "Session exists"
            : "No session",
          sessionData: session
            ? { user_id: session.user.id, email: session.user.email }
            : null,
        });
      } catch (err) {
        setInfo((prev) => ({
          ...prev,
          sessionStatus: `Exception: ${err.message}`,
        }));
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <p className="font-bold">Supabase Configured:</p>
          <p className={info.configured ? "text-green-600" : "text-red-600"}>
            {info.configured ? "YES" : "NO"}
          </p>
        </div>
        <div>
          <p className="font-bold">Supabase URL:</p>
          <p className="text-sm break-all">{info.url}</p>
        </div>
        <div>
          <p className="font-bold">Session Status:</p>
          <p>{info.sessionStatus}</p>
        </div>
        {info.sessionData && (
          <div>
            <p className="font-bold">Session Data:</p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(info.sessionData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
