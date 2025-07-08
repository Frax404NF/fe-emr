# Frontend EMR - Project Structure

## Overview
This is a React-based Electronic Medical Records (EMR) frontend application built with Vite, React Router, and Tailwind CSS. The application provides different dashboard views for do- ✅ **Enhanced Navbar**: Profile modal dengan backend integration dan improved UX
- ✅ **IGD Session Management**: Session handling optimized untuk IGD workflow
- ✅ **API Endpoints**: Corrected sesuai backend documentation
- ✅ **Production Ready**: Clean logging dan error handlingtors, nurses, and patients.

## Technology Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM 7.6.2
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Material Tailwind 3.0.0-beta.24
- **Icons**: Iconoir React 7.11.0
- **HTTP Client**: Axios 1.10.0
- **Linting**: ESLint
- **Language**: JavaScript (JSX)

## Project Structure

```
frontend-emr/
├── docs/                           # Dokumentasi proyek
│   ├── API.md                      # Dokumentasi API endpoints
│   └── COMPONENTS.md               # Dokumentasi komponen
├── public/                         # Static assets (empty)
├── src/                           # Source code
│   ├── _deprecated/               # File yang tidak digunakan (untuk referensi)
│   │   └── layout-component-refr/ # HTML reference layouts
│   ├── assets/                    # Static assets
│   │   └── logoipsum-296.svg     # Logo file
│   ├── components/                # Reusable components
│   │   ├── ui/                    # UI components library
│   │   │   ├── DashboardCard.jsx  # Shared dashboard card component
│   │   │   └── Navbar.jsx        # Navigation component
│   │   └── ProtectedRoute.jsx    # Route protection component with enhanced features
│   ├── constants/                 # Application constants
│   │   └── index.js              # Routes, roles, API endpoints constants
│   ├── contexts/                  # React Context providers
│   │   └── AuthContext.jsx       # Authentication context
│   ├── hooks/                     # Custom React hooks
│   │   ├── index.js              # Hooks export file
│   │   └── useAuth.js            # Authentication hook
│   ├── layouts/                   # Layout components
│   │   ├── NakesDashboardLayout.jsx    # Medical staff layout
│   │   └── PatientDashboardLayout.jsx  # Patient layout
│   ├── pages/                     # Page components
│   │   ├── Auth/                  # Authentication pages
│   │   │   ├── LoginPage.jsx      # User login page
│   │   │   ├── RegisterPage.jsx   # User registration page
│   │   │   └── index.js           # Auth components export
│   │   ├── Dashboard/             # Dashboard pages (role-based)
│   │   │   ├── AdminDashboard.jsx # Admin dashboard interface
│   │   │   ├── DoctorDashboard.jsx # Doctor dashboard interface
│   │   │   ├── NurseDashboard.jsx # Nurse dashboard interface
│   │   │   ├── PatientDashboard.jsx # Patient dashboard interface
│   │   │   └── index.js           # Dashboard components export
│   │   ├── Patient/               # Patient-related pages
│   │   │   ├── InpatientDetailPatient.jsx # Inpatient details page
│   │   │   ├── PatientVisitDetail.jsx # Patient visit details page
│   │   │   └── index.js           # Patient components export
│   │   ├── MainPage.jsx           # Landing/home page (role selection)
│   │   └── NotFound.jsx           # 404 error page
│   ├── services/                  # API services
│   │   └── authService.js         # Authentication API calls
│   ├── utils/                     # Utility functions
│   │   └── authUtils.js          # Authentication utilities
│   ├── App.jsx                    # Main app component with routing
│   ├── App.css                    # App-specific styles
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── .env                           # Environment variables
├── .eslintrc.cjs                  # ESLint configuration
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML template
├── LICENSE                        # License file
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Dependency lock file
├── postcss.config.js              # PostCSS configuration
├── PROJECT_STRUCTURE.md           # This file - project documentation
├── README.md                      # Project documentation
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.js                 # Vite build configuration
```

## Application Architecture

### Routing Structure
The application uses React Router for navigation with the following routes:

