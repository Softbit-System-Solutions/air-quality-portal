"use client"

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import dynamic from "next/dynamic";
// import TrendsChart from "@/components/trends-chart";
import Navbar from "@/components/navbar";
import EmailAlertSection from "@/components/email-alert-section";
import FeedbackSection from "@/components/feedbacksection";
import Footer from "@/components/footersection";
import { getHistoricalData, getStations } from "@/lib/api";
import Legend from "./legend";
import { Station } from "@/lib/api";
import TrendsChart from "./trends-chart";


// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
});

type PollutantType = "aqi" | "pm25" | "pm10";

interface PollutantOption {
  value: PollutantType;
  label: string;
  unit: string;
}

const pollutantOptions: PollutantOption[] = [
  { value: "aqi", label: "AQI", unit: "" },
  { value: "pm25", label: "PM 2.5", unit: "μg/m³" },
  { value: "pm10", label: "PM 10", unit: "μg/m³" },
];



function getPollutantValue(station: Station, pollutant: PollutantType): number {
  switch (pollutant) {
    case "aqi":
      return station.aqi;
    case "pm25":
      return station.pm25;
    case "pm10":
      return station.pm10;
    default:
      return station.aqi;
  }
}

function getPollutantColor(value: number, pollutant: PollutantType): string {
  const colorByAQI = (aqi: number): string => {
    if (aqi <= 50) return "#00e400"; // Good – Green
    if (aqi <= 100) return "#ffff00"; // Moderate – Yellow
    if (aqi <= 150) return "#ff7e00"; // Unhealthy for sensitive – Orange
    if (aqi <= 200) return "#ff0000"; // Unhealthy – Red
    if (aqi <= 300) return "#8f3f97"; // Very unhealthy – Purple
    return "#7e0023"; // Hazardous – Maroon
  };

  if (pollutant === "aqi") {
    return colorByAQI(value);
  } else if (pollutant === "pm25") {
    // assume value already given as AQI-equivalent scale
    return colorByAQI(value);
  } else if (pollutant === "pm10") {
    // assume value is pm10 broken into equivalent AQI ranges
    return colorByAQI(value);
  }

  return "#00e400"; // default – Good
}

function getPollutantLevel(value: number, pollutant: PollutantType): string {
  if (pollutant === "aqi") {
    if (value <= 50) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 150) return "Unhealthy for Sensitive Groups";
    if (value <= 200) return "Unhealthy";
    if (value <= 300) return "Very Unhealthy";
    return "Hazardous";
  }

  if (pollutant === "pm25") {
    if (value <= 12) return "Good";
    if (value <= 35.4) return "Moderate";
    if (value <= 55.4) return "Unhealthy for Sensitive Groups";
    if (value <= 150.4) return "Unhealthy";
    if (value <= 250.4) return "Very Unhealthy";
    return "Hazardous";
  }

  if (pollutant === "pm10") {
    if (value <= 54) return "Good";
    if (value <= 154) return "Moderate";
    if (value <= 254) return "Unhealthy for Sensitive Groups";
    if (value <= 354) return "Unhealthy";
    if (value <= 424) return "Very Unhealthy";
    return "Hazardous";
  }

  return "Good";
}

export default function Dashboard() {

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendsStation, setTrendsStation] = useState<Station | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isTrendsDropdownOpen, setIsTrendsDropdownOpen] = useState(false);

  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>("aqi");

  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  // Effect #1: Fetch station
