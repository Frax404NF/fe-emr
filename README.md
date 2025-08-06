# 🏥 EMR Frontend Application with Blockchain Integration

**Electronic Medical Records System - Frontend Interface**
*Skripsi S1 Teknik Informatika - Blockchain-based Medical Data Security*

---

## 📋 **Deskripsi Proyek**

Aplikasi frontend untuk sistem Electronic Medical Records (EMR) dengan integrasi blockchain untuk keamanan data medis. Sistem ini dibangun dengan React.js dan menyediakan interface multi-role untuk Admin, Dokter, dan Perawat dengan fokus pada integritas data melalui teknologi blockchain.

### 🎯 **Fokus Penelitian**
- **Keamanan Data Medis**: Implementasi blockchain untuk verifikasi hasil diagnostik
- **Integritas Data**: Hash-based verification dengan Ethereum network
- **Role-based Access Control**: Sistem autorisasi berbasis peran pengguna
- **Real-time Monitoring**: Dashboard admin untuk monitoring blockchain operations

---

## 🛠️ **Teknologi yang Digunakan**

### **Core Technologies**
- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm

### **UI/UX Technologies**
- **CSS Framework**: Tailwind CSS 3.4.17
- **Icons**: iconoir-react 7.11.0 (available, not implemented) - Later will be implemented
- **Styling**: PostCSS 8.5.6 + Autoprefixer 10.4.21

### **Navigation & State Management**
- **Routing**: React Router DOM 7.6.2
- **HTTP Client**: Axios 1.10.0
- **State Management**: React Context API + Hooks
- **Notifications**: react-hot-toast 2.5.2