#### Public Routes (No Authentication Required)
- `/login` - User login page
- `/register` - User registration page

#### Protected Routes (Authentication Required)
- `/` - Main landing page (role selection)
- `/admin-view` - Admin dashboard
- `/dokter-view` - Doctor dashboard
- `/nurse-view` - Nurse dashboard
- `/patient-view` - Patient dashboard
- `/visit-detail` - Patient visit details
- `/inpatient-detail` - Inpatient details
- `*` - 404 Not Found page

### Component Hierarchy

#### Main Application Flow
1. **main.jsx** - Entry point, renders App component
2. **App.jsx** - Router configuration and route definitions
3. **MainPage.jsx** - Landing page with role selection buttons

#### Page Components

##### Authentication Pages
- **Auth/LoginPage.jsx** - User authentication/login page
- **Auth/RegisterPage.jsx** - User registration page
- **Auth/index.js** - Auth components export barrel

##### Dashboard Pages (Role-based)
- **Dashboard/AdminDashboard.jsx** - Admin dashboard interface
- **Dashboard/DoctorDashboard.jsx** - Doctor dashboard interface
- **Dashboard/NurseDashboard.jsx** - Nurse dashboard interface  
- **Dashboard/PatientDashboard.jsx** - Patient dashboard interface
- **Dashboard/index.js** - Dashboard components export barrel

##### Patient Management Pages
- **Patient/InpatientDetailPatient.jsx** - Inpatient management interface
- **Patient/PatientVisitDetail.jsx** - Detailed view of patient visits
- **Patient/index.js** - Patient components export barrel

##### General Pages
- **MainPage.jsx** - Landing page with role selection buttons
- **NotFound.jsx** - Error page for invalid routes

#### Layout Components
- **NakesDashboardLayout.jsx** - Shared layout for medical staff (doctors/nurses)
- **PatientDashboardLayout.jsx** - Layout specific to patient interface

#### Reusable Components
- **ui/Navbar.jsx** - Navigation component with integrated profile modal and backend integration
- **ui/DashboardCard.jsx** - Shared card component untuk konsistensi UI dashboard
- **ProtectedRoute.jsx** - Route protection with authentication, role-based access control, and optional development validation

#### Context Providers
- **AuthContext.jsx** - Authentication state management and user context

#### Services
- **authService.js** - API service for authentication operations (login, register, logout, profile)

#### Custom Hooks
- **useAuth.js** - Hook untuk authentication state management
- **index.js** - Hooks export barrel untuk organized imports

#### Constants & Utilities
- **constants/index.js** - Application constants (routes, roles, API endpoints)
- **utils/authUtils.js** - Authentication utilities (context, localStorage helpers)

### User Roles
The application supports four main user roles:
1. **Admin** (`/admin-view`) - System administrators
2. **Doctor** (`/dokter-view`) - Medical practitioners
3. **Nurse** (`/nurse-view`) - Nursing staff  
4. **Patient** (`/patient-view`) - Patients accessing their records

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Key Features
- **Authentication System**: Complete login/register functionality with JWT tokens
- **Role-based Access Control**: Different dashboards based on user roles (Admin, Doctor, Nurse, Patient)
- **Context Management**: Centralized authentication state with React Context
- **API Integration**: Axios-based HTTP client for backend communication
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Material Design Components**: Modern UI components from Material Tailwind
- **Patient Management**: Patient visit and inpatient care tracking
- **Route Protection**: Authentication-based navigation and access control
- **Modern React Patterns**: Hooks, context, and functional components
- **Single Page Application**: SPA architecture with React Router
- **Environment Configuration**: Environment variable support for API endpoints

### Authentication Flow
The application implements a complete authentication system:

1. **User Registration** - Staff can register through `/auth/register`
2. **User Login** - Authentication through `/auth/login` 
3. **Token Management** - JWT access and refresh tokens
4. **Protected Routes** - Role-based route protection
5. **Auto-redirect** - Automatic dashboard routing based on user role
6. **Logout** - Secure logout with token invalidation

