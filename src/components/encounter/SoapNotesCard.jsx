import { formatDate } from '../../utils/encounterUtils';
import DashboardCard from '../ui/DashboardCard';

const SoapNotesCard = ({ soapNotes }) => {
  const renderSoapSection = (title, content) => (
    <div>
      <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-600">{content || '-'}</p>
    </div>
  );

  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">SOAP Notes</h2>
        {soapNotes?.length > 0 ? (
          <div className="space-y-4">
            {soapNotes.map((note, index) => (
              <div key={note.soap_note_id || index} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  {formatDate(note.note_time)} - {note.noted_by?.staff_name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {renderSoapSection('Subjective', note.subjective)}
                  {renderSoapSection('Objective', note.objective)}
                  {renderSoapSection('Assessment', note.assessment)}
                  {renderSoapSection('Plan', note.plan)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Belum ada catatan SOAP</p>
        )}
      </div>
    </DashboardCard>
  );
};

export default SoapNotesCard;
