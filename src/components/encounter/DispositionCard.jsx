import { useState } from 'react';
import { getStatusConfig } from '../../utils/encounterUtils';
import DashboardCard from '../ui/DashboardCard';

const DispositionCard = ({
  encounter,
  currentUser,
  onStatusUpdate,
  statusUpdateLoading
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const statusInfo = getStatusConfig(encounter.status);
  const nextStatusOptions = {
    TRIAGE: ['ONGOING'],
    ONGOING: ['OBSERVATION', 'DISPOSITION'],
    OBSERVATION: ['ONGOING', 'DISPOSITION'],
    DISPOSITION: ['DISCHARGED', 'ADMITTED']
  }[encounter.status] || [];
  
  const isStatusFinal = ['DISCHARGED', 'ADMITTED'].includes(encounter.status);
  const canUpdate = currentUser?.role === 'DOCTOR' || 
                   (currentUser?.role === 'NURSE' && !isStatusFinal);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);

    // Cegah perawat mengubah ke status final
    const isFinalStatus = ['DISCHARGED', 'ADMITTED'].includes(newStatus);
    if (currentUser?.role === 'NURSE' && isFinalStatus) {
      alert('Hanya dokter yang dapat mengubah status final encounter.');
      setSelectedStatus('');
      return;
    }

    if (newStatus && window.confirm(
      `Apakah Anda yakin ingin mengubah status dari "${statusInfo.displayName}" ke "${
        getStatusConfig(newStatus).displayName}"?`
    )) {
      onStatusUpdate(newStatus);
    }
    setSelectedStatus('');
  };

  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Status Kunjungan & Disposition</h2>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-2 block">Status Saat Ini</label>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-2 text-sm font-medium rounded-full ${statusInfo.badgeColor}`}>
              {statusInfo.displayName}
            </span>
            {isStatusFinal && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Status Final
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-3 block">Timeline Status</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Dimulai: {new Date(encounter.encounter_start_time).toLocaleString('id-ID')}
              </span>
            </div>
            {encounter.encounter_end_time && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Selesai: {new Date(encounter.encounter_end_time).toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        </div>

        {canUpdate && nextStatusOptions.length > 0 && !isStatusFinal && (
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-600 mb-3 block">Ubah Status Kunjungan</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  disabled={statusUpdateLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Pilih status baru...</option>
                  {nextStatusOptions.map(status => (
                    <option key={status} value={status}>
                      {getStatusConfig(status).displayName}
                    </option>
                  ))}
                </select>
                {statusUpdateLoading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-xs">Updating...</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-2">Opsi status yang tersedia:</p>
                {nextStatusOptions.map(status => (
                  <div key={status} className="flex items-start space-x-2">
                    <span className="font-medium">{getStatusConfig(status).displayName}:</span>
                    <span className="text-gray-600">
                      {status === 'ONGOING' && 'Pasien sedang dalam perawatan aktif'}
                      {status === 'OBSERVATION' && 'Pasien memerlukan observasi lebih lanjut'}
                      {status === 'DISPOSITION' && 'Pasien siap untuk disposisi akhir'}
                      {status === 'DISCHARGED' && 'Pasien dapat pulang'}
                      {status === 'ADMITTED' && 'Pasien perlu rawat inap'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!canUpdate && (
          <div className="border-t pt-4">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
              <p className="text-sm text-gray-600">
                {currentUser?.role === 'NURSE' && isStatusFinal
                  ? 'Hanya dokter yang dapat mengubah status final encounter.'
                  : 'Anda tidak memiliki izin untuk mengubah status encounter ini.'}
              </p>
            </div>
          </div>
        )}

        {isStatusFinal && (
          <div className="border-t pt-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Encounter telah selesai dengan status {statusInfo.displayName}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {encounter.medic_staff && (
          <div className="border-t pt-4 mt-4">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Tenaga Medis yang Menangani
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {encounter.medic_staff.staff_name}
                </p>
                <p className="text-xs text-gray-500">
                  {encounter.medic_staff.role}
                  {encounter.medic_staff.specialization && ` - ${encounter.medic_staff.specialization}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default DispositionCard;