### API Integration
The application integrates with a backend API through:

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **HTTP Client**: Axios for API requests
- **Authentication Endpoints**: 
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration  
  - `POST /api/auth/signout` - User logout
- **Token Handling**: Automatic Bearer token inclusion in headers
- **Error Handling**: Centralized error management in services

### Environment Configuration
The application uses environment variables for configuration:

- **`.env`** - Environment-specific configuration
- **`VITE_API_BASE_URL`** - Backend API base URL
- **Vite Prefix**: All environment variables use `VITE_` prefix for client access

These files serve as visual references for the React component implementations.

### Implementation Status

#### ✅ **Sudah Terimplementasi**
- **Authentication System**: Login/register functionality dengan JWT tokens
- **Role-based Routing**: Admin, Doctor, Nurse, Patient dashboards
- **Protected Routes**: Authentication dan role-based access control (enhanced version)
- **Context Management**: AuthContext untuk state management
- **Project Structure**: Organized folder structure dengan separation of concerns
- **Constants Management**: Centralized constants untuk routes, roles, dan API endpoints
- **Custom Hooks**: useAuth untuk authentication logic yang reusable
- **API Integration**: Axios-based authService dengan error handling dan profile fetch
- **Environment Configuration**: .env file untuk environment variables
- **Development Tools**: ESLint configuration untuk code quality
- **Documentation**: Comprehensive README.md, PROJECT_STRUCTURE.md, API.md, COMPONENTS.md
- **Build System**: Production build berhasil dengan Vite bundler
- **Import Path Resolution**: Semua import paths sudah diperbaiki dan konsisten
- **Lint-free Code**: Zero ESLint errors dan warnings
- **Shared Components**: DashboardCard untuk consistency dan DRY principle
- **Clean Architecture**: Removed semua dead code dan unused utilities
- **Enhanced Navbar**: Profile modal dengan backend integration dan improved UX
- **API Endpoints Correction**: Backend integration dengan proper endpoints
- **Production Code Quality**: Clean logging, error handling, dan code optimization

#### 🔄 **Dalam Development**
- **UI Components Library**: Material Tailwind components implementation
- **Form Validation**: Advanced form handling dengan error management
- **Loading States**: Comprehensive loading state management
- **Error Handling**: Centralized error boundary dan user feedback

#### 📋 **Planned/Future Implementation**
- **Testing Suite**: Unit tests dan integration tests
- **Performance Optimization**: Code splitting dan lazy loading
- **Internationalization**: Multi-language support
- **PWA Features**: Offline capability dan push notifications
- **Advanced Patient Management**: Complex medical record features

### Code Organization Best Practices

#### 1. **Separation of Concerns**
- **Components**: UI logic dan rendering
- **Hooks**: Reusable state logic
- **Services**: API communication
- **Utils**: Pure functions dan helpers
- **Constants**: Static data dan konfigurasi

#### 2. **File Naming Conventions**
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Hooks**: camelCase dengan prefix "use" (e.g., `useAuth.js`)
- **Services**: camelCase dengan suffix "Service" (e.g., `authService.js`)
- **Utils**: camelCase (e.g., `helpers.js`)
- **Constants**: UPPER_SNAKE_CASE untuk nilai, camelCase untuk file

#### 3. **Import Organization**
```javascript
// 1. React dan library eksternal
import React from 'react';
import { useState } from 'react';

// 2. Internal components
import ProtectedRoute from './components/ProtectedRoute';

// 3. Constants dan utils
import { USER_ROLES, ROUTES } from './constants';

// 4. Styles
import './styles.css';
```

#### 4. **Documentation Standards**
- **JSDoc Comments**: Untuk semua functions dan components
- **README Files**: Untuk setiap major feature
- **API Documentation**: Endpoint specifications
- **Component Documentation**: Props dan usage examples

#### 5. **Folder Structure Guidelines**
- **`_deprecated/`**: File lama yang tidak digunakan tapi disimpan untuk referensi
- **`docs/`**: Dokumentasi proyek dan API
- **`components/ui/`**: Reusable UI components
- **`hooks/`**: Custom React hooks
- **`utils/`**: Pure utility functions
- **`constants/`**: Application constants

