"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

import { getHistoricalData, HistoricalData, Station } from "@/lib/api";

import { ChartOptions } from "chart.js";

// ✅ register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

type PollutantType = "aqi" | "pm25" | "pm10";

interface PollutantOption {
  value: PollutantType;
  label: string;
  unit: string;
}

interface TrendsChartProps {
  stations: Station[];
  pollutant: PollutantType;
  pollutantLabel: string;
  pollutantUnit: string;
}

const DURATIONS = [3, 6, 12, 24, 48, 72];

const POLLUTANT_COLOR_MAP: Record<PollutantType, string> = {
  aqi: "#3b82f6",
  pm25: "#ef4444",
  pm10: "#f59e0b",
};

// Example threshold values
const THRESHOLD_MAP: Record<PollutantType, number | string> = {
  aqi: '',
  pm25: 15,
  pm10: 45,
};

const pollutantOptions: PollutantOption[] = [
  { value: "aqi", label: "AQI", unit: "" },
  { value: "pm25", label: "PM 2.5", unit: "μg/m³" },
  { value: "pm10", label: "PM 10", unit: "μg/m³" },
];

export default function TrendsChart({
  stations,
  pollutant,
  pollutantLabel,
  pollutantUnit,
}: TrendsChartProps) {
  const [duration, setDuration] = useState(12);
  const [trendsStation, setTrendsStation] = useState<Station | null>(
    stations[0] || null
  );
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>(
    pollutant
  );

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationId = trendsStation?.sensorId;
        if(!stationId) return;

        const historyData = await getHistoricalData(stationId, duration);
        setHistoricalData(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error(err);
        setHistoricalData([]);
      }
    };
    fetchData();
  }, [trendsStation, duration, selectedPollutant]);

  const currentPollutantOption =
    pollutantOptions.find((p) => p.value === selectedPollutant) ||
    pollutantOptions[0];

  const thresholdValue = THRESHOLD_MAP[selectedPollutant] ?? 0;

  const chartData = {
    labels: historicalData
      .slice(-duration)
      .map((item) =>
        new Date(item.timeStamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
    datasets: [
      {
        label: `${currentPollutantOption.label}${
          currentPollutantOption.unit ? ` (${currentPollutantOption.unit})` : ""
        }`,
        data: historicalData.slice(-duration).map((item) => {
          if (selectedPollutant === "aqi") return item.aqi;
          if (selectedPollutant === "pm25") return item.pm25;
          return item.pm10;
        }),
        borderColor: "blue",
        backgroundColor: POLLUTANT_COLOR_MAP[selectedPollutant] + "33",
        fill: true,
        tension: 0.3,
      },
      // ✅ Only show threshold dataset if NOT AQI
      ...(selectedPollutant !== "aqi"
        ? [
            {
              label: `WHO (${thresholdValue} μg/m³)`,
              data: Array(historicalData.slice(-duration).length).fill(thresholdValue),
              borderColor: "red",
              borderWidth: 1,
              borderDash: [5, 5],
              pointRadius: 0, // hide points
              fill: false,
            },
          ]
        : []),
    ],
  };
  
  

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index" as const },
      annotation: {
        annotations: {
          thresholdLine: {
            type: "line",
            yMin: thresholdValue,
            yMax: thresholdValue,
            borderColor: "red",
            borderWidth: 0.5,
            borderDash: [5, 5],
            // label: {
            //   display: true,
            //   position: "end",   // end of the line
            //   color: "red",
            //   backgroundColor: "transparent",
            //   font: { weight: "bold", size: 12 },
            //   xAdjust: 0,       // moves label slightly right
            //   yAdjust: 0,
            // },
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `${currentPollutantOption.label}${
            currentPollutantOption.unit ? ` (${currentPollutantOption.unit})` : ""
          }`,
        },
      },
    },
  };
  
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Air Quality Trends in Nairobi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-5">
          {/* Duration */}
          <Select
            value={duration.toString()}
            onValueChange={(val) => setDuration(parseInt(val))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((d) => (
                <SelectItem key={d} value={d.toString()}>
                  Last {d} hours
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Station */}
          <Select
            value={trendsStation?.id ?? ""}
            onValueChange={(val) => {
              const selected = stations.find((s) => s.id === val) || null;
              setTrendsStation(selected);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Pollutant */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {currentPollutantOption.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {pollutantOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setSelectedPollutant(opt.value)}
                >
                  {opt.label}
                  {selectedPollutant === opt.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
