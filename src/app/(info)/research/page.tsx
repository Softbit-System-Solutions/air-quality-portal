"use client";

import PageLayout from "../PageLayout";

export default function ResearchPage() {
  return (
    <PageLayout title="Research">
      <div className="min-h-screen py-4 lg:px-24">
        <div className="max-w-4xl mx-auto bg-white p-5">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Research & Publications
          </h1>
          <p className="text-gray-700 mb-6">
            The Nairobi County Government collaborates with universities,
            research institutions, and environmental organizations to analyze
            air quality trends, health impacts, and mitigation strategies.
          </p>

          <h2 className="text-xl font-semibold text-green-600 mb-4">
            Recent Studies
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3">
            <li>
              <strong>Urban Air Quality Assessment (2024):</strong> Joint report
              by Nairobi County and AirQo highlighting pollution sources and
              trends.
            </li>
            <li>
              <strong>Health Impacts of PM2.5 in Nairobi (2023):</strong> A
              collaborative study with the Ministry of Health on respiratory
              diseases linked to air pollution.
            </li>
            <li>
              <strong>Community-Led Monitoring (2022):</strong> Report on
              citizen science initiatives using low-cost air sensors in informal
              settlements.
            </li>
          </ul>

          <p className="text-gray-700 mt-6">
            To request access to detailed data or ongoing research
            collaborations, contact the{" "}
            <a
              href="mailto:environment@nairobi.go.ke"
              className="text-green-600 hover:underline"
            >
              Department of Environment
            </a>
            .
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
