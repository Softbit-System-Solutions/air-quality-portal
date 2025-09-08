"use client";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,            // ✅ use Label components for axis labels
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
import { getHistoricalData, HistoricalData, Station } from "@/lib/api";
import { Check, ChevronDown } from "lucide-react";

interface TrendsChartProps {
  stations: Station[];
  data: HistoricalData[];
  pollutant: "aqi" | "pm25" | "pm10";
  pollutantLabel: string;
  pollutantUnit: string;
}

type PollutantType = "aqi" | "pm25" | "pm10";

interface PollutantOption {
  value: PollutantType;
  label: string;
  unit: string;
}

const DURATIONS = [3, 6, 12, 24, 48, 72];

const POLLUTANT_VALUE_FIELD: Record<PollutantType, keyof HistoricalData> = {
  aqi: "avg_aqi",
  pm25: "avg_pm25",
  pm10: "avg_pm10",
};

const POLLUTANT_COLOR_MAP: Record<PollutantType, string> = {
  aqi: "#3b82f6", // Blue
  pm25: "#ef4444", // Red
  pm10: "#f59e0b", // Orange
};

export default function TrendsChart({
  stations,
  data,
  pollutant,
  pollutantLabel,
  pollutantUnit,
}: TrendsChartProps) {
  const [duration, setDuration] = useState<number>(24);
  const [trendsStation, setTrendsStation] = useState<Station | null>(stations[0] || null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>(Array.isArray(data) ? data : []);
  const [isDropdownPollutantOpen, setPollutantDropdownIsOpen] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>(pollutant);

  const pollutantOptions: PollutantOption[] = [
    { value: "aqi", label: "AQI", unit: "" },
    { value: "pm25", label: "PM 2.5", unit: "μg/m³" },
    { value: "pm10", label: "PM 10", unit: "μg/m³" },
  ];

  // Fetch data when station or duration changes
  useEffect(() => {
    if (!trendsStation) return;

    const fetchHistoricalData = async () => {
      try {
        const historyData = await getHistoricalData(trendsStation.id, duration);
        setHistoricalData(Array.isArray(historyData) ? historyData : []);
      } catch (error) {
        console.error("Failed to load historical data", error);
        setHistoricalData([]);
      }
    };

    fetchHistoricalData();
  }, [trendsStation, duration]);

  const currentPollutantOption =
    pollutantOptions.find((opt) => opt.value === selectedPollutant) || pollutantOptions[0];

  const valueField = POLLUTANT_VALUE_FIELD[selectedPollutant];

  const filteredData = (historicalData ?? []).slice(-duration).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: item[valueField] as number,
    fullDate: item.date,
  }));

  const chartColor = POLLUTANT_COLOR_MAP[selectedPollutant] || "#3b82f6";

  return (
    <div className="h-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-[#101828] font-semibold text-2xl">
          Air Quality Trends in Nairobi
        </h3>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Duration selector */}
          <div>
            <h4 className="text-[#101828] font-medium text-lg mb-2">
              {pollutantLabel} Trends
            </h4>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="text-sm border rounded px-3 py-1 text-[#101828] bg-white cursor-pointer"
            >
              {DURATIONS.map((period) => (
                <option key={period} value={period}>
                  Last {period} hours
                </option>
              ))}
            </select>
          </div>

          {/* Station selector */}
          <select
            value={trendsStation?.id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedStation =
                stations.find((station) => station.id === selectedId) || null;
              if (selectedStation) {
                setTrendsStation(selectedStation);
              }
            }}
            className="px-4 py-2 bg-white border border-[#eaecf0] rounded-lg hover:bg-[#eaecf0] transition-colors text-[#101828] font-medium cursor-pointer w-full sm:w-auto"
          >
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>

          {/* Pollutant selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setPollutantDropdownIsOpen(!isDropdownPollutantOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-[#eaecf0] rounded-lg bg-white hover:bg-[#eaecf0] transition-colors text-[#101828] font-medium w-full sm:w-auto justify-between cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isDropdownPollutantOpen}
            >
              <span className="truncate">{currentPollutantOption.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#667085] transition-transform ${
                  isDropdownPollutantOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownPollutantOpen && (
              <div
                className="absolute top-full right-0 mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50 min-w-[140px]"
                role="listbox"
              >
                {pollutantOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedPollutant(option.value);
                      setPollutantDropdownIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#eaecf0] transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                    role="option"
                    aria-selected={selectedPollutant === option.value}
                    tabIndex={0}
                  >
                    <span className="text-[#101828] font-medium truncate">
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

        {/* Pollutant unit display */}
        <div className="text-[#101828] font-medium text-lg sm:text-xl">
          {currentPollutantOption.label}
          {currentPollutantOption.unit && (
            <span className="text-[#667085] font-normal ml-1 text-base">
              ({currentPollutantOption.unit})
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px]">
        <ChartContainer
          config={{
            value: {
              label: currentPollutantOption.label,
              color: chartColor,
            },
          }}
          className="w-full h-full overflow-visible"   // ✅ ensure labels aren't clipped
        >
          <div className="w-full h-full overflow-visible"> {/* ✅ wrapper to allow overflow */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 16, right: 32, left: 56, bottom: 40 }} // ✅ more room for labels
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eaecf0" />

                {/* X Axis */}
                <XAxis
                  dataKey="date"
                  stroke="#667085"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                >
                  <Label
                    value="Time"
                    position="insideBottom"  // ✅ inside to avoid clipping
                    offset={-10}
                    style={{ fill: "#667085", fontSize: 13 }}
                  />
                </XAxis>

                {/* Y Axis */}
                <YAxis
                  stroke="#667085"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                >
                  <Label
                    value={`${currentPollutantOption.label}${
                      currentPollutantOption.unit ? ` (${currentPollutantOption.unit})` : ""
                    }`}
                    angle={-90}
                    position="insideLeft"   // ✅ inside to avoid clipping
                    offset={10}
                    style={{ fill: "#667085", fontSize: 13 }}
                  />
                </YAxis>

                {/* Tooltip */}
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      const fullDate = payload[0].payload?.fullDate;
                      if (fullDate) {
                        return new Date(fullDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                      }
                    }
                    return label;
                  }}
                  formatter={(value) => [
                    `${value}${currentPollutantOption.unit ? ` ${currentPollutantOption.unit}` : ""}`,
                    currentPollutantOption.label,
                  ]}
                />

                {/* Line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={{ fill: chartColor, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
