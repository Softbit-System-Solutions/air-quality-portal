// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", //  proxies to the backend (set in next.config.js)
  headers: {
    "Content-Type": "application/json",
  },
});

export interface FakeStation {
  id: string;
  sensorId: string;
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  lat: number;
  lng: number;
  sensorType?: string;
  historicalData: FakeHistoricalData[];
}

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
}


export interface HistoricalData {
  date: string;
  avg_aqi: number;
  avg_pm25: number;
  avg_pm10: number;
}


export interface FakeHistoricalData {
  date: string;
  aqi: number;
  pm25: number;
  pm10: number;
}

export const getStations = async () => {
  const response = await api.get("/stations");
  return response.data;
};

export const getHistoricalData = async (sensorId: string) => {
  const response = await api.get(`/sensors/${sensorId}/readings/?range=30`);
  return response.data;
};

export const subscribeToAlerts = async (email: string) => {
  const response = await api.post("/alerts/subscribe", { email });
  return response.data;
};
