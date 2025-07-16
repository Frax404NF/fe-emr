import { useState } from "react";

const IMPORTANT_KEYS = [
  "hemoglobin", "leukosit", "trombosit", "glukosa", "ureum", "kreatinin", "CRP", "result_notes"
];

const ResultsTable = ({ results }) => {
  const [showDetail, setShowDetail] = useState(false);
  if (!results || typeof results !== "object") return null;

  // If results is array (panel lab), render each item as row (MVP: tampilkan semua)
  if (Array.isArray(results)) {
    const columns = Array.from(new Set(results.flatMap(item => Object.keys(item))));
    return (
      <div className="w-full overflow-x-auto">
        <table className="min-w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-700 border border-gray-300 break-words">
                    {renderCell(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // If results is object
  const columns = Object.keys(results);
  // Jika kolom < 5, tampilkan semua data secara vertikal
  if (columns.length < 5) {
    return (
      <div className="w-full">
        <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg mb-4 p-2">
          <table className="w-full">
            <tbody>
              {columns.map((col) => (
                <tr key={col} className="border-b last:border-b-0">
                  <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50 w-1/3 align-top capitalize">
                    {col.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-2 text-gray-800 w-2/3 break-words">
                    {renderCell(results[col], col)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  // Jika kolom >= 5, tampilkan summaryKeys di awal, tombol detail untuk semua data
  const summaryKeys = IMPORTANT_KEYS.filter((key) => columns.includes(key));
  return (
    <div className="w-full">
      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg mb-4 p-2">
        <table className="w-full">
          <tbody>
            {summaryKeys.map((col) => (
              <tr key={col} className="border-b last:border-b-0">
                <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50 w-1/3 align-top capitalize">
                  {col.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2 text-gray-800 w-2/3 break-words">
                  {renderCell(results[col], col)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mb-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        onClick={() => setShowDetail(true)}
      >
        Lihat Detail
      </button>

      {/* Modal Detail */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-x-auto max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowDetail(false)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Detail Hasil Pemeriksaan</h3>
            <table className="w-full">
              <tbody>
                {columns.map((col) => (
                  <tr key={col} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50 w-1/3 align-top capitalize">
                      {col.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2 text-gray-800 w-2/3 break-words">
                      {renderCell(results[col], col)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

function renderCell(value, col) {
  // Untuk image, tampilkan URL saja sebagai link
  if (typeof value === "string" && value.startsWith("http")) {
    if (col.toLowerCase().includes("image")) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{value}</a>
      );
    }
    if (col.toLowerCase().includes("file")) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline">Download File</a>
      );
    }
    // Default: link
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Lihat File</a>
    );
  }
  // If value is array, render as comma separated
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  // If value is object, render as JSON string
  if (typeof value === "object" && value !== null) {
    return <span className="font-mono text-xs text-gray-500">{JSON.stringify(value)}</span>;
  }
  // If result_notes, show as italic
  if (col === "result_notes") {
    return <span className="italic text-gray-600">{value}</span>;
  }
  return value !== undefined && value !== null && value !== "" ? value : "-";
}

export default ResultsTable;
