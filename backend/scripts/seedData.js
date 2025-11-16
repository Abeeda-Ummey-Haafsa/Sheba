/**
 * সেবা Platform - Database Seeder
 *
 * Seeds mock data into Supabase database
 * Reads JSON files from /mock directory and populates tables
 *
 * Prerequisites:
 *   1. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env
 *   2. Run: node mock/generate.js (to create JSON files)
 *   3. Run: node scripts/seedData.js
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BATCH_SIZE = 100;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function loadJSON(filename) {
  const filePath = path.join(__dirname, "..", "..", "mock", filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function checkTableCount(tableName) {
  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`   ⚠️  Error checking ${tableName}:`, error.message);
    return null;
  }

  return count;
}

async function insertBatch(tableName, data, batchSize = BATCH_SIZE) {
  console.log(`\n📝 Seeding ${tableName}...`);

  // Check if data already exists
  const existingCount = await checkTableCount(tableName);

  if (existingCount === null) {
    console.log(`   ⚠️  Skipping ${tableName} (error checking count)`);
    return false;
  }

  if (existingCount > 0) {
    console.log(
      `   ⏭️  Skipping ${tableName} (${existingCount} records already exist)`
    );
    return true;
  }

  console.log(
    `   📊 Inserting ${data.length} records in batches of ${batchSize}...`
  );

  let successCount = 0;
  let errorCount = 0;

  // Process in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(data.length / batchSize);

    process.stdout.write(`   ⏳ Batch ${batchNum}/${totalBatches}... `);

    const { data: inserted, error } = await supabase
      .from(tableName)
      .upsert(batch, { onConflict: "id", ignoreDuplicates: false });

    if (error) {
      console.log("❌");
      console.error(`   ⚠️  Error in batch ${batchNum}:`, error.message);
      errorCount += batch.length;

      // Try inserting one by one to identify problematic records
      console.log(`   🔍 Attempting individual inserts...`);
      for (const record of batch) {
        const { error: singleError } = await supabase
          .from(tableName)
          .upsert([record], { onConflict: "id" });

        if (singleError) {
          console.error(`   ⚠️  Failed to insert record:`, singleError.message);
          console.error(`      Record ID: ${record.id}`);
        } else {
          successCount++;
        }
      }
    } else {
      console.log("✅");
      successCount += batch.length;
    }
  }

  console.log(
    `   ✅ ${tableName}: ${successCount} inserted, ${errorCount} failed`
  );

  if (errorCount > 0) {
    console.log(`   ⚠️  Some records failed to insert. Check errors above.`);
    return false;
  }

  return true;
}

async function insertBatchNoId(
  tableName,
  data,
  conflictColumns,
  batchSize = BATCH_SIZE
) {
  console.log(`\n📝 Seeding ${tableName}...`);

  // Check if data already exists
  const existingCount = await checkTableCount(tableName);

  if (existingCount === null) {
    console.log(`   ⚠️  Skipping ${tableName} (error checking count)`);
    return false;
  }

  if (existingCount > 0) {
    console.log(
      `   ⏭️  Skipping ${tableName} (${existingCount} records already exist)`
    );
    return true;
  }

  console.log(
    `   📊 Inserting ${data.length} records in batches of ${batchSize}...`
  );

  let successCount = 0;
  let errorCount = 0;

  // Process in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(data.length / batchSize);

    process.stdout.write(`   ⏳ Batch ${batchNum}/${totalBatches}... `);

    const { data: inserted, error } = await supabase
      .from(tableName)
      .upsert(batch, { onConflict: conflictColumns.join(",") });

    if (error) {
      console.log("❌");
      console.error(`   ⚠️  Error in batch ${batchNum}:`, error.message);
      errorCount += batch.length;

      // Try inserting one by one to identify problematic records
      console.log(`   🔍 Attempting individual inserts...`);
      for (const record of batch) {
        const { error: singleError } = await supabase
          .from(tableName)
          .upsert([record], { onConflict: conflictColumns.join(",") });

        if (singleError) {
          console.error(`   ⚠️  Failed to insert record:`, singleError.message);
          console.error(
            `      Record keys: ${conflictColumns
              .map((col) => record[col])
              .join(", ")}`
          );
        } else {
          successCount++;
        }
      }
    } else {
      console.log("✅");
      successCount += batch.length;
    }
  }

  console.log(
    `   ✅ ${tableName}: ${successCount} inserted, ${errorCount} failed`
  );

  if (errorCount > 0) {
    console.log(`   ⚠️  Some records failed to insert. Check errors above.`);
    return false;
  }

  return true;
}

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

function transformCaregivers(caregivers) {
  // Convert frontend format (camelCase) to database format (snake_case)
  return caregivers.map((caregiver) => ({
    id: caregiver.id,
    user_id: caregiver.userId,
    age: caregiver.experienceYears + 25, // Approximate age from experience
    gender: caregiver.gender,
    skills: caregiver.services, // Already an array, will be converted to JSONB
    rating: caregiver.ratings?.averageRating || 4.0,
    hourly_rate: caregiver.hourlyRate,
    location: `SRID=4326;POINT(${caregiver.location.longitude} ${caregiver.location.latitude})`,
    verified_at:
      caregiver.verification?.verificationDate || new Date().toISOString(),
    bio: caregiver.description,
    created_at: caregiver.createdAt || new Date().toISOString(),
  }));
}

function transformSeniors(seniors) {
  return seniors.map((senior) => ({
    ...senior,
    medical_conditions: JSON.stringify(senior.medical_conditions),
    emergency_contacts: JSON.stringify(senior.emergency_contacts),
  }));
}

function transformActivityLogs(logs) {
  return logs.map((log) => ({
    ...log,
    services_provided: JSON.stringify(log.services_provided),
  }));
}

function transformTrainingCourses(courses) {
  return courses.map((course) => ({
    ...course,
    modules: JSON.stringify(course.modules),
  }));
}

// ============================================================================
// MAIN SEEDING FUNCTION
// ============================================================================

async function seedDatabase() {
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║       সেবা Platform - Database Seeder               ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  console.log("🔌 Connecting to Supabase...");
  console.log(`   URL: ${SUPABASE_URL.substring(0, 30)}...`);

  try {
    // Test connection
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });
    if (error) throw error;
    console.log("   ✅ Connected successfully\n");
  } catch (error) {
    console.error("   ❌ Connection failed:", error.message);
    process.exit(1);
  }

  console.log("📁 Loading JSON files...");

  let users,
    caregivers,
    seniors,
    bookings,
    activityLogs,
    emergencyAlerts,
    trainingCourses,
    caregiverProgress;

  try {
    users = loadJSON("users.json");
    console.log(`   ✅ users.json (${users.length} records)`);

    caregivers = loadJSON("caregivers.json");
    console.log(`   ✅ caregivers.json (${caregivers.length} records)`);

    seniors = loadJSON("seniors.json");
    console.log(`   ✅ seniors.json (${seniors.length} records)`);

    bookings = loadJSON("bookings.json");
    console.log(`   ✅ bookings.json (${bookings.length} records)`);

    activityLogs = loadJSON("activity_logs.json");
    console.log(`   ✅ activity_logs.json (${activityLogs.length} records)`);

    emergencyAlerts = loadJSON("emergency_alerts.json");
    console.log(
      `   ✅ emergency_alerts.json (${emergencyAlerts.length} records)`
    );

    trainingCourses = loadJSON("training_courses.json");
    console.log(
      `   ✅ training_courses.json (${trainingCourses.length} records)`
    );

    caregiverProgress = loadJSON("caregiver_progress.json");
    console.log(
      `   ✅ caregiver_progress.json (${caregiverProgress.length} records)`
    );
  } catch (error) {
    console.error("   ❌ Error loading JSON files:", error.message);
    console.error(
      '\n💡 Tip: Run "node mock/generate.js" first to create the JSON files'
    );
    process.exit(1);
  }

  console.log("\n🚀 Starting database seeding...");
  console.log("   (This may take a few minutes)\n");

  let allSuccess = true;

  // Seed tables in order (respecting foreign key constraints)
  try {
    // 1. Users (no dependencies)
    allSuccess = (await insertBatch("users", users)) && allSuccess;

    // 2. Seniors (depends on users)
    allSuccess =
      (await insertBatch("seniors", transformSeniors(seniors))) && allSuccess;

    // 3. Caregivers (depends on users)
    allSuccess =
      (await insertBatch("caregivers", transformCaregivers(caregivers))) &&
      allSuccess;

    // 4. Training courses (no dependencies)
    allSuccess =
      (await insertBatch(
        "training_courses",
        transformTrainingCourses(trainingCourses)
      )) && allSuccess;

    // 5. Bookings (depends on seniors and caregivers)
    allSuccess = (await insertBatch("bookings", bookings)) && allSuccess;

    // 6. Activity logs (depends on bookings)
    allSuccess =
      (await insertBatch(
        "activity_logs",
        transformActivityLogs(activityLogs)
      )) && allSuccess;

    // 7. Emergency alerts (depends on seniors and caregivers)
    allSuccess =
      (await insertBatch("emergency_alerts", emergencyAlerts)) && allSuccess;

    // 8. Caregiver progress (depends on caregivers and training_courses)
    // Note: caregiver_progress has composite primary key (caregiver_id, course_id)
    allSuccess =
      (await insertBatchNoId("caregiver_progress", caregiverProgress, [
        "caregiver_id",
        "course_id",
      ])) && allSuccess;
  } catch (error) {
    console.error("\n❌ Fatal error during seeding:", error.message);
    console.error("   Rolling back... (manual cleanup may be required)");
    process.exit(1);
  }

  // Final summary
  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║                  Seeding Summary                     ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  const tables = [
    "users",
    "seniors",
    "caregivers",
    "training_courses",
    "bookings",
    "activity_logs",
    "emergency_alerts",
    "caregiver_progress",
  ];

  for (const table of tables) {
    const count = await checkTableCount(table);
    console.log(
      `   ${table.padEnd(20)} ${count !== null ? count : "?"} records`
    );
  }

  console.log("\n");

  if (allSuccess) {
    console.log("✨ Database seeding completed successfully!");
    console.log("🎉 সেবা platform is ready for testing\n");
    process.exit(0);
  } else {
    console.log("⚠️  Database seeding completed with some errors.");
    console.log("   Please review the logs above and fix any issues.\n");
    process.exit(1);
  }
}

// ============================================================================
// EXECUTE
// ============================================================================

seedDatabase().catch((error) => {
  console.error("\n💥 Unexpected error:", error);
  process.exit(1);
});
