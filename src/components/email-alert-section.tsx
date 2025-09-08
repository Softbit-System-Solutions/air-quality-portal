// components/EmailAlertSection.tsx

"use client";

import { useState } from "react";
import { subscribeToAlerts } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/ui/command";
import { Bell, X } from "lucide-react";

// Example sensor list – you can fetch this from API
const sensorsList = [
  { id: "bam-1020", name: "BAM 1020" },
  { id: "mod-pm", name: "MOD-PM" },
  { id: "sensor-x", name: "Sensor X" },
  { id: "sensor-y", name: "Sensor Y" },
];

export default function EmailAlertSection() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      await console.log({
        email,
        name,
        sensors: selectedSensors,
      });

      setSuccess(true);
      setEmail("");
      setName("");
      setSelectedSensors([]);
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Subscription failed.");
    }
  };

  const toggleSensor = (sensorId: string) => {
    setSelectedSensors((prev) =>
      prev.includes(sensorId)
        ? prev.filter((id) => id !== sensorId)
        : [...prev, sensorId]
    );
  };

  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button
              size="lg"
              className="bg-primary/80 hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Bell className="mr-2 h-5 w-5" />
              Get Air Quality Alerts
            </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl"> {/* Bigger modal */}
          <DialogHeader>
            <DialogTitle>Subscribe to Nairobi Sensor Alerts</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Multi-select with badges */}
            <div>
              <Label>Sensors</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="border rounded-md px-2 py-2 flex flex-wrap gap-2 cursor-pointer min-h-[42px]">
                    {selectedSensors.length > 0 ? (
                      selectedSensors.map((id) => {
                        const sensor = sensorsList.find((s) => s.id === id);
                        return (
                          <span
                            key={id}
                            className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                          >
                            {sensor?.name}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSensor(id);
                              }}
                            />
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-400">Select sensors...</span>
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandGroup>
                      {sensorsList.map((sensor) => (
                        <CommandItem
                          key={sensor.id}
                          onSelect={() => toggleSensor(sensor.id)}
                        >
                          <div
                            className={`w-4 h-4 mr-2 border rounded ${
                              selectedSensors.includes(sensor.id)
                                ? "bg-green-600"
                                : "bg-white"
                            }`}
                          />
                          {sensor.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full bg-[#2E7D32] text-white">
              Subscribe
            </Button>
          </form>

          {success && (
            <p className="text-green-600 text-sm mt-2">
              Subscribed successfully!
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
