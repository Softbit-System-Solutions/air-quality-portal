"use client";

export default function HealthAdvisoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Health Advisory on Air Quality
        </h1>
        <p className="text-gray-700 mb-4">
          The Nairobi County Government provides the following health
          recommendations based on the current Air Quality Index (AQI) levels.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>Good (0–50):</strong> Air quality is satisfactory. No health risks.</li>
          <li><strong>Moderate (51–100):</strong> Sensitive individuals should limit outdoor exertion.</li>
          <li><strong>Unhealthy for Sensitive Groups (101–150):</strong> Children, elderly, and those with respiratory issues should avoid prolonged outdoor exposure.</li>
          <li><strong>Unhealthy (151–200):</strong> Everyone may experience health effects; limit outdoor activity.</li>
          <li><strong>Very Unhealthy (201–300):</strong> Health alert: everyone should avoid outdoor activity.</li>
          <li><strong>Hazardous (300+):</strong> Emergency conditions — stay indoors.</li>
        </ul>
      </div>
    </div>
  );
}
