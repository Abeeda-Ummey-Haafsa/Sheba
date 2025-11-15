# Seba Frontend

React + Vite + Tailwind CSS frontend for the Seba AI Eldercare Platform.

## Features

- React Router for navigation
- Tailwind CSS for styling
- Leaflet map integration
- react-slick carousel
- Mock data and local state management
- Responsive design (mobile-first)
- English/Bangla support

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Routes

- `/` - Home page
- `/login` - Login
- `/signup` - Signup
- `/find-caregivers` - Browse caregivers
- `/live-tracking` - GPS tracking dashboard
- `/activity-logs` - Activity history

## Structure

```
src/
├── components/    # Reusable React components
├── pages/         # Page components for each route
├── styles/        # Custom CSS
├── App.jsx        # Main app with router
├── main.jsx       # Entry point
└── index.css      # Global styles with Tailwind
```

## Technologies

- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- React Leaflet
- React Slick
- Framer Motion
