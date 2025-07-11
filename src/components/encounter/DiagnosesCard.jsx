import { formatDate } from '../../utils/encounterUtils';
import DashboardCard from '../ui/DashboardCard';

const DiagnosesCard = ({ diagnoses }) => {
  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Diagnosis</h2>
        {diagnoses?.length > 0 ? (
          <div className="space-y-3">
            {diagnoses.map((diagnosis, index) => (
              <div key={diagnosis.diagnosis_id || index} className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{diagnosis.icd10_code}</span>
                  <span className="text-gray-600">-</span>
                  <span>{diagnosis.diagnosis_description}</span>
                </div>
                {diagnosis.diagnoses_notes && (
                  <p className="text-sm text-gray-600">{diagnosis.diagnoses_notes}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(diagnosis.diagnosed_at)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Belum ada diagnosis yang dicatat</p>
        )}
      </div>
    </DashboardCard>
  );
};

export default DiagnosesCard;
