# Seba Backend

Node.js + Express backend for Seba AI Eldercare Platform with Supabase integration.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create .env from .env.example:

```bash
cp .env.example .env
```

3. Add your credentials to .env

4. Run server:

```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/caregivers` - Get all caregivers
- More routes to be added

## Structure

```
src/
├── routes/       # API routes
├── controllers/  # Request handlers
├── middleware/   # Custom middleware
├── config/       # Configuration files
└── utils/        # Utility functions
```

## Environment Variables

See .env.example for all required variables.