## Recommendations untuk Skripsi

### 1. **Academic Documentation Strengths**
- **Clear Architecture**: Well-organized folder structure demonstrates understanding of software engineering principles
- **Best Practices Implementation**: Separation of concerns, proper naming conventions, and modular design
- **Professional Standards**: Code organization that follows industry standards
- **Scalable Design**: Architecture yang dapat dikembangkan untuk features yang lebih complex

### 2. **Areas untuk Improvement/Extension**
- **Testing Implementation**: Tambahkan unit tests untuk meningkatkan code quality
- **Performance Metrics**: Implementasi monitoring dan performance measurement
- **Security Enhancements**: Advanced security features seperti input sanitization dan CSRF protection
- **User Experience**: Advanced UI/UX patterns dan accessibility features

### 3. **Documentation untuk Laporan Skripsi**
- **Methodology Chapter**: Struktur proyek ini menunjukkan pemahaman software development lifecycle
- **Implementation Chapter**: Detailed explanation dari setiap module dan function
- **Testing Chapter**: Plan untuk testing strategy dan quality assurance
- **Results Chapter**: Performance metrics dan user feedback analysis

### 4. **Technical Highlights untuk Skripsi**
- **Modern React Patterns**: Hooks, Context API, Functional Components
- **Enterprise Architecture**: Scalable folder structure dan code organization
- **Security Implementation**: JWT-based authentication dan role-based access control
- **API Design**: RESTful API integration dengan proper error handling
- **Responsive Design**: Mobile-first approach dengan Tailwind CSS

## Troubleshooting & Development Notes

### Common Issues dan Solutions

#### 1. **Import Path Resolution**
**Problem**: Build errors dengan "Could not resolve" untuk import paths
**Solution**: 
- Pastikan relative paths benar dari lokasi file saat ini
- File di `src/pages/Dashboard/` menggunakan `"../../"` untuk akses ke root src
- File di `src/pages/Auth/` menggunakan `"../../"` untuk akses ke root src
- File di `src/pages/Patient/` menggunakan `"../../"` untuk akses ke root src

**Correct Patterns**:
```javascript
// Dari src/pages/Dashboard/AdminDashboard.jsx
import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import { useAuth } from "../../hooks/useAuth";

// Dari src/pages/Patient/PatientVisitDetail.jsx
import PatientDashboardLayout from "../../layouts/PatientDashboardLayout";
import logoemr from "../../assets/logoipsum-296.svg";

// Dari src/pages/Auth/LoginPage.jsx
import { useAuth } from "../../hooks/useAuth";
```

#### 2. **ESLint Configuration**
**Problem**: PropTypes errors setelah migration dari PropTypes ke JSDoc
**Solution**: 
- Disable rule `'react/prop-types': 'off'` di `.eslintrc.cjs`
- Gunakan JSDoc comments untuk dokumentasi props
- Menggunakan modern React patterns tanpa PropTypes

