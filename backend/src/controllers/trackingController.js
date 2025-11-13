import { supabase } from "../config/database.js";

export const getLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json(data || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const { data, error } = await supabase
      .from("locations")
      .insert([
        {
          user_id: userId,
          latitude,
          longitude,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
