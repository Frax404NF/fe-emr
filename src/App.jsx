import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";
import MainPage from "./pages/MainPage";
import "./index.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/dokter-view" element={<DoctorDashboard />} />
      <Route path="/nurse-view" element={<NurseDashboard />} />
      <Route path="/patient-view" element={<PatientDashboard />} />

      {/* ✅ Catch-all route for unknown paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;


// Reference
// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Layout untuk dokter & perawat */}
//         <Route path="/staff" element={<NakesDashboardLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="patients" element={<Patients />} />
//           <Route path="appointments" element={<Appointments />} />
//         </Route>

//         {/* Layout untuk pasien */}
//         <Route path="/patient" element={<PatientDashboardLayout />}>
//           <Route index element={<PatientHome />} />
//           <Route path="records" element={<MyRecords />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