#### 3. **Build Process**
**Commands untuk development dan production**:
```bash
# Development
npm run dev          # Start development server
npm run lint         # Check code quality
npm run lint -- --fix  # Auto-fix linting issues

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

#### 4. **Code Redundancy Removal**
**Problem**: Multiple ProtectedRoute components dengan functionality yang overlap
**Solution**: 
- Menghapus `EnhancedProtectedRoute.jsx` yang tidak digunakan
- Merge fitur terbaik ke `ProtectedRoute.jsx` yang sudah aktif digunakan
- Menggunakan props object pattern untuk extensibility
- Menambahkan optional development validation
- Improved loading UI dengan text indicator

**Before**:
```javascript
// EnhancedProtectedRoute.jsx (unused - 57 lines)
// ProtectedRoute.jsx (used - 58 lines)
// Total: 115 lines + maintenance overhead
```

**After**:
```javascript  
// ProtectedRoute.jsx (enhanced - 62 lines)
// Total: 62 lines, no redundancy
```

#### 5. **Dead Code Elimination**
**Problem**: Unused hooks dan utilities yang menambah complexity
**Solution**:
- **Removed**: `useForm.js` (83 lines) - tidak digunakan di aplikasi
- **Removed**: `useLoading.js` (49 lines) - tidak digunakan di aplikasi  
- **Removed**: `helpers.js` (96 lines) - tidak digunakan di aplikasi
- **Removed**: `devValidation.js` (44 lines) - tidak digunakan di aplikasi
- **Updated**: `hooks/index.js` untuk hanya export hooks yang benar-benar digunakan

**Impact**: -272 lines dead code, reduced maintenance overhead

#### 6. **Component Duplication Fix**
**Problem**: Dashboard components menggunakan duplicate CSS patterns
**Solution**:
- **Created**: `DashboardCard.jsx` sebagai shared component
- **Refactored**: AdminDashboard, NurseDashboard, PatientDashboard menggunakan DashboardCard
- **Result**: Consistent styling, easier maintenance, DRY principle

### Quality Assurance Checklist

- ✅ **ESLint**: Zero errors dan warnings
- ✅ **Build**: Production build successful
- ✅ **Import Paths**: Semua relative imports resolved
- ✅ **Type Safety**: JSDoc documentation untuk props
- ✅ **Code Organization**: Consistent folder structure
- ✅ **Documentation**: Comprehensive project documentation
- ✅ **No Dead Code**: Removed 272 lines unused code (useForm, useLoading, helpers, devValidation)
- ✅ **DRY Principle**: Shared DashboardCard component untuk consistency
- ✅ **Single Responsibility**: Setiap component dan utility memiliki purpose yang jelas
- ✅ **Clean Architecture**: Zero redundancy, optimal file structure
- ✅ **Navbar Enhancement**: Profile modal dengan backend integration dan logout functionality
- ✅ **API Integration**: Proper endpoint mapping dan error handling
- ✅ **Production Readiness**: Clean code, proper logging, optimized UX

### Recent Changes (Latest Update)

#### 7. **Navbar Refactor & Backend Integration**
**Enhancement**: Refactored Navbar untuk better UX dan backend integration
**Changes**:
- **Replaced**: "Login" button dengan "Profile" button untuk authenticated users
- **Added**: Profile modal dengan fetch data dari `/api/auth/profile` endpoint  
- **Enhanced**: authService dengan `getProfile()` function
- **Improved**: User experience dengan modal-based profile view
- **Integrated**: Logout functionality di dalam profile modal
- **Added**: Loading states dan error handling untuk profile fetch
- **Enhanced**: UI dengan profile avatar, detailed information display
- **Responsive**: Modal design yang mobile-friendly

**Profile Modal Features**:
- Staff profile information (name, email, role, department, etc.)
- Avatar placeholder dengan icon
- Loading spinner untuk fetch operations
- Error handling dengan retry functionality  
- Clean modal design dengan proper close/logout actions
- Responsive layout untuk berbagai screen sizes

**Backend Integration**:
```javascript
// authService.js - New function
const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};
```

**Impact**: Better UX, integrated backend profile data, cleaner navigation flow

#### 8. **API Endpoints Correction & Code Cleanup**
**Fix**: Updated API endpoints sesuai dokumentasi backend terbaru
**Changes**:
- **Login Endpoint**: Updated dari `/signin` ke `/login` sesuai backend docs
- **Register Endpoint**: Updated dari `/signup` ke `/register` sesuai backend docs  
- **Code Cleanup**: Removed debug logging untuk production readiness
- **Error Handling**: Improved error messages untuk production use

**Endpoint Mapping**:
- `POST /api/auth/login` - Staff authentication (corrected)
- `POST /api/auth/register` - Staff registration (corrected)
- `POST /api/auth/signout` - Session termination (unchanged)
- `GET /api/auth/profile` - Staff profile retrieval (unchanged)

**Impact**: Proper backend integration, production-ready logging, cleaner error handling
