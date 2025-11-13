import { supabase } from "../config/database.js";

export const getCaregivers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("caregivers").select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCaregiverById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("caregivers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCaregiver = async (req, res) => {
  try {
    const { name, email, phone, specialization } = req.body;

    const { data, error } = await supabase
      .from("caregivers")
      .insert([
        {
          name,
          email,
          phone,
          specialization,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
