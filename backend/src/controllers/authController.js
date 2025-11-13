import jwt from "jsonwebtoken";
import { supabase } from "../config/database.js";
import { config } from "../config/env.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // TODO: Implement actual password verification with Supabase Auth
    // This is a placeholder implementation
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: data.id, email: data.email },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({ token, user: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name required" });
    }

    // TODO: Use Supabase Auth for password hashing and storage
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          name,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;

    const token = jwt.sign(
      { id: data[0].id, email: data[0].email },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token, user: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  // JWT-based logout is client-side (token deletion)
  // This endpoint can be used for server-side cleanup if needed
  res.json({ message: "Logged out successfully" });
};
