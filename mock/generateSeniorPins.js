/**
 * Mock PIN Generator for Senior Accounts
 *
 * This script generates mock PINs for testing senior authentication
 * Usage: node generateSeniorPins.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the seniors mock data
const seniorsPath = path.join(__dirname, "seniors.json");
const seniors = JSON.parse(fs.readFileSync(seniorsPath, "utf8"));

// Function to generate a simple PIN from senior name
function generatePinFromName(name, index) {
  // For Bengali names, use index-based PIN
  const numPart = String(index + 1).padStart(4, "0");
  return numPart; // Simple 4-digit PIN based on position
}

// Function to generate a mock device PIN (like the Profile.jsx pattern)
function generateDevicePin() {
  return `PIN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// Generate PIN mapping
const pinMapping = {};
const seniorPinList = [];

seniors.forEach((senior, index) => {
  // Generate simple 4-digit PIN for easy testing
  const simplePIN = generatePinFromName(senior.name, index);

  // Generate MOCK-style PIN
  const mockPIN = `MOCK-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  // Generate device PIN (like family would)
  const devicePIN = generateDevicePin();

  // Store mapping
  const seniorData = {
    id: senior.id,
    name: senior.name,
    full_name: senior.name,
    age: senior.age,
    gender: senior.gender,
    address: senior.address,
    simplePIN: simplePIN,
    mockPIN: mockPIN,
    devicePIN: devicePIN,
    family_user_id: senior.family_user_id,
    created_at: senior.created_at,
  };

  // Add to mappings
  pinMapping[simplePIN] = seniorData;
  pinMapping[mockPIN] = seniorData;
  pinMapping[devicePIN] = seniorData;

  seniorPinList.push({
    seniorId: senior.id,
    name: senior.name,
    simplePIN: simplePIN,
    mockPIN: mockPIN,
    devicePIN: devicePIN,
  });
});

// Save PIN mapping for localStorage (used in app)
const mappingPath = path.join(__dirname, "senior_pin_mapping.json");
fs.writeFileSync(mappingPath, JSON.stringify(pinMapping, null, 2));

// Save readable PIN list for reference
const listPath = path.join(__dirname, "senior_pins_reference.json");
fs.writeFileSync(listPath, JSON.stringify(seniorPinList, null, 2));

// Generate a markdown reference document
const mdLines = [
  "# Senior Mock PINs Reference",
  "",
  "This document contains test PINs for logging into senior accounts.",
  "",
  "## How to Use",
  "",
  "1. Copy the PIN mapping to localStorage in browser console:",
  "```javascript",
  `localStorage.setItem('mock_senior_devices', '${JSON.stringify(
    pinMapping
  ).replace(/'/g, "\\'")}');`,
  "```",
  "",
  "2. Or use the simple 4-digit PIN for quick testing",
  "",
  "## Test Accounts",
  "",
  "| # | Senior Name | Simple PIN | Mock PIN | Device PIN |",
  "|---|-------------|------------|----------|------------|",
];

seniorPinList.slice(0, 50).forEach((item, idx) => {
  mdLines.push(
    `| ${idx + 1} | ${item.name} | \`${item.simplePIN}\` | \`${
      item.mockPIN
    }\` | \`${item.devicePIN}\` |`
  );
});

mdLines.push("");
mdLines.push("## Quick Test PINs");
mdLines.push("");
mdLines.push("For quick testing, use these simple sequential PINs:");
mdLines.push("");

for (let i = 0; i < Math.min(10, seniorPinList.length); i++) {
  mdLines.push(
    `- **${seniorPinList[i].name}**: \`${seniorPinList[i].simplePIN}\``
  );
}

mdLines.push("");
mdLines.push("## Notes");
mdLines.push("");
mdLines.push("- Simple PINs are 4-digit sequential numbers (0001, 0002, etc.)");
mdLines.push("- Mock PINs follow the pattern `MOCK-XXXX`");
mdLines.push("- Device PINs follow the pattern `PIN-XXXXXX`");
mdLines.push("- All PINs map to the same senior data in the mock system");
mdLines.push("");
mdLines.push(`Total seniors with PINs: ${seniorPinList.length}`);

const mdPath = path.join(__dirname, "SENIOR_PINS_REFERENCE.md");
fs.writeFileSync(mdPath, mdLines.join("\n"));

// Generate a simple setup script for browser console
const setupScript = `
// Senior Mock PIN Setup Script
// Copy and paste this entire script into your browser console

(function() {
  const pinMapping = ${JSON.stringify(pinMapping, null, 2)};
  
  localStorage.setItem('mock_senior_devices', JSON.stringify(pinMapping));
  
  console.log('✅ Senior PIN mapping loaded successfully!');
  console.log('📊 Total PINs loaded:', Object.keys(pinMapping).length);
  console.log('');
  console.log('Quick test PINs:');
  ${seniorPinList
    .slice(0, 10)
    .map(
      (item, idx) =>
        `console.log('${idx + 1}. ${item.name}: ${item.simplePIN}');`
    )
    .join("\n  ")}
  console.log('');
  console.log('You can now use these PINs to login as seniors!');
})();
`;

const setupScriptPath = path.join(__dirname, "setup_senior_pins.js");
fs.writeFileSync(setupScriptPath, setupScript);

// Console output
console.log("✅ Senior PIN generation complete!");
console.log("");
console.log("📁 Generated files:");
console.log("  - senior_pin_mapping.json (full mapping for localStorage)");
console.log("  - senior_pins_reference.json (readable list)");
console.log("  - SENIOR_PINS_REFERENCE.md (documentation)");
console.log("  - setup_senior_pins.js (browser console setup script)");
console.log("");
console.log(`📊 Total seniors: ${seniors.length}`);
console.log(`🔑 Total PINs generated: ${Object.keys(pinMapping).length}`);
console.log("");
console.log("Quick test PINs (first 10):");
seniorPinList.slice(0, 10).forEach((item, idx) => {
  console.log(`  ${idx + 1}. ${item.name}: ${item.simplePIN}`);
});
console.log("");
console.log("💡 To use in the app:");
console.log("   1. Run: node mock/generateSeniorPins.js");
console.log("   2. Copy setup_senior_pins.js content to browser console");
console.log("   3. Use any PIN from SENIOR_PINS_REFERENCE.md to login");
