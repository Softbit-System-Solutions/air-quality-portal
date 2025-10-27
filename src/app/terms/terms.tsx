"use client";

import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Terms of Service</h1>
      <p className="mb-4">
        Welcome to the <strong>Nairobi Air Quality Portal</strong>  a digital platform developed by the 
        County Government of Nairobi to provide transparent, real-time air quality data to residents, 
        researchers, and policymakers.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing or using this portal, you agree to comply with these Terms of Service. 
        If you do not agree, please discontinue using the site immediately.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Purpose of the Portal</h2>
      <p className="mb-4">
        The portal provides environmental data sourced from air quality sensors installed across 
        Nairobi. The data is intended for public awareness, health planning, and research purposes.
        It is not to be used as legal evidence or for any commercial exploitation without authorization.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Accuracy</h2>
      <p className="mb-4">
        While the County Government strives to ensure accuracy, air quality data is subject to 
        calibration errors, sensor downtime, or external interference. The portal is provided 
        “as is” without warranties of accuracy or completeness.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. User Responsibilities</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Do not manipulate or misrepresent the data presented.</li>
        <li>Do not attempt unauthorized access to the system or APIs.</li>
        <li>Always cite the Nairobi County Air Quality Portal as the data source when using its data.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Modifications</h2>
      <p className="mb-4">
        These terms may be updated periodically to reflect policy or legal changes. 
        Updates will be posted on this page with an effective date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Contact</h2>
      <p>
        For questions regarding these Terms, please contact the Nairobi County Department of Environment 
        via email at <strong>environment@nairobi.go.ke</strong>.
      </p>
    </div>
  );
};

export default TermsOfService;
