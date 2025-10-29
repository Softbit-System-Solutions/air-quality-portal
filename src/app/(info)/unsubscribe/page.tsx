"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageLayout from "../PageLayout";
import { unsubscribeFromAlerts } from "../../../lib/api";

function UnsubscribeContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const unsubscribe = async () => {
      try {
        await unsubscribeFromAlerts(id);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    unsubscribe();
  }, [id]);

  return (
    <PageLayout title="Unsubscribe from Alerts">
      {status === "loading" && (
        <p className="text-center text-gray-600">Processing your request...</p>
      )}
      {status === "success" && (
        <p className="text-center text-green-700 font-medium">
          You have successfully unsubscribed from air quality alerts.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-red-600 font-medium">
          We couldn’t process your request. Please try again later.
        </p>
      )}
    </PageLayout>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