useEffect(() => {
  const fetchStations = async () => {
    setLoading(true);
    try {
      const stationsData: Station[] = await getStations();
      setStations(stationsData);
      setTrendsStation(stationsData[0] ?? null);

      //timestamps from `time`
      const timestamps = stationsData
        .map((s) => s.time)
        .filter((t): t is string => Boolean(t));

      if (timestamps.length > 0) {
        const latestTimestamp = new Date(
          Math.max(...timestamps.map((t) => new Date(t).getTime()))
        );
        setLastUpdateTime(latestTimestamp.toLocaleString());
      } else {
        setLastUpdateTime(null);
      }
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load stations");
    } finally {
      setLoading(false);
    }
  };

  fetchStations();


}, []);
  // if (loading) return <p>Loading...</p>;

  // const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>("aqi");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentPollutantOption = pollutantOptions.find(
    (option) => option.value === selectedPollutant
  )!;

  // Filter stations by name case-insensitive
  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#ffffff] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
              <span className="text-[#101828] font-medium">Pollutants</span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1 text-[#101828] hover:bg-[#eaecf0] rounded-md transition-colors w-full sm:w-auto justify-between sm:justify-start"
                >
                  <span className="sm:hidden">Select Pollutant</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#667085] transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 sm:right-auto mt-1 mb-3 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50 min-w-[120px]">
                    {pollutantOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedPollutant(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#eaecf0] transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="text-[#101828] font-medium">
                          {option.label}
                        </span>
                        {selectedPollutant === option.value && (
                          <Check className="w-4 h-4 text-[#101828]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[#101828] font-medium text-lg sm:text-xl">
              {currentPollutantOption.label}
              {currentPollutantOption.unit && (
                <span className="text-[#667085] font-normal ml-1 text-base">
                  ({currentPollutantOption.unit})
                </span>
              )}
            </div>
          </div> */}


          <div className="my-5">
            <h1 className="text-3xl font-bold text-gray-800">
              Nairobi Air Quality
            </h1>
            <div className="flex items-center text-sm text-gray-600 mt-1">
                
             {lastUpdateTime && (
                  <div className="flex items-center text-sm text-green-700 mt-1">
                    <span className="font-medium">Live Data:</span>
                    <span className="ml-1">{lastUpdateTime}</span>
                  </div>
                )}
            </div>
          </div>

          {/* Map Container */}
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <div className="h-[400px] sm:h-[500px] lg:h-[650px]">
              <MapComponent
                stations={stations}
                selectedStation={selectedStation}
                selectedPollutant={selectedPollutant}
                onStationSelect={setSelectedStation}
                getPollutantValue={getPollutantValue}
                getPollutantColor={getPollutantColor}
                getPollutantLevel={getPollutantLevel}
              />
            </div>
            <div className="border-black w-full py-2">
              {" "}
              <Legend />
            </div>
          </div>

          {/* Selected Station Info */}
          <div className="mb-6 p-4 bg-[#eaefff] rounded-lg">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search station by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />

              {searchTerm && (
                <ul className="max-h-40 overflow-auto bg-white border rounded mt-1">
                  {filteredStations.length > 0 ? (
                    filteredStations.map((station) => (
                      <li
                        key={station.id}
                        onClick={() => {
                          setSelectedStation(station);
                          setSearchTerm(""); // clear search after select
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {station.name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 italic text-gray-500">
                      No matching stations
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Selected Station Info Display */}
            {selectedStation && (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[#101828] font-semibold">
                    {selectedStation.name}
                  </h4>
                  <p className="text-[#667085] text-sm">
                    Current {currentPollutantOption.label}:{" "}
                    <span className="font-medium">
                      {getPollutantValue(selectedStation, selectedPollutant)}
                      {currentPollutantOption.unit &&
                        ` ${currentPollutantOption.unit}`}
                    </span>{" "}
                    -{" "}
                    {getPollutantLevel(
                      getPollutantValue(selectedStation, selectedPollutant),
                      selectedPollutant
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: getPollutantColor(
                        getPollutantValue(selectedStation, selectedPollutant),
                        selectedPollutant
                      ),
                    }}
                  ></div>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="text-[#667085] hover:text-[#101828] text-sm"
                    aria-label="Clear selected station"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 my-24">
            {/* Cleanest Station */}
            <div>
              <h3 className="text-[#101828] font-semibold text-lg mb-2">
                Cleanest station
              </h3>
              <p className="text-[#667085] text-sm mb-4">
                Real-time Nairobi cleanest city ranking
              </p>

              <div className="bg-[#ffffff] border border-[#eaecf0] rounded-lg overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-[#eaecf0] text-[#667085] text-sm font-medium">
                  <div className="col-span-1">#</div>
                  <div className="col-span-8">Station</div>
                  <div className="col-span-3">
                    {currentPollutantOption.label}
                  </div>
                </div>
                {stations
                  .sort(
                    (a, b) =>
                      getPollutantValue(a, selectedPollutant) -
                      getPollutantValue(b, selectedPollutant)
                  )
                  .slice(0, 5)
                  .map((station, index) => {
                    const value = getPollutantValue(station, selectedPollutant);
                    return (
                      <div
                        key={station.id}
                        className="sm:grid sm:grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[#eaecf0] cursor-pointer transition-colors border-b border-[#eaecf0] last:border-b-0"
                        onClick={() => setSelectedStation(station)}
                      >
                        <div className="sm:col-span-1 text-[#101828] font-medium inline sm:block">
                          <span className="sm:hidden text-[#667085] text-sm">
                            #{index + 1}{" "}
                          </span>
                          <span className="hidden sm:inline">{index + 1}</span>
                        </div>
                        <div className="sm:col-span-8 text-[#101828] font-medium sm:font-normal">
                          {station.name}
                        </div>
                        <div className="sm:col-span-3 mt-1 sm:mt-0">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded text-sm font-medium text-[#101828]"
                            style={{
                              backgroundColor: getPollutantColor(
                                value,
                                selectedPollutant
                              ),
                            }}
                          >
                            {value}
                            {currentPollutantOption.unit &&
                              ` ${currentPollutantOption.unit}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Most Polluted Station */}
            <div>
              <h3 className="text-[#101828] font-semibold text-lg mb-2">
                Most polluted station
              </h3>
              <p className="text-[#667085] text-sm mb-4">
                Real-time Nairobi most polluted city ranking
              </p>

              <div className="bg-[#ffffff] border border-[#eaecf0] rounded-lg overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-[#eaecf0] text-[#667085] text-sm font-medium">
                  <div className="col-span-1">#</div>
                  <div className="col-span-8">Station</div>
                  <div className="col-span-1">
                    {currentPollutantOption.label}
                  </div>
                </div>
                {stations
                  .sort(
                    (a, b) =>
                      getPollutantValue(b, selectedPollutant) -
                      getPollutantValue(a, selectedPollutant)
                  )
                  .slice(0, 5)
                  .map((station, index) => {
                    const value = getPollutantValue(station, selectedPollutant);
                    return (
                      <div
                        key={station.id}
                        className="sm:grid sm:grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[#eaecf0] cursor-pointer transition-colors border-b border-[#eaecf0] last:border-b-0"
                        onClick={() => setSelectedStation(station)}
                      >
                        <div className="sm:col-span-1 text-[#101828] font-medium inline sm:block">
                          <span className="sm:hidden text-[#667085] text-sm">
                            #{index + 1}{" "}
                          </span>
                          <span className="hidden sm:inline">{index + 1}</span>
                        </div>
                        <div className="sm:col-span-8 text-[#101828] font-medium sm:font-normal">
                          {station.name}
                        </div>
                        <div className="sm:col-span-3 mt-1 sm:mt-0">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded text-sm font-medium"
                            style={{
                              backgroundColor: getPollutantColor(
                                value,
                                selectedPollutant
                              ),
                              color:
                                value >
                                (selectedPollutant === "aqi"
                                  ? 70
                                  : selectedPollutant === "pm25"
                                  ? 35
                                  : 60)
                                  ? "#ffffff"
                                  : "#101828",
                            }}
                          >
                            {value}
                            {currentPollutantOption.unit &&
                              ` ${currentPollutantOption.unit}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Trends Section */}
          <section id="trends" className="py-10">
            <TrendsChart
              stations={stations}
              pollutant={selectedPollutant}
              pollutantLabel={currentPollutantOption.label}
              pollutantUnit={currentPollutantOption.unit}
            /> 
          </section>

          {/* Trend stations is a station being looked at by the trends component */}

          {/* Email Section */}
          <section
            id="alerts"
            className="py-36"
          >
            <div className="bg-[#2E7D32] text-white h-[55vh] py-20 p-4 w-[100vw] -ml-[8px] sm:-ml-[calc((100vw-100%)/2)]">
            <div className="max-w-4xl mx-auto h-full flex flex-col justify-center items-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
                Get air quality alerts in your inbox
              </h2>
              <EmailAlertSection 
                stations={stations}
              />
            </div>
            </div>
          </section>
          {/* Feedback Section */}
          <section id='feedback'>
            <FeedbackSection />
          </section>
          {/* Footer  Section */}
        </div>
      </div>
      <section>
        <Footer />
      </section>
    </div>
  );
}
