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
  const response = await api.get("/stations");
  return response.data;
};

export const getHistoricalData = async (sensorId= '1', period=24) => {
  const response = await api.get(`/sensors/${sensorId}/readings/?range=${period}`);
  return response.data;
};

export const subscribeToAlerts = async (payload: any) => {
  const response = await api.post("/alerts/subscribe",  payload );
  return response.data;
};

export const submitFeedback = async (payload: any) => {
  const response = await api.post("/feedback",  payload );
  return response.data;
};
