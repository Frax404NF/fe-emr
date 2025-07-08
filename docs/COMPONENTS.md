# Components Documentation

## Overview
Dokumentasi untuk semua komponen React dalam aplikasi EMR.

## Component Structure

### 1. Layout Components

#### NakesDashboardLayout
Layout untuk dashboard tenaga medis (dokter dan perawat).

**Props:**
- `children: ReactNode` - Konten yang akan ditampilkan dalam layout

**Features:**
- Header dengan navigasi
- Sidebar untuk menu
- Main content area
- Responsive design

#### PatientDashboardLayout  
Layout khusus untuk dashboard pasien.

**Props:**
- `children: ReactNode` - Konten yang akan ditampilkan dalam layout

### 2. Utility Components

#### ProtectedRoute
Komponen untuk proteksi route berdasarkan autentikasi dan role.

**Props:**
- `children: ReactNode` - Komponen yang akan di-render jika akses diizinkan
- `roles?: string[]` - Array role yang diizinkan (opsional)
- `redirectTo?: string` - Route tujuan redirect (default: "/login")

**Usage:**
```jsx
// Proteksi untuk user yang sudah login
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Proteksi untuk role tertentu
<ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
  <AdminPanel />
</ProtectedRoute>
```

#### Navbar
Komponen navigasi utama aplikasi.

**Features:**
- Logo aplikasi
- Menu navigasi
- User profile dropdown
- Logout functionality

### 3. Page Components

#### MainPage
Halaman utama dengan pemilihan role.

**Features:**
- Role selection buttons
- Responsive design
- Automatic redirect berdasarkan user role

#### LoginPage
Halaman login pengguna.

**Features:**
- Form login (email/password)
- Validation
- Error handling
- Redirect after login

#### RegisterPage
Halaman registrasi pengguna baru.

**Features:**
- Form registrasi
- Role selection
- Validation
- Error handling

#### DoctorDashboard
Dashboard khusus untuk dokter.

**Features:**
- Patient list
- Appointment management
- Medical records access
- Quick actions

#### NurseDashboard
Dashboard khusus untuk perawat.

**Features:**
- Patient monitoring
- Task management
- Vital signs tracking
- Medication administration

#### PatientDashboard
Dashboard khusus untuk pasien.

**Features:**
- Medical history
- Appointment booking
- Test results
- Personal information

#### AdminDashboard
Dashboard khusus untuk admin.

**Features:**
- User management
- System settings
- Reports and analytics
- System monitoring

## Custom Hooks

### useLoading
Hook untuk mengelola loading state.

**Returns:**
- `isLoading: boolean` - Status loading
- `startLoading: () => void` - Mulai loading
- `stopLoading: () => void` - Hentikan loading
- `withLoading: (fn) => Promise` - Wrapper async function dengan loading

### useForm
Hook untuk mengelola form state dan validation.

**Parameters:**
- `initialValues: object` - Nilai awal form
- `validationSchema?: function` - Fungsi validasi

**Returns:**
- `values: object` - Nilai form saat ini
- `errors: object` - Error messages
- `handleChange: (name, value) => void` - Handler perubahan input
- `handleSubmit: (onSubmit) => Promise` - Handler submit form
- `resetForm: () => void` - Reset form ke nilai awal

## Styling Guidelines

### Tailwind CSS
Aplikasi menggunakan Tailwind CSS untuk styling dengan konfigurasi custom.

### Material Tailwind
Komponen UI menggunakan Material Tailwind untuk konsistensi design.

### Responsive Design
Semua komponen harus responsive dengan breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## Best Practices

1. **Component Naming**: Gunakan PascalCase untuk nama komponen
2. **File Structure**: Satu komponen per file dengan nama yang sama
3. **Props Validation**: Gunakan PropTypes atau TypeScript untuk validasi props
4. **Documentation**: Setiap komponen harus memiliki JSDoc comments
5. **Testing**: Tulis unit tests untuk komponen penting
6. **Accessibility**: Pastikan komponen dapat diakses (ARIA labels, keyboard navigation)
