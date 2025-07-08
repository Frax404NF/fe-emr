// src/pages/Patient/PatientVisitDetail.jsx 
// This file contains the detailed view of a patient's visit in the Emergency Department (IGD) 
import PatientDashboardLayout from "../../layouts/PatientDashboardLayout";
import { useNavigate } from 'react-router-dom';
import logoemr from "../../assets/logoipsum-296.svg";

const PatientVisitDetail = () => {
  const navigate = useNavigate();

  // Data dummy - nantinya akan diganti dengan data dari API
  const visitData = {
    patient: {
      id: "1",
      fullName: "Budi Santoso",
      nik: "3540791939040943",
      medicalRecord: "RM-2025-00001",
      birthDate: "15 Mei 1985",
      gender: "Laki-laki",
      bloodType: "O", //an enum
      phone: "081234567890",
      address: "Jl. Merdeka No. 10, Jakarta Pusat",
      allergies: "Alergi terhadap antibiotik Penisilin.",
      medicalHistory: "Hipertensi, terkontrol dengan Amlodipine 5mg.",
      emergencyContact: "Siti Aminah (Istri)",
      emergencyPhone: "089876543210"
    },
    visit: {
      id_kunjungan: "3abb2796-c071-436c-b708-605bd8744388", // UUID (is this best practice?)
      title: "Laporan Detail Kunjungan IGD - EMR Pasien View",
      doctor: "Dr. Andi Prasetyo, Sp.PD",
      date: "17 Juni 2025",
      status: "Selesai", // an enum
      triageLevel: "Kuning (Urgensi Sedang)", // an enum
      chiefComplaint: "Nyeri hebat di ulu hati disertai mual dan rasa ingin muntah sejak pagi hari.",
      arrivalTime: "17 Juni 2025, 10:00 WIB"
    },
    vitalSigns: [
      {
        temperature: "37.5",
        bloodPressure: "120/80",
        heartRate: "80",
        pulse: "80",
        respiratoryRate: "20",
        position: "Duduk",
        timestamp: "17 Juni 2025, 10:05 WIB",
        performedBy: "Perawat Cae"
      }
    ],
    diagnoses: [
      {
        icdCode: "F10",
        description: "Gastritis Akut",
        doctor: "Dr. Andi Prasetyo, Sp.PD (Dokter Penanggung Jawab)",
        timestamp: "2025-06-17 10:20 WIB"
      }
    ],
    therapies: [
      {
        medication: "Infus NaCl 0.9%",
        description: "Infus NaCl 0.9% 500 ml selama 1 jam",
        performedBy: "Dr. Andi Prasetyo, Sp.PD",
        timestamp: "2025-06-17 10:30 WIB"
      }
    ],
    diagnosticTests: [
      {
        type: "Laboratorium",
        doctor: "Dr. Andi Prasetyo, Sp.PD",
        timestamp: "17 Juni 2025, 10:40 WIB",
        request: "Pemeriksaan darah lengkap",
        result: "Hb 13,5 g/dL, Leukosit 8.000/mm³, Trombosit 250.000/mm³",
        file: "hasil-lab-igd-170625.pdf"
      },
      {
        type: "Radiologi",
        doctor: "Dr. Andi Prasetyo, Sp.PD",
        timestamp: "17 Juni 2025, 11:00 WIB",
        request: "Foto Rontgen Abdomen",
        result: "Tidak tampak perforasi, tidak ada kelainan radiologis mayor",
        file: "rontgen-abdomen-170625.jpg"
      }
    ],
    SOAPentry: [
      {
        author: "Dr. Andi Prasetyo, Sp.PD",
        timestamp: "17 Juni 2025, 10:20 WIB",
        subjective: "Pasien mengeluh nyeri hebat di ulu hati, mual, dan ada rasa ingin muntah. Tidak ada demam.",
        objective: "Keadaan umum tampak kesakitan. TTV: TD 120/80 mmHg, Nadi 80x/menit, RR 20x/menit, Suhu 37.5°C. Nyeri tekan epigastrium (+), defans muscular (-).",
        assessment: "Gastritis Akut (ICD-10: K29.7)",
        plan: "- Pasang IVFD NaCl 0.9%. <br>- Injeksi Ranitidine 50mg IV. <br>- Observasi TTV dan keluhan nyeri. <br>- Rencana pemeriksaan darah lengkap & Rontgen Abdomen."
      },
      {
        author: "Perawat Cae",
        timestamp: "17 Juni 2025, 10:35 WIB",
        subjective: "Pasien mengatakan \"nyerinya sedikit berkurang setelah disuntik\".",
        objective: "Pasien tampak lebih rileks. Skala nyeri menurun dari 7/10 menjadi 5/10. Infus terpasang lancar di tangan kiri. Injeksi Ranitidine telah diberikan via IV.",
        assessment: "Masalah nyeri akut teratasi sebagian.",
        plan: "- Melanjutkan observasi keluhan nyeri dan TTV. <br>- Mengambil sampel darah untuk pemeriksaan lab. <br>- Mengantar pasien untuk Rontgen Abdomen. <br>- Memberikan edukasi untuk bed rest."
      }
    ],
    discharge: {
      status: "Diizinkan Pulang",
      time: "Selasa, 24 Juni 2025, 10:15 WITA",
      instructions: "Minum obat teratur sesuai anjuran. Istirahat yang cukup minimal 8 jam sehari. Hindari makanan pedas dan berlemak untuk sementara waktu. Kontrol kembali ke Poliklinik Penyakit Dalam pada tanggal 1 Juli 2025 atau jika ada keluhan memberat (demam tinggi, nyeri hebat).",
      prescription: "R/ Paracetamol 500mg No. X\nS. 3 dd 1 tab prn (jika demam/nyeri)\n\nR/ Amoxicillin 500mg No. XV\nS. 3 dd 1 tab (dihabiskan)",
      doctor: "Dr. Amanda Sari, Sp.A"
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <PatientDashboardLayout>
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Header dengan judul dan logo */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start pb-4 border-b gap-4">
            <h2 className="text-2xl font-bold text-gray-800 md:text-left">
              {visitData.visit.title}
            </h2>
            <div className="flex justify-center md:justify-end">
              <img 
                src={logoemr}
                alt="Logo EMR"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Tombol kembali */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4 gap-2">
            <button 
              onClick={handleBackClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 shadow-sm text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors duration-200 font-semibold w-full sm:w-auto"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
              </svg>
              Kembali ke Ringkasan
            </button>
          </div>

          {/* Ringkasan Kunjungan */}
          <header className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Ringkasan Kunjungan IGD</h1>
                <p className="text-gray-500 mt-2">
                  Dokumen ini berisi rincian lengkap perawatan pasien di Instalasi Gawat Darurat.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {/* <span className="inline-block bg-indigo-100 text-black text-sm font-semibold px-3 py-2 rounded-full">
                    Pasien ID: {visitData.patient.id}
                  </span> */}
                  <span className="inline-block bg-indigo-100 text-black text-sm font-semibold px-3 py-2 rounded-full">
                    No Rekam Medis: {visitData.patient.medicalRecord}
                  </span>
                  <span className="inline-block bg-indigo-100 text-black text-sm font-semibold px-3 py-2 rounded-full">
                    Dokter Penanggung Jawab: {visitData.visit.doctor}
                  </span>
                  <span className="inline-block bg-green-100 text-black text-sm font-semibold px-3 py-2 rounded-full">
                    Tanggal Kunjungan: {visitData.visit.date}
                  </span>
                  <span className="inline-block bg-green-100 text-black text-sm font-semibold px-3 py-2 rounded-full">
                    Status: {visitData.visit.status}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Informasi Pasien */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-user-circle mr-3 text-indigo-500"></i>Informasi Pasien
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</p>
                <p className="text-base text-gray-900">{visitData.patient.fullName}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NIK</p>
                <p className="text-base text-gray-900">{visitData.patient.nik}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Rekam Medis</p>
                <p className="text-base text-gray-900">{visitData.patient.medicalRecord}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Lahir</p>
                <p className="text-base text-gray-900">{visitData.patient.birthDate}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Kelamin</p>
                <p className="text-base text-gray-900">{visitData.patient.gender}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Golongan Darah</p>
                <p className="text-base text-gray-900">{visitData.patient.bloodType}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. HP Pasien</p>
                <p className="text-base text-gray-900">{visitData.patient.phone}</p>
              </div>
              <div className="mb-3 md:col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alamat</p>
                <p className="text-base text-gray-900">{visitData.patient.address}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Riwayat Alergi</p>
                <p className="text-base text-red-600 font-semibold">{visitData.patient.allergies}</p>
              </div>
              <div className="mb-3 md:col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Riwayat Penyakit Terdahulu</p>
                <p className="text-base text-gray-900">{visitData.patient.medicalHistory}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Kontak Darurat</p>
                <p className="text-base text-gray-900">{visitData.patient.emergencyContact}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Kontak Darurat</p>
                <p className="text-base text-gray-900">{visitData.patient.emergencyPhone}</p>
              </div>
            </div>
          </div>

          {/* Detail Kunjungan IGD */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-ambulance mr-3 text-blue-500"></i>
              Detail Kunjungan IGD
            </h2>
            <div className="grid-cols-1 gap-x-6 gap-y-4">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Level Triase</p>
                <p className="text-base text-gray-900">
                  <span className="font-bold text-yellow-600">{visitData.visit.triageLevel}</span>
                </p>
              </div>
              <div className="mb-3 md:col-span-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Keluhan Utama</p>
                <p className="text-base text-gray-900">
                  {visitData.visit.chiefComplaint}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu Masuk IGD</p>
                <p className="text-base text-gray-900">{visitData.visit.arrivalTime}</p>
              </div>
            </div>
          </div>

          {/* Pemeriksaan Tanda Vital */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-heartbeat mr-3 text-yellow-500"></i>
              Pemeriksaan Tanda Vital
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Suhu (°C)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Tekanan Darah (mmHg)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Detak Jantung (bpm)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Denyut Nadi (bpm)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Laju Nafas (kali/menit)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Posisi</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Waktu Pemeriksaan</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Pelaksana</th>
                  </tr>
                </thead>
                <tbody>
                  {visitData.vitalSigns.map((vital, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.temperature}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.bloodPressure}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.heartRate}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.pulse}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.respiratoryRate}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.position}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.timestamp}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{vital.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diagnosa Pasien */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-stethoscope mr-3 text-red-500"></i>
              Diagnosa Pasien
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Kode Diagnosa (ICD-10)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Deskripsi Diagnosa</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Dokter</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Waktu Diagnosa</th>
                  </tr>
                </thead>
                <tbody>
                  {visitData.diagnoses.map((diagnosis, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-gray-900">{diagnosis.icdCode}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{diagnosis.description}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{diagnosis.doctor}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{diagnosis.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pemberian Terapi */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-pills mr-3 text-green-500"></i>
              Pencatatan Pemberian Terapi
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Jenis Obat/Tindakan</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Deskripsi Prosedur/Instruksi</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Staff Pelaksana</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Waktu Pemberian</th>
                  </tr>
                </thead>
                <tbody>
                  {visitData.therapies.map((therapy, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-gray-900">{therapy.medication}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{therapy.description}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{therapy.performedBy}</td>
                      <td className="py-2 px-4 border-b text-gray-900">{therapy.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pemeriksaan Penunjang */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-flask mr-3 text-purple-500"></i>
              Pemeriksaan Penunjang (Diagnostik)
            </h2>
            <div>
              {visitData.diagnosticTests.map((test, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm relative mb-4">
                  <div className="flex justify-between items-start mb-3 pb-3 border-b">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{test.type}</h4>
                      <p className="text-xs text-gray-600">Oleh: <strong>{test.doctor}</strong> - {test.timestamp}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-600">Permintaan Pemeriksaan:</p>
                      <p className="text-gray-800 break-words">{test.request}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">Ringkasan Hasil:</p>
                      <p className="text-gray-800 break-words">{test.result}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">File:</p>
                      <p className="text-gray-800 truncate">{test.file}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan Perkembangan Pasien (CPPT) */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-2">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-file-medical-alt mr-3 text-teal-500"></i>
              Catatan Assesmen SOAP
            </h2>
            <div className="relative border-l-2 border-slate-200 ml-4">
              <div className="space-y-8">
                {visitData.SOAPentry.map((entry, index) => (
                  <div key={index} className="relative">
                    <div className="ml-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">{entry.author}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-0">{entry.timestamp}</p>
                      </div>
                      <div className="text-sm text-gray-700 space-y-2 mt-2">
                        <p><strong className="font-semibold text-gray-900">S:</strong> {entry.subjective}</p>
                        <p><strong className="font-semibold text-gray-900">O:</strong> {entry.objective}</p>
                        <p><strong className="font-semibold text-gray-900">A:</strong> {entry.assessment}</p>
                        <p><strong className="font-semibold text-gray-900">P:</strong>
                          <span dangerouslySetInnerHTML={{ __html: entry.plan }} />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kepulangan & Tindak Lanjut */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-4">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-800">
              <i className="fas fa-file-export mr-3 text-blue-500"></i>
              Ringkasan Kepulangan & Tindak Lanjut
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status Pasien</p>
                <p className="text-base text-black font-medium px-10 py-2 rounded-full inline-block mt-1 bg-blue-100">
                  {visitData.discharge.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Waktu Kepulangan</p>
                <p className="text-base text-gray-900 font-medium mt-1 flex items-center">
                  {visitData.discharge.time}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                  Instruksi Pulang & Edukasi
                </h3>
                <p className="text-base text-gray-800 whitespace-pre-wrap">
                  {visitData.discharge.instructions}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                  Resep yang Diberikan
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg mt-1 border border-gray-200">
                  <pre className="text-sm text-gray-800 font-mono overflow-x-auto">
                    {visitData.discharge.prescription}
                  </pre>
                  <p className="text-xs text-gray-500 mt-3">*Silakan tebus resep ini di bagian Farmasi/Apotek.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                  Dokter yang Menyetujui Kepulangan
                </h3>
                <p className="text-base text-gray-900">{visitData.discharge.doctor}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Sistem Bc Health EMR. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientVisitDetail;