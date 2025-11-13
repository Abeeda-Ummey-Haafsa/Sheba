import { createClient } from "@supabase/supabase-js";

// Supabase configuration with placeholder values
// Replace these with your actual Supabase credentials from https://app.supabase.com
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to check if credentials are configured
export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL !== "https://your-project.supabase.co" &&
    SUPABASE_ANON_KEY !== "your-anon-key-here"
  );
};
