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

const sensors = [
  { value: "station1", label: "Nairobi Central Station" },
  { value: "station2", label: "Westlands Station" },
  { value: "station3", label: "Industrial Area Station" },
  { value: "station4", label: "Kibera Station" },
];

export default function EmailAlertSection() {
  const [selected, setSelected] = useState<{ value: string; label: string }[]>(
    []
  );
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = sensors.filter(
    (s) =>
      s.label.toLowerCase().includes(query.toLowerCase()) &&
      !selected.find((sel) => sel.value === s.value)
  );

  const addSensor = (sensor: { value: string; label: string }) => {
    setSelected([...selected, sensor]);
    setQuery("");
  };

  const removeSensor = (value: string) => {
    setSelected(selected.filter((s) => s.value !== value));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-primary/70 hover:bg-primary/90 text-primary-foreground font-bold px-10 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {" "}
          <Bell className="mr-2 h-5 w-5" /> Get Air Quality Alerts{" "}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get Air Quality Alerts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name */}
          <div>
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

          {/* Sensors Multi-select */}
          <div>
            <Label>Sensors</Label>
            <div className="border rounded-md px-2 py-1 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-green-600">
              {selected.map((sensor) => (
                <span
                  key={sensor.value}
                  className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                >
                  {sensor.label}
                  <button
                    type="button"
                    onClick={() => removeSensor(sensor.value)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  selected.length ? "" : "Search and select sensors..."
                }
                className="flex-grow min-w-[120px] outline-none p-1 text-sm"
              />
            </div>

            {/* Dropdown for options */}
            {query && filteredOptions.length > 0 && (
              <div className="border rounded-md mt-1 bg-white shadow-lg max-h-40 overflow-auto z-50 relative">
                {filteredOptions.map((s) => (
                  <div
                    key={s.value}
                    onClick={() => addSensor(s)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full bg-green-700 hover:bg-green-800"
            onClick={() => {
              console.log({ name, email, sensors: selected });
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
