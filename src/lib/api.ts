// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", //  proxies to the backend (set in next.config.js)
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Station {
  id: string;
  sensorId: string;
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  lat: number;
  lng: number;
  sensorType?: string;
  // historicalData: HistoricalData[];
}

export const getStations = async () => {
  const response = await api.get("/stations");

  const stationsWithCoords = response.data.map((station: any) => ({
    ...station,
    lat: "-1.2321",
    lng: "36.8947",
    aqi: "10"
  }));

  console.log(stationsWithCoords);
  return stationsWithCoords;
};

export const getHistoricalData = async () => {
  const response = await api.get("/sensors/1/readings/?range=30");
  const readinWithAqi = response.data.map((historicalData: any) => ({
    ...historicalData,
    avg_aqi: 10
  }));

  console.log(readinWithAqi)
  return readinWithAqi;
};

export const subscribeToAlerts = async (
  from: string,
  to: string,
  amount: number
) => {
  const response = await api.post("/alerts", { from, to, amount });
  return response.data;
};
