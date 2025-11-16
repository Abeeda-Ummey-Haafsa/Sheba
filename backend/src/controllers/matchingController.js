import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Match caregivers for a senior using the Python matching algorithm
 * POST /api/matching/find-matches
 *
 * Body:
 * {
 *   senior_id: string (optional if lat/lon provided),
 *   senior_lat: number (optional if senior_id provided),
 *   senior_lon: number (optional if senior_id provided),
 *   required_skills: string[] (optional),
 *   senior_gender: string (optional),
 *   senior_area: string (optional),
 *   booking_date: string (YYYY-MM-DD),
 *   start_time: string (HH:MM:SS),
 *   duration_hrs: number,
 *   top_n: number (default: 5)
 * }
 */
export const findMatches = async (req, res) => {
  try {
    const {
      senior_id,
      senior_lat,
      senior_lon,
      required_skills = [],
      senior_gender,
      senior_area,
      booking_date,
      start_time,
      duration_hrs = 4,
      top_n = 5,
    } = req.body;

    // Validation
    if (!senior_id && (!senior_lat || !senior_lon)) {
      return res.status(400).json({
        success: false,
        error: "Either senior_id or (senior_lat, senior_lon) must be provided",
      });
    }

    if (!booking_date || !start_time) {
      return res.status(400).json({
        success: false,
        error: "booking_date and start_time are required",
      });
    }

    // Build Python script arguments
    const scriptPath = path.join(
      __dirname,
      "../../../ml/matching_algorithm.py"
    );

    const args = ["--json", "--top_n", top_n.toString()];

    if (senior_id) {
      args.push("--senior_id", senior_id);
    } else {
      args.push("--senior_lat", senior_lat.toString());
      args.push("--senior_lon", senior_lon.toString());
    }

    if (required_skills.length > 0) {
      args.push("--required_skills", required_skills.join(","));
    }

    if (senior_gender) {
      args.push("--senior_gender", senior_gender);
    }

    if (senior_area) {
      args.push("--senior_area", senior_area);
    }

    args.push("--booking_date", booking_date);
    args.push("--start_time", start_time);
    args.push("--duration_hrs", duration_hrs.toString());

    // Execute Python script
    const pythonProcess = spawn("python", [scriptPath, ...args]);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("[Matching] Python script error:", errorData);
        return res.status(500).json({
          success: false,
          error: "Failed to run matching algorithm",
          details: errorData,
        });
      }

      try {
        const result = JSON.parse(outputData);
        return res.json({
          success: true,
          matches: result.matches || [],
          total_caregivers: result.total_caregivers || 0,
          query: result.query || {},
          timestamp: new Date().toISOString(),
        });
      } catch (parseError) {
        console.error("[Matching] JSON parse error:", parseError);
        return res.status(500).json({
          success: false,
          error: "Failed to parse matching results",
          details: parseError.message,
        });
      }
    });
  } catch (error) {
    console.error("[Matching] Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

/**
 * Get matching algorithm statistics
 * GET /api/matching/stats
 */
export const getMatchingStats = async (req, res) => {
  try {
    const scriptPath = path.join(
      __dirname,
      "../../../ml/matching_algorithm.py"
    );

    const pythonProcess = spawn("python", [scriptPath, "--stats", "--json"]);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("[Matching Stats] Python script error:", errorData);
        return res.status(500).json({
          success: false,
          error: "Failed to get statistics",
          details: errorData,
        });
      }

      try {
        const result = JSON.parse(outputData);
        return res.json({
          success: true,
          stats: result,
          timestamp: new Date().toISOString(),
        });
      } catch (parseError) {
        console.error("[Matching Stats] JSON parse error:", parseError);
        return res.status(500).json({
          success: false,
          error: "Failed to parse statistics",
          details: parseError.message,
        });
      }
    });
  } catch (error) {
    console.error("[Matching Stats] Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