### **Development Tools**
- **Linting**: ESLint 8.57.1 with React plugins
- **Code Formatting**: Prettier 3.6.2
- **TypeScript Support**: @typescript-eslint/* 8.36.0
- **Accessibility**: eslint-plugin-jsx-a11y 6.10.2

### **Blockchain Integration**
- **Network**: Ethereum Sepolia Testnet
- **Hash Algorithm**: SHA-256 for medical data integrity
- **Transaction Monitoring**: Real-time blockchain verification tracking

---

## 🚀 **Fitur Utama**

### **🔐 Authentication & Security**
- ✅ **JWT-based Authentication**: Secure login/register system
- ✅ **Role-based Access Control (RBAC)**: Admin, Doctor, Nurse permissions
- ✅ **Protected Routes**: Route guards based on authentication status
- ✅ **Session Management**: Auto-logout on token expiry
- ✅ **Error Boundaries**: Graceful error handling and fallbacks

### **🏥 Clinical Features**
- ✅ **Patient Management**: Patient registration and information management
- ✅ **Encounter Workflow**: TRIAGE → ONGOING → OBSERVATION → DISPOSITION flow
- ✅ **Diagnostic Tests**: Laboratory and imaging test management
- ✅ **SOAP Notes**: Structured clinical documentation
- ✅ **Vital Signs**: Real-time patient monitoring
- ✅ **Treatment Plans**: Medical treatment documentation

### **⛓️ Blockchain Integration**
- ✅ **Medical Data Hashing**: SHA-256 hash generation for test results
- ✅ **Blockchain Verification**: Ethereum smart contract integration
- ✅ **Transaction Tracking**: Etherscan integration for audit trails
- ✅ **Integrity Monitoring**: Real-time verification status tracking
- ✅ **Admin Dashboard**: Comprehensive blockchain management interface

### **📱 User Experience**
- ✅ **Responsive Design**: Mobile-first, adaptive UI
- ✅ **Multi-role Dashboards**: Specialized interfaces per user role
- ✅ **Real-time Updates**: Live status monitoring and notifications
- ✅ **Accessibility**: WCAG-compliant interface design
- ✅ **Performance Optimized**: Lazy loading and code splitting

---

## 📦 **Instalasi dan Setup**

### **Prerequisites**
- **Node.js**: v16.0.0 atau lebih baru
- **npm**: v8.0.0 atau lebih baru
- **Git**: Untuk version control
- **Backend EMR API**: Running pada port 3000

### **🔧 Langkah Instalasi**

1. **Clone Repository**
```bash
git clone https://github.com/Frax404NF/fe-emr.git
cd frontend-emr
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Create environment file
cp .env.example .env.local
```

**Environment Variables:**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=EMR BcHealth
VITE_BLOCKCHAIN_NETWORK=sepolia
```

4. **Development Server**
```bash
npm run dev
```

5. **Production Build**
```bash
npm run build
npm run preview
```

### **🌐 Access Points**
- **Development**: http://localhost:5173
- **Login Credentials**: Tersedia di dokumentasi backend
- **Admin Panel**: http://localhost:5173/admin-view

---

## 🏗️ **Arsitektur Sistem**

### **📁 Struktur Proyek**
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── encounter/      # Clinical workflow components
│   ├── form/           # Form components
│   ├── patient/        # Patient management components
│   └── ui/             # Generic UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── layouts/            # Page layout components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Role-based dashboards
│   └── Encounter/      # Clinical workflow pages
├── services/           # API service layer
│   ├── clinical/       # Clinical data services
│   └── adminService.js # Admin operations
├── utils/              # Utility functions
└── config/             # Configuration files
```

### **🔄 Data Flow Architecture**
```
User Interface (React Components) 
    ↓
Context Providers (Auth, State Management)
    ↓
Custom Hooks (Business Logic)
    ↓
Service Layer (API Communications)
    ↓
Backend API (Node.js + Blockchain)
```

---

## 👥 **Role-based Interface**

### **🛡️ Admin Dashboard (`/admin-view`)**
**Focus: System Oversight & Blockchain Management**

**Features:**
- **System Overview**: Real-time statistics and health monitoring
- **Blockchain Management**: Transaction verification and monitoring
- **User Management**: Staff account administration
- **Audit Trail**: Complete blockchain transaction history

**Components:**
- `SystemOverview.jsx` - System health and statistics
- `BlockchainManagement.jsx` - Blockchain operations dashboard
- `UserManagement.jsx` - Staff administration interface

### **👨‍⚕️ Doctor Dashboard (`/dokter-view`)**
**Focus: Clinical Care & Patient Management**

**Features:**
- **Patient Encounters**: Clinical workflow management
- **Diagnostic Ordering**: Laboratory and imaging requests
- **Medical Documentation**: SOAP notes and assessments
- **Treatment Planning**: Care plan development

### **👩‍⚕️ Nurse Dashboard (`/nurse-view`)**
**Focus: Patient Care & Monitoring**

**Features:**
- **Vital Signs**: Patient monitoring and data entry
- **Medication Administration**: Drug administration tracking
- **Care Coordination**: Inter-disciplinary communication
- **Patient Education**: Care instructions and guidance

---

## ⛓️ **Blockchain Integration Details**

### **🔐 Data Security Implementation**

**Hash Generation Process:**
```javascript
// Medical data structure for hashing
const medicalData = {
  testId: 123,
  testType: "Lab Darah Lengkap",
  result: "Normal",
  processedAt: "2025-01-28T10:30:00Z",
  processedBy: 2
};

// SHA-256 hash generation (backend)
const hash = crypto.createHash('sha256')
  .update(JSON.stringify(medicalData))
  .digest('hex');
```

**Blockchain Verification Workflow:**
1. **REQUESTED** → Test diminta dokter
2. **IN_PROGRESS** → Pemrosesan laboratorium
3. **COMPLETED** → Hasil siap, menunggu blockchain verification
4. **RESULT_VERIFIED** → Hash tersimpan di blockchain Ethereum

**Smart Contract Integration:**
- **Network**: Ethereum Sepolia Testnet
- **Transaction Hash**: Etherscan-trackable untuk audit
- **Gas Management**: Automated backend handling
- **Data Integrity**: Immutable hash storage

### **📊 Admin Monitoring Features**

**Real-time Dashboard:**
- Total diagnostic tests processed
- Blockchain verification status distribution
- Failed verification tracking and retry mechanisms
- Network health monitoring (database + blockchain)

**Audit Trail:**
- Complete transaction history with Etherscan links
- Verification attempt logs and retry tracking
- System health monitoring and alerting
- Performance metrics and response times

---

## 🔧 **Development Guidelines**

### **📝 Code Standards**
- **ESLint Configuration**: React + Accessibility rules
- **Component Structure**: Functional components with hooks
- **State Management**: Context API for global state
- **Error Handling**: Try-catch with user-friendly messages
- **Performance**: Lazy loading and memoization

**Code Style Example:**
```javascript
/**
 * Custom hook for blockchain polling
 * @param {string} token - JWT authentication token
 * @param {Function} onTestUpdate - Callback for test updates
 * @returns {Object} Polling state and controls
 */
