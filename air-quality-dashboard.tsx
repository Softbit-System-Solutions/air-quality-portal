"use client";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import dynamic from "next/dynamic";
import TrendsChart from "./trends-chart";
import Navbar from "./navbar";
import EmailAlertSection from "./email-alert-section";
import FeedbackSection from "./feedbacksection";
import Footer from "./footersection";
// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
});

export interface Station {
  id: string;
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  lat: number;
  lng: number;
  type?: string;
  historicalData: HistoricalData[];
}

interface HistoricalData {
  date: string;
  aqi: number;
  pm25: number;
  pm10: number;
}

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

// Generate sample historical data for the last 30 days
function generateHistoricalData(
  baseAqi: number,
  basePm25: number,
  basePm10: number
): HistoricalData[] {
  const data: HistoricalData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some realistic variation to the data
    const variation = (Math.random() - 0.5) * 0.3;
    const seasonalTrend = Math.sin((i / 30) * Math.PI * 2) * 0.1;

    data.push({
      date: date.toISOString().split("T")[0],
      aqi: Math.round(baseAqi * (1 + variation + seasonalTrend)),
      pm25: Math.round(basePm25 * (1 + variation + seasonalTrend)),
      pm10: Math.round(basePm10 * (1 + variation + seasonalTrend)),
    });
  }

  return data;
}

// Real coordinates for Nairobi air quality monitoring stations with all pollutant data
const stations: Station[] = [
  {
    id: "1",
    name: "Karura Forest",
    aqi: 55,
    pm25: 22,
    pm10: 35,
    lat: -1.2321,
    lng: 36.8947,
    historicalData: generateHistoricalData(55, 22, 35),
  },
  {
    id: "2",
    name: "CBD Station",
    aqi: 95,
    pm25: 45,
    pm10: 78,
    lat: -1.2864,
    lng: 36.8172,
    historicalData: generateHistoricalData(95, 45, 78),
  },
  {
    id: "3",
    name: "Village Market",
    aqi: 35,
    pm25: 15,
    pm10: 28,
    lat: -1.2505,
    lng: 36.8031,
    historicalData: generateHistoricalData(35, 15, 28),
  },
  {
    id: "4",
    name: "Westlands",
    aqi: 46,
    pm25: 19,
    pm10: 32,
    lat: -1.2676,
    lng: 36.8108,
    historicalData: generateHistoricalData(46, 19, 32),
  },
  {
    id: "5",
    name: "Gigiri",
    aqi: 25,
    pm25: 12,
    pm10: 20,
    lat: -1.2342,
    lng: 36.8156,
    historicalData: generateHistoricalData(25, 12, 20),
  },
  {
    id: "6",
    name: "Kasarani",
    aqi: 32,
    pm25: 14,
    pm10: 25,
    lat: -1.2198,
    lng: 36.8897,
    historicalData: generateHistoricalData(32, 14, 25),
  },
  {
    id: "7",
    name: "Embakasi",
    aqi: 78,
    pm25: 38,
    pm10: 65,
    lat: -1.3031,
    lng: 36.8978,
    historicalData: generateHistoricalData(78, 38, 65),
  },
  {
    id: "8",
    name: "Kibera",
    aqi: 67,
    pm25: 32,
    pm10: 55,
    lat: -1.3133,
    lng: 36.7919,
    historicalData: generateHistoricalData(67, 32, 55),
  },
  {
    id: "9",
    name: "Mathare",
    aqi: 72,
    pm25: 35,
    pm10: 58,
    lat: -1.2588,
    lng: 36.8581,
    historicalData: generateHistoricalData(72, 35, 58),
  },
  {
    id: "10",
    name: "Eastlands",
    aqi: 58,
    pm25: 28,
    pm10: 45,
    lat: -1.2743,
    lng: 36.8919,
    historicalData: generateHistoricalData(58, 28, 45),
  },
  {
    id: "11",
    name: "Ngong Road",
    aqi: 41,
    pm25: 18,
    pm10: 30,
    lat: -1.3019,
    lng: 36.8108,
    historicalData: generateHistoricalData(41, 18, 30),
  },
  {
    id: "12",
    name: "Thika Road",
    aqi: 39,
    pm25: 16,
    pm10: 29,
    lat: -1.2198,
    lng: 36.8581,
    historicalData: generateHistoricalData(39, 16, 29),
  },
  {
    id: "13",
    name: "Langata",
    aqi: 29,
    pm25: 13,
    pm10: 22,
    lat: -1.3667,
    lng: 36.7919,
    historicalData: generateHistoricalData(29, 13, 22),
  },
  {
    id: "14",
    name: "Parklands",
    aqi: 33,
    pm25: 15,
    pm10: 26,
    lat: -1.2505,
    lng: 36.8297,
    historicalData: generateHistoricalData(33, 15, 26),
  },
  {
    id: "15",
    name: "Industrial Area",
    aqi: 85,
    pm25: 42,
    pm10: 70,
    lat: -1.3019,
    lng: 36.8581,
    historicalData: generateHistoricalData(85, 42, 70),
  },
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
  if (pollutant === "aqi") {
    if (value <= 30) return "#a8e05f"; // Good - Green
    if (value <= 50) return "#fdd64b"; // Moderate - Yellow
    if (value <= 70) return "#facf39"; // Unhealthy for sensitive - Orange
    return "#f05151"; // Unhealthy - Red
  } else if (pollutant === "pm25") {
    if (value <= 12) return "#a8e05f"; // Good - Green
    if (value <= 25) return "#fdd64b"; // Moderate - Yellow
    if (value <= 35) return "#facf39"; // Unhealthy for sensitive - Orange
    return "#f05151"; // Unhealthy - Red
  } else if (pollutant === "pm10") {
    if (value <= 20) return "#a8e05f"; // Good - Green
    if (value <= 40) return "#fdd64b"; // Moderate - Yellow
    if (value <= 60) return "#facf39"; // Unhealthy for sensitive - Orange
    return "#f05151"; // Unhealthy - Red
  }
  return "#a8e05f";
}

