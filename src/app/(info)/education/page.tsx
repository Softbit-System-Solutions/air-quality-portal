"use client";

import PageLayout from "../PageLayout";

export default function EducationPage() {
  return (
    <PageLayout title="Education">
      <div className="min-h-screen py-4 lg:px-24">
        <div className="mx-auto bg-white p-5">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Educational Materials
          </h1>
          <p className="text-gray-700 mb-6">
            Learn how air quality affects our daily lives and what actions
            individuals, schools, and communities can take to reduce pollution
            and protect health.
          </p>

          <h2 className="text-xl font-semibold text-green-600 mb-4">
            Resources for Schools
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3 mb-6">
            <li>🌍 Classroom guides on the science of air pollution.</li>
            <li>📈 Interactive AQI charts and hands-on experiments.</li>
            <li>📚 Educational posters available for download.</li>
          </ul>

          <h2 className="text-xl font-semibold text-green-600 mb-4">
            For Citizens
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3 mb-6">
            <li>🚶 How to reduce your exposure on high-pollution days.</li>
            <li>
              🌿 Simple steps to improve local air quality (planting trees,
              carpooling, etc.).
            </li>
            <li>📱 How to interpret air quality data from this portal.</li>
          </ul>

          <p className="text-gray-700">
            These materials are free to use and share. Teachers, NGOs, and
            community leaders can request printed versions by emailing{" "}
            <a
              href="mailto:environment@nairobi.go.ke"
              className="text-green-600 hover:underline"
            >
              environment@nairobi.go.ke
            </a>
            .
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
