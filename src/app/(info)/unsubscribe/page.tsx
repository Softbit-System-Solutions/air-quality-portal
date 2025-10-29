
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageLayout from "../PageLayout";
import { unsubscribeFromAlerts } from "../../../lib/api"

export default function UnsubscribePage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");


  useEffect(() => {
    if (!id) return;
    console.log(id)
    const unsubscribe = async () => {
      try {
        await unsubscribeFromAlerts(id as string);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    unsubscribe();
  }, []);

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
