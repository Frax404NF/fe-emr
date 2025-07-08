import PatientDashboardLayout from "../../layouts/PatientDashboardLayout";
import { useNavigate } from 'react-router-dom';
import logoemr from "../../assets/logoipsum-296.svg";

const InpatientDetailPatient = () => {
  const navigate = useNavigate();

  // Data dummy yang diperbarui untuk kasus apendisitis akut
  const visitData = {
    patient: {
      id: "1",
      fullName: "Budi Santoso",
      nik: "3540791939040943",
      medicalRecord: "RM-2025-00001",
      birthDate: "15 Mei 1985",
      gender: "Laki-laki",
      bloodType: "O",
      phone: "081234567890",
      address: "Jl. Merdeka No. 10, Jakarta Pusat",
      allergies: "Alergi terhadap antibiotik Penisilin.",
      medicalHistory: "Hipertensi, terkontrol dengan Amlodipine 5mg.",
      emergencyContact: "Siti Aminah (Istri)",
      emergencyPhone: "089876543210"
    },
    visit: {
      id_kunjungan: "3abb2796-c071-436c-b708-605bd8744388",
      title: "Laporan Detail Kunjungan IGD - EMR Pasien View",
      doctor: "dr. Eko Sutrisno, Sp.B", // Dokter spesialis bedah
      date: "17 Juni 2025",
      status: "Selesai",
      triageLevel: "Merah (Gawat Darurat)",
      chiefComplaint: "Nyeri perut kanan bawah hebat disertai demam sejak 12 jam yang lalu",
      arrivalTime: "17 Juni 2025, 10:00 WIB"
    },
    vitalSigns: [
      {
        temperature: "38.2",
        bloodPressure: "140/90",
        heartRate: "110",
        pulse: "110",
        respiratoryRate: "24",
        position: "Berbaring",
        timestamp: "17 Juni 2025, 10:05 WIB",
        performedBy: "Ns. Rahmawati, S.Kep"
      },
      {
        temperature: "38.0",
        bloodPressure: "135/85",
        heartRate: "105",
        pulse: "105",
        respiratoryRate: "22",
        position: "Berbaring",
        timestamp: "17 Juni 2025, 11:30 WIB",
        performedBy: "Ns. Ahmad Fauzi, S.Kep"
      }
    ],
    diagnoses: [
      {
        icdCode: "K35.9",
        description: "Apendisitis Akut tanpa Peritonitis",
        doctor: "dr. Eko Sutrisno, Sp.B (Dokter Bedah)",
        timestamp: "2025-06-17 10:45 WIB"
      }
    ],
    therapies: [
      {
        medication: "Infus RL",
        description: "Infus Ringer Laktat 500 ml/jam",
        performedBy: "Ns. Siti Aminah, Amd.Kep",
        timestamp: "2025-06-17 10:30 WIB"
      },
      {
        medication: "Ceftriaxone",
        description: "Ceftriaxone 1g IV",
        performedBy: "Ns. Ahmad Fauzi, S.Kep",
        timestamp: "2025-06-17 11:00 WIB"
      },
      {
        medication: "Metronidazole",
        description: "Metronidazole 500mg IV",
        performedBy: "Ns. Ahmad Fauzi, S.Kep",
        timestamp: "2025-06-17 11:05 WIB"
      }
    ],
    diagnosticTests: [
      {
        type: "Laboratorium",
        doctor: "dr. Eko Sutrisno, Sp.B",
        timestamp: "17 Juni 2025, 10:40 WIB",
        request: "Darah Lengkap, CRP, Kimia Darah",
        result: "Leukosit 15.000/mm³, Neutrofil 85%, CRP 48 mg/L",
        file: "hasil-lab-apendisitis.pdf"
      },
      {
        type: "Radiologi",
        doctor: "dr. Eko Sutrisno, Sp.B",
        timestamp: "17 Juni 2025, 11:15 WIB",
        request: "USG Abdomen",
        result: "Apendiks membesar diameter 9mm dengan dinding menebal, fat stranding (+)",
        file: "usg-abdomen.jpg"
      }
    ],
    SOAPentry: [
      {
        author: "dr. Eko Sutrisno, Sp.B",
        timestamp: "17 Juni 2025, 10:45 WIB",
        subjective: "Pasien mengeluh nyeri perut kanan bawah sejak 12 jam lalu, semakin berat. Mual 3x, tidak muntah. Demam sejak malam.",
        objective: "Keadaan umum lemah, wajah meringis kesakitan. TTV: TD 140/90, N 110x/mnt, RR 24x/mnt, Suhu 38.2°C. Nyeri tekan dan defans muscular kuadran kanan bawah (+), Blumberg (+), Rovsing (+).",
        assessment: "Apendisitis Akut (ICD-10: K35.9)",
        plan: "- Pasang IV line <br>- Puasa <br>- Infus RL 20 tts/mnt <br>- Antibiotik: Ceftriaxone 1g IV + Metronidazole 500mg IV <br>- Pemeriksaan lab darah lengkap & CRP <br>- USG abdomen emergensi <br>- Konsul anestesi <br>- Persiapan operasi apendektomi"
      },
      {
        author: "Ns. Ahmad Fauzi, S.Kep",
        timestamp: "17 Juni 2025, 11:40 WIB",
        subjective: "Pasien melaporkan nyeri berkurang setelah analgetik, skala nyeri 6/10",
        objective: "TTV: TD 135/85, N 105x/mnt, RR 22x/mnt, Suhu 38.0°C. Hasil lab: leukositosis. Hasil USG: apendisitis akut.",
        assessment: "Persiapan pra-operasi apendisitis akut",
        plan: "- Persiapan operasi: pencukuran daerah operasi <br>- Informed consent operasi <br>- Puasa lanjut <br>- Antibiotik kedua diberikan <br>- Observasi TTV ketat"
      },
      {
        author: "dr. Eko Sutrisno, Sp.B",
        timestamp: "17 Juni 2025, 12:30 WIB",
        subjective: "Pasien siap untuk operasi",
        objective: "Hasil pemeriksaan penunjang mendukung diagnosa apendisitis akut. Tidak ada kontraindikasi operasi.",
        assessment: "Apendisitis akut tanpa perforasi",
        plan: "- Segera ke ruang operasi <br>- Apendektomi laparoskopi <br>- Lanjutkan antibiotik pasca operasi"
      }
    ],
    discharge: {
      status: "Dirawat Inap",
      time: "17 Juni 2025, 14:00 WIB",
      instructions: "Pasien menjalani operasi apendektomi laparoskopi. Dipindahkan ke ruang pemulihan kemudian rawat inap bangsal bedah.",
      prescription: "",
      doctor: "dr. Eko Sutrisno, Sp.B"
    }
  };

  const handleBackClick = () => {
    navigate(-1);
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
                  <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-3 py-2 rounded-full">
                    Level Triase: {visitData.visit.triageLevel}
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
                  <span className="font-bold text-red-600">{visitData.visit.triageLevel}</span>
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
                  Instruksi & Edukasi
                </h3>
                <p className="text-base text-gray-800 whitespace-pre-wrap">
                  {visitData.discharge.instructions}
                </p>
              </div>

              {visitData.discharge.prescription && (
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
              )}

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

export default InpatientDetailPatient;