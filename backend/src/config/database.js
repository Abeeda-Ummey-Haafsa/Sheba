import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Support both SUPABASE_KEY and SUPABASE_SERVICE_KEY (service role)
const supabaseKey =
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase credentials in environment variables (SUPABASE_URL and SUPABASE_KEY or SUPABASE_SERVICE_KEY)"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
