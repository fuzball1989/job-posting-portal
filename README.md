# 🚀 Job Posting Portal

> **Status: ✅ FULLY IMPLEMENTED & READY TO USE**

A modern, full-stack job posting platform built with React, Node.js, PostgreSQL, and Prisma. This is a complete, production-ready implementation with authentication, job management, search, and more!

## 🎯 What's Implemented

✅ **Complete Backend API** with 25+ endpoints  
✅ **Authentication System** (JWT + Refresh tokens)  
✅ **Database Schema** (PostgreSQL + Prisma ORM)  
✅ **Modern React Frontend** (TypeScript + Tailwind)  
✅ **Job Management** (CRUD operations)  
✅ **Search & Filtering** (Advanced job search)  
✅ **User Roles** (Job Seekers, Employers, Admin)  
✅ **Company Management**  
✅ **Responsive UI/UX**  
✅ **Sample Data** (Pre-populated with test jobs & users)  
✅ **Docker Setup** (One-command deployment)  

## 🌟 Features

### For Job Seekers
- 🔍 **Advanced Job Search** with filters (location, salary, remote work, etc.)
- 👤 **Profile Management** with skills, experience, and resume
- 📋 **Job Application Tracking**
- ⭐ **Save Favorite Jobs**
- 🔔 **Job Alerts** (customizable notifications)
- 📱 **Responsive Mobile Experience**

### For Employers
- 📝 **Job Posting Management** (Create, edit, delete, publish/unpublish)
- 🏢 **Company Profile** with branding and culture info
- 📊 **Application Management** (Review, shortlist, hire)
- 📈 **Analytics Dashboard** (views, applications, metrics)
- 🎯 **Featured Jobs** and urgent postings

### For Administrators
- 👥 **User Management** (job seekers, employers)
- 🏢 **Company Verification**
- 📊 **Platform Analytics**
- 🗂️ **Content Moderation**

## 🛠 Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** (Lightning-fast dev server)
- **Tailwind CSS** (Modern styling)
- **React Query** (Data fetching & caching)
- **React Hook Form** (Form management)
- **React Router v6** (Routing)
- **React Hot Toast** (Notifications)
- **Headless UI** (Accessible components)
- **Heroicons** (Beautiful icons)

### Backend
- **Node.js** + Express.js + TypeScript
- **Prisma ORM** (Type-safe database access)
- **PostgreSQL** (Robust database)
- **JWT Authentication** (Secure auth)
- **bcryptjs** (Password hashing)
- **Zod** (Schema validation)
- **Rate Limiting** (API protection)
- **CORS** + **Helmet** (Security)

### DevOps & Infrastructure
- **Docker** + **Docker Compose**
- **GitHub Actions** (CI/CD pipeline)
- **PostgreSQL 15** + **Redis** (Docker containers)
- **Nginx** (Reverse proxy)
- **Environment-based config**

## 📦 Project Structure

```
job-posting-portal/
├── frontend/           # React frontend application
├── backend/            # Node.js/Express backend API
├── database/           # Database schemas and migrations
├── shared/             # Shared types and utilities
├── infrastructure/     # Docker, K8s, Terraform configs
├── docs/               # Documentation
└── config/             # Environment configurations
```

## 🚀 Quick Start (Ready in 5 minutes!)

### Prerequisites
- **Node.js 18+** and npm
- **PostgreSQL 14+** (or use Docker)
- **Docker & Docker Compose** (recommended)

### Option 1: Docker Setup (Easiest! ✨)

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd job-posting-portal

# 2. Start all services (database, backend, frontend)
npm run docker:up

# 3. Set up database
npm run db:migrate
npm run db:seed

# 🎉 That's it! Visit http://localhost:3000
```

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```bash
# Install all packages
npm install
npm run build:shared
```

#### Step 2: Database Setup
```bash
# Option A: Use Docker for database only
docker-compose up -d database redis

# Option B: Use local PostgreSQL
createdb jobportal_dev
```

#### Step 3: Configure Environment
```bash
# Backend config
cd backend
cp .env.example .env
# Edit DATABASE_URL in .env

# Frontend config  
cd ../frontend
cp .env.example .env
# Edit VITE_API_URL if needed
```

#### Step 4: Initialize Database & Start Servers
```bash
# Generate Prisma client & run migrations
cd ../backend
npx prisma generate
npx prisma migrate deploy
npm run seed

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2)
cd ../frontend  
npm run dev
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Database**: PostgreSQL on localhost:5432

## 👥 Demo Accounts

The application comes pre-seeded with demo accounts:

### 🏢 **Employer Account**
- **Email**: `employer@techcorp.com`
- **Password**: `Employer123!`
- **Role**: Employer at TechCorp Inc.
- **Can**: Post jobs, manage applications, view analytics

### 👤 **Job Seeker Accounts**
- **Email**: `jane.doe@example.com`
- **Password**: `JobSeeker123!`
- **Profile**: Senior Software Developer with 5+ years experience

- **Email**: `mike.smith@example.com`
- **Password**: `JobSeeker123!`
- **Profile**: UX/UI Designer with 3+ years experience

### 🔧 **Admin Account**
- **Email**: `admin@jobportal.com`
- **Password**: `Admin123!`
- **Role**: Administrator
- **Can**: Manage users, companies, and platform settings

## 📊 Sample Data Included

✅ **10 Job Categories** (Software Development, Data Science, Design, etc.)  
✅ **3 Companies** (TechCorp Inc., StartupXYZ, Global Solutions Ltd.)  
✅ **4 Featured Jobs** (Senior Full Stack Developer, UX/UI Designer, Data Scientist, Frontend Intern)  
✅ **4 User Profiles** (Complete with skills, experience, preferences)  
✅ **Company Profiles** (With benefits, culture tags, verified status)  

## 📱 API Documentation

API documentation is available at `/docs/api` when running the development server.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
cd frontend && npm run test

# Run backend tests
cd backend && npm run test

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

See `/docs/deployment` for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@jobportal.com or join our Slack channel.
