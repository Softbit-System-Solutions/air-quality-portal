"use client";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Data Methodology
        </h1>
        <p className="text-gray-700 mb-4">
          Our air quality data is collected from a hybrid network of reference-grade
          BAM sensors and low-cost AirQo devices deployed across Nairobi. The
          data undergoes validation, cleaning, and calibration before being stored
          in our central database.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>📍 Sensor data collection every 5 minutes.</li>
          <li>🧮 Data validation using statistical and spatial algorithms.</li>
          <li>📊 Averaging and trend calculation using Python (Pandas).</li>
          <li>🗄️ Storage in TimescaleDB for high-resolution temporal tracking.</li>
          <li>🔐 Quality control performed by the County’s Environmental Department.</li>
        </ul>
      </div>
    </div>
  );
}
