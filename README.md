# Sheba - Eldercare Platform

A comprehensive full-stack web application for connecting families with qualified caregivers for elderly care services. Built with React, Node.js, Supabase, and Tailwind CSS.

![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

Sheba is an eldercare platform designed for Bangladesh that simplifies the process of finding, booking, and managing quality care for elderly family members. The platform supports both guardians (families seeking care) and caregivers (care service providers).

### Key Features

#### For Guardians (Families)

- **Find Caregivers**: Browse and filter through verified caregivers with advanced filtering (gender, skills, distance, price)
- **Live Tracking**: Real-time GPS tracking of assigned caregivers via interactive maps
- **Activity Logs**: Timeline view of past caregiver activities with PDF export capabilities
- **Profile Management**: Manage family member profiles, change passwords, subscription management
- **Booking System**: Book caregivers with date, time, and special request management
- **Bilingual Support**: Full English and Bangla (Bengali) language support

#### For Caregivers

- **Dashboard**: View assigned seniors and upcoming bookings
- **Availability Management**: Set and manage work schedule
- **Profile Verification**: Complete profile setup with document verification

### Technology Stack

**Frontend:**

- React 18.2.0
- Vite 5.4.21 (Build tool)
- React Router 6.14.2 (Navigation)
- Tailwind CSS 3.4.8 (Styling)
- Framer Motion 10.12.16 (Animations)
- react-leaflet 4.2.1 (Maps)
- jsPDF 2.5.1 (PDF generation)
- react-hot-toast 2.4.1 (Notifications)
- react-hook-form 7.48.0 (Form management)
- yup 1.3.3 (Validation)
- moment.js 2.29.4 (Date formatting with Bangla locale)

**Backend:**

- Node.js + Express.js
- Supabase (Authentication & Database)
- PostgreSQL (Database)

**Additional:**

- Leaflet 1.9.4 (Map library)
- react-icons 4.12.0 (Icon library)
- react-datepicker 4.21.0 (Date picker)

## 📁 Project Structure

```
Sheba/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FindCaregivers.jsx
│   │   │   ├── ActivityLogs.jsx
│   │   │   ├── LiveTracking.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── CaregiverDashboard.jsx
│   │   ├── context/          # React Context (Authentication)
│   │   ├── styles/           # CSS stylesheets
│   │   └── supabaseClient.js # Supabase configuration
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.cjs
│   └── vite.config.jsx
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   └── utils/            # Helper functions
│   ├── server.js
│   └── package.json
│
├── ml/                       # Machine learning models (future)
│   └── requirements.txt
│
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git
- Supabase account (free tier available at https://supabase.com)
- Modern web browser

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Abeeda-Ummey-Haafsa/Sheba.git
cd Sheba
```

2. **Setup Frontend:**

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

3. **Setup Backend:**

```bash
cd backend
npm install
# Create .env file with configuration
npm start
```

### Environment Setup

Create `frontend/.env.local`:

```dotenv
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create `backend/.env`:

```dotenv
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

## 📖 Documentation

### Frontend Documentation

- [Authentication Guide](./frontend/AUTHENTICATION_GUIDE.md)
- [Setup Guide](./frontend/SETUP_GUIDE.md)
- [Developer Reference](./frontend/DEVELOPER_REFERENCE.md)
- [Supabase Setup SQL](./frontend/SUPABASE_SETUP.sql)

### Project Documentation

- [Implementation Complete](./IMPLEMENTATION_COMPLETE.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Delivery Summary](./DELIVERY_SUMMARY.md)

## 🎨 Design System

### Color Palette

- **Primary Teal**: #14B8A6
- **Secondary Orange**: #FB923C
- **Accent Blue**: #3B82F6
- **Success Green**: #10B981
- **Error Red**: #EF4444
- **Text Dark**: #1F2937
- **Background Light**: #F3F4F6

### Responsive Design

- Mobile: < 768px (full-width, stacked layouts)
- Tablet: 768px - 1024px (2-column layouts)
- Desktop: > 1024px (3+ column layouts)

## 🌍 Bilingual Support

All interfaces support both English and Bangla (Bengali):

- Language switcher in navigation
- Moment.js configured for Bangla date formatting
- All labels, form fields, and messages translated

## 📱 Pages Overview

### Guardian Pages

| Page            | Purpose             | Features                                            |
| --------------- | ------------------- | --------------------------------------------------- |
| Dashboard       | Home page           | Overview, recent bookings, family members           |
| Find Caregivers | Caregiver discovery | Browse, filter, search, book caregivers             |
| Activity Logs   | Service history     | Timeline view, filtering, PDF export                |
| Live Tracking   | GPS monitoring      | Real-time map, marker details, live status          |
| Profile         | Account management  | Personal info, password, seniors CRUD, subscription |

### Caregiver Pages

| Page                | Purpose       | Features                                 |
| ------------------- | ------------- | ---------------------------------------- |
| Caregiver Dashboard | Work overview | Assigned seniors, bookings, availability |

## 🔐 Authentication

- Email/password registration and login
- Email verification required
- Supabase Auth integration
- Role-based access control (Guardian/Caregiver)
- Protected routes with ProtectedRoute component
- Automatic session restoration

## 🛠️ Development

### Running Locally

**Frontend (Vite Dev Server):**

```bash
cd frontend
npm run dev
# Opens at http://localhost:5174
```

**Backend (Node Server):**

```bash
cd backend
npm start
# Runs at http://localhost:5000
```

### Building for Production

**Frontend:**

```bash
npm run build
npm run preview
```

**Backend:**

```bash
npm run build  # If applicable
```

## 📊 Features Implementation Status

### Completed ✅

- Frontend UI with React and Vite
- Authentication system (Supabase)
- Find Caregivers page with advanced filtering
- Activity Logs with PDF export
- Live Tracking with maps (react-leaflet)
- Profile management page
- Dashboard for guardians and caregivers
- Responsive design (mobile/tablet/desktop)
- Bilingual support (EN + Bangla)
- Framer Motion animations
- Form validation with react-hook-form + yup
- Toast notifications
- Protected routes

### In Progress 🔄

- Backend API integration
- Database schema optimization
- Real Supabase data fetching
- Real-time tracking with Supabase subscriptions

### Planned 📋

- Payment integration (Stripe)
- Email notifications
- Admin dashboard
- Analytics dashboard
- Machine learning for caregiver matching
- Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@sheba.local or open an issue on GitHub.

## 👥 Team

**Project Lead**: Abeeda Ummey Haafsa

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- Tailwind CSS for styling framework
- React community for libraries and tools
- OpenStreetMap for map data

## 📌 Version History

### v1.0.0 (Current)

- Initial release
- Core features implemented
- Bilingual support
- Full responsive design

---

**Last Updated**: November 2024  
**Repository**: https://github.com/Abeeda-Ummey-Haafsa/Sheba  
**Live Demo**: Coming Soon