export const useBlockchainPolling = (token, onTestUpdate) => {
  // Implementation with proper error handling
  // and cleanup on unmount
};
```

### **🔄 Git Workflow**
1. **Feature Branches**: `feature/blockchain-integration`
2. **Commit Messages**: Conventional commits format
3. **Pull Requests**: Code review requirements
4. **Main Branch**: Production-ready code only

### **🧪 Testing Strategy**
```bash
# Linting and code quality
npm run lint

# Build verification
npm run build

# Production preview
npm run preview
```

---

## 📚 **API Integration**

### **🌐 Backend Communication**
**Base URL**: `http://localhost:3000/api`

**Authentication:**
```javascript
// JWT token in headers
Authorization: Bearer <access_token>
```

**Key Endpoints:**
```javascript
// Admin Dashboard
GET /admin/dashboard/stats     // System statistics
GET /admin/blockchain/tests    // Blockchain verification data
GET /admin/users              // Staff management

// Clinical Workflow  
GET /encounters               // Patient encounters
POST /diagnostic-tests        // Order diagnostic tests
PUT /encounters/:id/status    // Update encounter status

// Blockchain Operations
POST /admin/blockchain/retry/:testId  // Retry verification
GET /admin/system/health             // System status
```

**Error Handling:**
- **401 Unauthorized**: Auto-redirect to login
- **403 Forbidden**: Role-based access denied
- **500 Server Error**: User-friendly error messages

---

## 🚀 **Deployment & Production**

### **🏗️ Build Configuration**
```bash
# Production build
npm run build

# Build verification
npm run preview
```

**Environment Variables untuk Production:**
```env
VITE_API_BASE_URL=https://api.emr-blockchain.com
VITE_BLOCKCHAIN_NETWORK=mainnet
VITE_APP_VERSION=1.0.0
```

### **📈 Performance Optimization**
- **Code Splitting**: Lazy loading untuk route components
- **Bundle Analysis**: Webpack bundle analyzer
- **Asset Optimization**: Image compression dan lazy loading
- **Caching Strategy**: Service worker implementation

---

## 🤝 **Kontribusi & Development**

### **🔄 Contribution Guidelines**
1. Fork repository dan create feature branch
2. Implement feature dengan proper testing
3. Submit pull request dengan detailed description
4. Code review dan approval process
5. Merge ke main branch untuk production

---

## 📞 **Contact & Support**

### **👨‍💻 Developer Information**
- **GitHub**: [Frax404NF](https://github.com/Frax404NF)
- **Project Repository**: [fe-emr](https://github.com/Frax404NF/fe-emr)
- **Issue Tracking**: GitHub Issues untuk bug reports
- **Documentation**: Comprehensive README dan inline comments


## 📄 **License & Academic Use**

**MIT License** - Open source untuk keperluan akademik dan penelitian

**Academic Usage Guidelines:**
- Proper citation required untuk penggunaan dalam penelitian
- Source code availability untuk peer review
- Documentation lengkap untuk reproducibility
- Ethical considerations dalam implementasi blockchain

---

**📅 Last Updated**: Juli 2025
**🔖 Version**: 1.0.0
**📚 Academic Level**: Undergraduate Thesis (S1)
**🎯 Research Focus**: Blockchain Security in Healthcare Systems