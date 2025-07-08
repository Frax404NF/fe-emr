# EMR Frontend Application

## Deskripsi Proyek
Aplikasi frontend untuk sistem Electronic Medical Records (EMR) yang dibangun dengan React.js. Aplikasi ini menyediakan interface untuk berbagai role pengguna dalam sistem rumah sakit: Admin, Dokter, Perawat, dan Pasien.

## Teknologi yang Digunakan
- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM 7.6.2
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Material Tailwind 3.0.0-beta.24
- **HTTP Client**: Axios 1.10.0
- **Icons**: Iconoir React 7.11.0

## Fitur Utama
- ✅ **Sistem Autentikasi**: Login/Register dengan JWT tokens
- ✅ **Role-based Access Control**: Kontrol akses berdasarkan peran pengguna
- ✅ **Dashboard Multi-Role**: Interface khusus untuk Admin, Dokter, Perawat, dan Pasien
- ✅ **Responsive Design**: Optimized untuk desktop dan mobile
- ✅ **Protected Routes**: Keamanan route berdasarkan autentikasi dan role
- ✅ **Modern UI**: Material Design dengan Tailwind CSS

## Instalasi dan Setup

### Prerequisites
- Node.js (versi 16 atau lebih baru)
- npm atau yarn

### Langkah Instalasi
1. Clone repository
```bash
git clone <repository-url>
cd frontend-emr
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```
Edit file `.env` dan atur:
```
VITE_API_BASE_URL=http://localhost:8000
```

4. Jalankan development server
```bash
npm run dev
```

5. Buka browser dan akses `http://localhost:5173`

## Struktur Proyek
Lihat file [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) untuk detail lengkap struktur proyek.

## Role dan Akses

### Admin (`/admin-view`)
- User management
- System configuration
- Reports dan analytics
- System monitoring

### Dokter (`/dokter-view`) 
- Patient management
- Medical records
- Diagnosis dan treatment
- Appointment scheduling

### Perawat (`/nurse-view`)
- Patient monitoring
- Vital signs tracking
- Medication administration
- Care planning

### Pasien (`/patient-view`)
- Medical history
- Appointment booking
- Test results
- Personal information

## API Integration
Aplikasi berkomunikasi dengan backend melalui RESTful API. Lihat [docs/API.md](docs/API.md) untuk dokumentasi lengkap.

## Component Documentation
Dokumentasi lengkap komponen tersedia di [docs/COMPONENTS.md](docs/COMPONENTS.md).

## Development Guidelines

### Code Style
- Gunakan ESLint untuk code consistency
- Follow React best practices
- Implementasi responsive design
- Tulis JSDoc comments untuk functions dan components

### Git Workflow
1. Create feature branch dari `main`
2. Implement feature dengan commits yang descriptive
3. Create pull request untuk review
4. Merge setelah approval

### Testing
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Production Build
```bash
npm run build
```

File hasil build akan tersedia di folder `dist/`.

### Environment Variables untuk Production
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Kontribusi
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## Dokumentasi untuk Skripsi

### Struktur Dokumentasi
- **Analisis Sistem**: Lihat komponen dan flow di `docs/`
- **Implementasi**: Source code dengan comments lengkap
- **API Integration**: Dokumentasi endpoint di `docs/API.md`
- **UI/UX**: Screenshots dan design rationale
- **Testing**: Test cases dan results

### Fitur untuk Laporan Skripsi
- **Authentication Flow**: Login/Register process
- **Role-based Dashboard**: Different interfaces per role
- **Protected Routes**: Security implementation
- **API Communication**: Frontend-backend integration
- **Modern React Patterns**: Hooks, Context, Components
- **Responsive Design**: Mobile-first approach

## License
[MIT License](LICENSE)

## Contact
Untuk pertanyaan dan support, hubungi:
- Email: [your-email@example.com]
- GitHub: [your-github-username]
