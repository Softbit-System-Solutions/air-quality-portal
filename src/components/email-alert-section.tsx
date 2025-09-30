"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Bell, X } from "lucide-react";
import { Station, subscribeToAlerts } from "@/lib/api";

const legendItems = [
  { label: "Good", range: "0–12" },
  { label: "Moderate", range: "12.2–35.4" },
  { label: "Unhealthy for Sensitive Groups", range: "35.5–55.4" },
  { label: "Unhealthy", range: "55.5–150.4" },
  { label: "Very Unhealthy", range: "150.5–250.4" },
  { label: "Hazardous", range: "250.5–500.4" },
];

interface EmailAlertComponentProps {
  stations: Station[];
}

interface EmailAlertData {
  name: string;
  email: string;
  sensorIds: string[];
  alertLevel: string;
}

export default function EmailAlertSection({ stations }: EmailAlertComponentProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    trigger,
  } = useForm<EmailAlertData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      sensorIds: [],
      alertLevel: "",
    },
  });

  // 💡 Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // reset everything when closing
      reset();
      setSelectedIds([]);
      setQuery("");
      setServerError("");
    }
  };

  // 🔍 Filter stations
  const filteredOptions = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIds.includes(s.sensorId)
  );

  // ➕ Add station
  const addSensor = (sensor: Station) => {
    const newIds = [...selectedIds, sensor.sensorId];
    setSelectedIds(newIds);
    setValue("sensorIds", newIds);
    trigger("sensorIds");
    setQuery("");
  };

  // ❌ Remove station
  const removeSensor = (id: string) => {
    const newIds = selectedIds.filter((sid) => sid !== id);
    setSelectedIds(newIds);
    setValue("sensorIds", newIds);
    trigger("sensorIds");
  };

  // 🚀 Submit form
  const onSubmit = async (data: EmailAlertData) => {
    try {
      setServerError("");
      console.log("Submitting:", data);
      await subscribeToAlerts(data);
      reset();
      setSelectedIds([]);
      setIsOpen(false); // close dialog
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-[#7cf50b] text-white font-bold px-10 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Bell className="mr-2 h-5 w-5" /> Get Air Quality Alerts
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get Air Quality Alerts</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Server Error */}
          {serverError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="John Doe"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name too short" },
              })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Stations */}
          <div>
            <Label>Stations</Label>
            <div
              className={`border rounded-md px-2 py-1 flex flex-wrap gap-2 focus-within:ring-2 ${
                errors.sensorIds ? "border-red-500" : "focus-within:ring-green-600"
              }`}
            >
              {selectedIds.map((id) => {
                const station = stations.find((s) => s.sensorId === id);
                return (
                  <span
                    key={id}
                    className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                  >
                    {station?.name || id}
                    <button
                      type="button"
                      onClick={() => removeSensor(id)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  selectedIds.length ? "" : "Search and select stations..."
                }
                className="flex-grow min-w-[120px] outline-none p-1 text-sm"
              />
            </div>

            {query && filteredOptions.length > 0 && (
              <div className="border border-gray-200 rounded-md mt-1 max-h-32 overflow-y-auto">
                {filteredOptions.map((station) => (
                  <div
                    key={station.sensorId}
                    onClick={() => addSensor(station)}
                    className="px-3 py-1 cursor-pointer hover:bg-green-50 text-sm"
                  >
                    {station.name}
                  </div>
                ))}
              </div>
            )}

            {errors.sensorIds && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sensorIds.message}
              </p>
            )}
          </div>

          {/* Alert Level */}
          <div>
            <Label>Alert Level</Label>
            <select
              {...register("alertLevel", { required: "Please select an alert level" })}
              className={`w-full border rounded-md p-2 text-sm ${
                errors.alertLevel ? "border-red-500" : ""
              }`}
            >
              <option value="">Select alert level...</option>
              {legendItems.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label} ({item.range})
                </option>
              ))}
            </select>
            {errors.alertLevel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.alertLevel.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Subscribe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
