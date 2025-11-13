# Project Setup Guide

Complete step-by-step guide to set up the Sheba project locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Supabase Configuration](#supabase-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **npm** 8.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)
- **Supabase Account** (Free tier available at https://supabase.com)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## Clone Repository

```bash
# Clone the repository
git clone https://github.com/Abeeda-Ummey-Haafsa/Sheba.git

# Navigate to project directory
cd Sheba
```

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:

- React 18.2.0
- Vite 5.4.21
- Tailwind CSS 3.4.8
- react-router-dom 6.14.2
- Supabase client
- Framer Motion
- And more...

### Step 3: Configure Environment Variables

Create `.env.local` file in the `frontend` directory:

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Verify Configuration

```bash
# Check that environment variables are loaded
cat .env.local
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd ../backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env` file in the `backend` directory:

```bash
# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EOF
```

### Step 4: Start Backend Server

```bash
npm start
```

The backend API will run at `http://localhost:5000`

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Sheba
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for initialization

### Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public** → `VITE_SUPABASE_ANON_KEY`
   - **Service Role Secret** → `SUPABASE_SERVICE_KEY` (backend only)

### Step 3: Create Database Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Copy the SQL from `frontend/SUPABASE_SETUP.sql`
4. Execute the query

This creates tables:

- `profiles` - User profile information
- `seniors` - Elderly family members
- `bookings` - Caregiver bookings
- `activity_logs` - Service activity records
- `locations` - Real-time location tracking

## Running the Application

### Development Mode

**Terminal 1 - Frontend:**

```bash
cd Sheba/frontend
npm run dev
# Available at http://localhost:5174
```

**Terminal 2 - Backend:**

```bash
cd Sheba/backend
npm start
# Running at http://localhost:5000
```

### Building for Production

**Frontend Build:**

```bash
cd frontend
npm run build
# Creates optimized build in dist/ folder

# Preview production build
npm run preview
```

**Backend Build:**

```bash
cd backend
# If there's a build script
npm run build
```

## Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

```bash
cd backend
npm test
```

## Project Structure

```
Sheba/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context
│   │   ├── styles/           # CSS files
│   │   └── supabaseClient.js # Supabase setup
│   ├── .env.local            # Environment variables
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   └── utils/            # Helpers
│   ├── .env                  # Environment variables
│   ├── server.js             # Entry point
│   └── package.json
│
└── ml/                       # ML models (future)
```

## Troubleshooting

### Port Already in Use

If port 5174 or 5000 is already in use:

```bash
# Frontend - Use different port
npm run dev -- --port 3000

# Backend - Change PORT in .env file
PORT=3001
```

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# For Windows
rmdir /s node_modules
npm install
```

### Supabase Connection Error

1. Verify environment variables are correct:

```bash
# Frontend
cat frontend/.env.local

# Backend
cat backend/.env
```

2. Check Supabase project is running
3. Verify API keys are copied correctly (no extra spaces)

### Module Not Found Errors

```bash
# Reinstall specific package
npm install package-name

# Update all packages
npm update
```

### CORS Issues

If frontend can't connect to backend:

1. Enable CORS in backend (already configured)
2. Check backend is running on correct port
3. Verify API endpoint URLs

### Vite Hot Reload Not Working

```bash
# Restart dev server
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Environment Variables Reference

### Frontend (.env.local)

```dotenv
VITE_SUPABASE_URL=         # Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Supabase public key
```

### Backend (.env)

```dotenv
NODE_ENV=                  # development or production
PORT=                      # Server port (default 5000)
SUPABASE_URL=              # Supabase project URL
SUPABASE_SERVICE_KEY=      # Supabase service role key
JWT_SECRET=                # JWT signing secret
SMTP_HOST=                 # Email server host
SMTP_PORT=                 # Email server port
SMTP_USER=                 # Email account username
SMTP_PASS=                 # Email account password
```

## Useful Commands

### Frontend

```bash
cd frontend

npm run dev       # Start development server
npm run build     # Create production build
npm run preview   # Preview production build
npm run lint      # Run linter
npm install       # Install dependencies
```

### Backend

```bash
cd backend

npm start         # Start development server
npm run build     # Create production build
npm install       # Install dependencies
```

### Git

```bash
git status        # Check changes
git add .         # Stage all changes
git commit -m ""  # Create commit
git push          # Push to remote
git pull          # Pull from remote
```

## Next Steps

1. ✅ Follow this setup guide
2. 🔑 Configure Supabase with your keys
3. 📱 Start development servers
4. 🌐 Open http://localhost:5174 in browser
5. 📚 Read [Authentication Guide](./frontend/AUTHENTICATION_GUIDE.md)
6. 💻 Begin development!

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [GitHub Issues](https://github.com/Abeeda-Ummey-Haafsa/Sheba/issues)
3. Contact: support@sheba.local

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Express.js](https://expressjs.com)

---

**Last Updated**: November 2024
