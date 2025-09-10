"use client";

import { useState } from "react";
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

interface EmailAlertComponentProps {
  stations: Station[];
}

interface EmailAlertData {
  name: string;
  email: string;
  sensorIds: string[];
}

export default function EmailAlertSection({ stations }: EmailAlertComponentProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter stations that match query and are not selected
  const filteredOptions = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIds.includes(s.sensorId)
  );

  const addSensor = (sensor: Station) => {
    setSelectedIds([...selectedIds, sensor.sensorId]);
    setQuery("");
  };

  const removeSensor = (id: string) => {
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

    // ✅ Handle submit function
    const handleSubmit = async (data: EmailAlertData) => {
      try {
        // Example: log to console
        console.log("Submitting email alert data:", data);

        await subscribeToAlerts(data)

  
        // Reset form
        setName("");
        setEmail("");
        setSelectedIds([]);
      } catch (err) {
        console.error("Error submitting email alert:", err);
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className=" bg-green-600 hover:bg-[#f59e0b] text-primary-foreground font-bold px-10 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Bell className="mr-2 h-5 w-5" /> Get Air Quality Alerts
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get Air Quality Alerts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 outline-none">
          {/* Name */}
          <div >
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Stations Multi-select */}
          <div>
            <Label>Stations</Label>
            <div className="border rounded-md px-2 py-1 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-green-600">
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

            {/* Dropdown for options */}
            {query && filteredOptions.length > 0 && (
              <div className="border rounded-md mt-1 bg-white shadow-lg max-h-40 overflow-auto z-50 relative">
                {filteredOptions.map((s) => (
                  <div
                    key={s.sensorId}
                    onClick={() => addSensor(s)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full bg-green-700 hover:bg-green-800"
            onClick={() => {
              handleSubmit({ name, email, sensorIds: selectedIds })
              setIsOpen(false); // close modal on submit
            }}
          >
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
