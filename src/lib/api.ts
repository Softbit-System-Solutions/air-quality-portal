// lib/api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", //  proxies to the backend (set in next.config.js)
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
  time?: string; 
}


export interface HistoricalData {
  pm25: number;
  aqi: number;
  timestamp: string | number | Date;
  pm10: number;
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
  const response = await fetch('https://161.97.134.211:4443/api/v1/stations', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText}`);
  }

  const data = await response.json(); // 👈 parse the JSON response
  const stations = data.data; // your backend likely wraps results inside "data"

  // Ensure it's an array before mapping
  return Array.isArray(stations)
    ? stations.map((station: any) => ({
        ...station,
        pm10: station.pm10 ? Number(station.pm10.toFixed(2)) : null,
        pm25: station.pm25 ? Number(station.pm25.toFixed(2)) : null,
      }))
    : stations;
};


export const getHistoricalData = async (sensorId: string, period=24) => {
  const response = await api.get(`/sensors/${sensorId}/readings/?range=${period}`);
  return response.data.data;
};

export const subscribeToAlerts = async (payload: any) => {
  const response = await api.post("/alerts/subscribe",  payload );
  return response.data.data;
};

export const submitFeedback = async (payload: any) => {
  const response = await api.post("/feedback",  payload );
  return response.data.data;
};