function getPollutantLevel(value: number, pollutant: PollutantType): string {
  if (pollutant === "aqi") {
    if (value <= 30) return "Good";
    if (value <= 50) return "Moderate";
    if (value <= 70) return "Unhealthy for Sensitive";
    return "Unhealthy";
  } else if (pollutant === "pm25") {
    if (value <= 12) return "Good";
    if (value <= 25) return "Moderate";
    if (value <= 35) return "Unhealthy for Sensitive";
    return "Unhealthy";
  } else if (pollutant === "pm10") {
    if (value <= 20) return "Good";
    if (value <= 40) return "Moderate";
    if (value <= 60) return "Unhealthy for Sensitive";
    return "Unhealthy";
  }
  return "Good";
}

export default function Dashboard() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  // const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>("aqi");
  const selectedPollutant = "aqi"
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [trendsStation, setTrendsStation] = useState<Station>(stations[0]); // Default to first station
  const [isTrendsDropdownOpen, setIsTrendsDropdownOpen] = useState(false);

  const currentPollutantOption = pollutantOptions.find(
    (option) => option.value === selectedPollutant
  )!;

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

          {/* Header */}

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Nairobi Air Quality Portal
            </h1>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span>Last updated: {new Date().toLocaleString()}</span>
              <span className="ml-4 px-2 py-0.5 text-green-700 bg-green-100 rounded-full text-xs">
                Live Data
              </span>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-32">
            <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
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
          </div>

          {/* Selected Station Info
          {selectedStation && (
            <div className="mb-6 p-4 bg-[#eaecf0] rounded-lg border border-[#667085]">
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
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )} */}

          {/* Bottom Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 my-32">
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
                  .slice(0, 3)
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
                  <div className="col-span-3">
                    {currentPollutantOption.label}
                  </div>
                </div>
                {stations
                  .sort(
                    (a, b) =>
                      getPollutantValue(b, selectedPollutant) -
                      getPollutantValue(a, selectedPollutant)
                  )
                  .slice(0, 3)
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
          <section id="trends" className="py-20 mb-32">
            <div className="flex relative flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-[#101828] font-semibold text-2xl mb-1">
                  Air Quality Trends in Nairobi
                </h3>
              </div>
              <div>
                <button
                  onClick={() => setIsTrendsDropdownOpen(!isTrendsDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eaecf0] rounded-lg hover:bg-[#eaecf0] transition-colors w-full sm:w-auto justify-between"
                >
                  <span className="text-[#101828] font-medium truncate">
                    {trendsStation.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#667085] transition-transform flex-shrink-0 ${
                      isTrendsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isTrendsDropdownOpen && (
                  <div className="absolute my-16 top-full left-0 right-0 sm:right-0 sm:left-auto mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                    {stations.map((station) => (
                      <button
                        key={station.id}
                        onClick={() => {
                          setTrendsStation(station);
                          setIsTrendsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#eaecf0] transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="text-[#101828] font-medium truncate">
                          {station.name}
                        </span>
                        {trendsStation.id === station.id && (
                          <Check className="w-4 h-4 text-[#101828] flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <TrendsChart
              data={trendsStation.historicalData}
              pollutant={selectedPollutant}
              stationName={trendsStation.name}
              pollutantLabel={currentPollutantOption.label}
              pollutantUnit={currentPollutantOption.unit}
            />
          </section>

          {/* Email Section */}
          <section
            id="alerts"
            className="bg-[#2E7D32] mt-3 text-white h-[50vh] py-16 p-4 w-[100vw] -ml-[8px] sm:-ml-[calc((100vw-100%)/2)]"
          >
            {" "}
            <div className="max-w-4xl mx-auto h-full flex flex-col justify-center items-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
                Get air quality alerts in your inbox
              </h2>
              <EmailAlertSection />
            </div>
          </section>
          {/* Feedback Section */}
          <section>
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
