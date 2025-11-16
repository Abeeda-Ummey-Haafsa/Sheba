# Senior Account Login Guide

This guide explains how to use mock PINs to login as senior accounts for testing.

## 📋 Overview

The Sheba app supports senior authentication using PINs. For testing purposes, we've generated mock PINs for all 121 seniors in the mock data.

## 🚀 Quick Start

### Option 1: Use Simple 4-Digit PINs (Recommended for Testing)

The easiest way to test is using simple sequential PINs:

| Senior Name     | PIN    |
| --------------- | ------ |
| বেগম খাতুন      | `0001` |
| করিম তালুকদার   | `0002` |
| সাবিনা বেগম     | `0003` |
| নূরজাহান আক্তার | `0004` |
| জাহানারা শর্মা  | `0005` |
| হাসান মল্লিক    | `0006` |
| শাহ রহমান       | `0007` |
| নাসির বেপারী    | `0008` |
| রহমান বেপারী    | `0009` |
| শাহনাজ রহমান    | `0010` |

**To login:**

1. Navigate to the Senior Setup Screen
2. Enter PIN (e.g., `0001`)
3. Click "কোড যাচাই করুন" (Verify Code)

### Option 2: Setup Full PIN Mapping (For Complete Testing)

To enable all PINs (simple, mock, and device PINs):

1. **Generate the PINs** (already done):

   ```bash
   cd mock
   node generateSeniorPins.js
   ```

2. **Load PINs in Browser Console**:

   - Open your browser console (F12)
   - Copy the contents of `mock/setup_senior_pins.js`
   - Paste into console and press Enter
   - You should see: ✅ Senior PIN mapping loaded successfully!

3. **Test Login**:
   - Go to Senior Setup Screen
   - Try any PIN from the reference files

## 📁 Generated Files

After running `generateSeniorPins.js`, you'll find:

1. **`senior_pin_mapping.json`** - Full PIN to senior data mapping (used by localStorage)
2. **`senior_pins_reference.json`** - Readable list of all PINs in JSON format
3. **`SENIOR_PINS_REFERENCE.md`** - Markdown table with first 50 seniors and their PINs
4. **`setup_senior_pins.js`** - Browser console script to load all mappings

## 🔑 PIN Types

Each senior has 3 types of PINs:

### 1. Simple PIN (4-digit)

- Format: `0001`, `0002`, `0003`, etc.
- Easy to remember and type
- Sequential based on position in mock data
- **Best for quick testing**

### 2. Mock PIN

- Format: `MOCK-XXXX` (e.g., `MOCK-1VIT`)
- Follows the mock pattern used elsewhere in the app
- Good for testing mock vs real data flows

### 3. Device PIN

- Format: `PIN-XXXXXX` (e.g., `PIN-AX761B`)
- Simulates the real device pairing PIN
- Matches the pattern generated in Profile.jsx

**All 3 PIN types for a senior point to the same data!**

## 💡 Usage Examples

### Example 1: Quick Test Login

```javascript
// In browser console
localStorage.setItem(
  "mock_senior_devices",
  '{"0001": {"id": "c4841607-921d-4c6c-ad32-cabea4d700ec", "name": "বেগম খাতুন", ...}}'
);

// Then in the app, enter PIN: 0001
```

### Example 2: Test Multiple Seniors

```javascript
// Load all PINs at once
// Run: node mock/generateSeniorPins.js
// Then paste mock/setup_senior_pins.js in browser console

// Now you can use any of these:
// 0001 - বেগম খাতুন
// MOCK-1VIT - বেগম খাতুন (same senior, different PIN format)
// PIN-AX761B - বেগম খাতুন (same senior, different PIN format)
```

## 🔍 Finding Your Senior PIN

### Method 1: Use the Reference JSON

```bash
cat mock/senior_pins_reference.json | grep "নূরজাহান"
```

### Method 2: Check the Markdown Table

Open `mock/SENIOR_PINS_REFERENCE.md` and search for the senior name.

### Method 3: Use Sequential PINs

- 1st senior = `0001`
- 2nd senior = `0002`
- 10th senior = `0010`
- 50th senior = `0050`

## 🛠️ Developer Notes

### How It Works

1. **PIN Generation** (`generateSeniorPins.js`):

   - Reads `mock/seniors.json`
   - Creates 3 PIN types per senior
   - Generates mapping files

2. **PIN Storage**:

   - Stored in `localStorage.mock_senior_devices`
   - Format: `{ "PIN": { senior_data } }`

3. **PIN Validation** (`SeniorSetupScreen.jsx`):
   - Accepts numeric (6-digit) or alphanumeric (`MOCK-XXXX`, `PIN-XXXXXX`)
   - Checks localStorage mapping first (mock mode)
   - Falls back to Supabase for real authentication

### Adding New Seniors

1. Add senior to `mock/seniors.json`
2. Run `node mock/generateSeniorPins.js`
3. Reload PINs in browser console

### Customizing PIN Format

Edit the `generatePinFromName()` and `generateDevicePin()` functions in `generateSeniorPins.js`.

## 📊 Statistics

- **Total Seniors**: 121
- **Total PINs Generated**: 363 (121 × 3 types)
- **PIN Formats Supported**:
  - 4-digit simple: `0001` - `0121`
  - Mock format: `MOCK-XXXX` (121 unique)
  - Device format: `PIN-XXXXXX` (121 unique)

## 🎯 Testing Checklist

- [ ] Run PIN generation script
- [ ] Load PINs in browser console
- [ ] Test login with simple PIN (`0001`)
- [ ] Test login with mock PIN (`MOCK-XXXX`)
- [ ] Test login with device PIN (`PIN-XXXXXX`)
- [ ] Verify senior data displays correctly after login
- [ ] Test invalid PIN error handling
- [ ] Test PIN not found error handling

## 🔐 Security Note

⚠️ **These are MOCK PINs for DEVELOPMENT ONLY!**

- Do not use in production
- Real PINs should be:
  - Generated securely by family members
  - Stored in Supabase `seniors.setup_pin` field
  - Validated against database, not localStorage
  - Never committed to version control

## 📞 Quick Reference Card

```
╔════════════════════════════════════════╗
║   SENIOR LOGIN QUICK REFERENCE         ║
╠════════════════════════════════════════╣
║ Simple PINs: 0001, 0002, 0003...       ║
║ Mock PINs:   MOCK-XXXX                 ║
║ Device PINs: PIN-XXXXXX                ║
╠════════════════════════════════════════╣
║ Setup:                                 ║
║ 1. node mock/generateSeniorPins.js     ║
║ 2. Paste setup_senior_pins.js in      ║
║    browser console                     ║
║ 3. Enter any PIN in app                ║
╠════════════════════════════════════════╣
║ Files:                                 ║
║ - senior_pins_reference.json           ║
║ - SENIOR_PINS_REFERENCE.md             ║
║ - setup_senior_pins.js                 ║
╚════════════════════════════════════════╝
```

## 📚 Related Documentation

- `SENIOR_PINS_REFERENCE.md` - Full PIN table
- `senior_pins_reference.json` - Complete PIN list
- `TEST_ACCOUNTS.md` - Family/caregiver test accounts
- `MOCK_DATA_COMPLETE.md` - Mock data overview

---

**Last Updated**: November 16, 2025
**Generated Seniors**: 121
**Available PINs**: 363
