import { formatDate } from '../../utils/encounterUtils';
import DashboardCard from '../ui/DashboardCard';

const VitalSignsCard = ({ vitalSigns }) => {
  const renderVitalField = (label, value, unit) => (
    value && (
      <div>
        <span className="font-medium">{label}:</span> {value}{unit}
      </div>
    )
  );

  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Tanda Vital</h2>
        {vitalSigns?.length > 0 ? (
          <div className="space-y-4">
            {vitalSigns.map((vital, index) => {
              const vsData = vital.vital_sign_data || vital;
              return (
                <div key={vital.vital_sign_id || index} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(vital.measurement_time)}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {renderVitalField('Suhu', vsData.temperature, '°C')}
                    {renderVitalField('HR', vsData.heart_rate, ' BPM')}
                    {(vsData.blood_pressure_systolic && vsData.blood_pressure_diastolic) && (
                      <div>
                        <span className="font-medium">TD:</span>
                        {vsData.blood_pressure_systolic}/{vsData.blood_pressure_diastolic} mmHg
                      </div>
                    )}
                    {renderVitalField('SpO2', vsData.oxygen_saturation, '%')}
                    {renderVitalField('RR', vsData.respiratory_rate, ' /min')}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">Data tanda vital belum tersedia</p>
        )}
      </div>
    </DashboardCard>
  );
};

export default VitalSignsCard;
