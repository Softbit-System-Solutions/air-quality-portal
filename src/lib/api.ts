/* eslint-disable @typescript-eslint/no-explicit-any */

// Base API URL for all requests
const BASE_URL = "https://xp-backend.sytes.net/api/v1";

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
  timeStamp?: string;
}

export interface HistoricalData {
  pm25: number;
  aqi: number;
  timeStamp: string | number | Date;
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

// 🔹 Common helper to handle fetch + JSON parsing + errors
const fetchJSON = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`);
  }

  return response.json();
};

// 🔹 Get all stations
export const getStations = async (): Promise<Station[]> => {
  const data = await fetchJSON(`${BASE_URL}/stations`);
  const stations = data.data;

  return Array.isArray(stations)
    ? stations.map((station: any) => ({
        ...station,
        pm10: station.pm10 ? Number(station.pm10.toFixed(2)) : null,
        pm25: station.pm25 ? Number(station.pm25.toFixed(2)) : null,
      }))
    : stations;
};

// 🔹 Get historical readings for a given sensor
export const getHistoricalData = async (sensorId: string, period = 24): Promise<HistoricalData[]> => {
  const data = await fetchJSON(`${BASE_URL}/stations/${sensorId}/readings?range=${period}&direction=asc&sort=timeStamp`);
  return data.data;
};

// 🔹 Subscribe to alerts
export const subscribeToAlerts = async (payload: any): Promise<any> => {
  const data = await fetchJSON(`${BASE_URL}/alerts/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data;
};

// 🔹 unSubscribe to alerts
export const unsubscribeFromAlerts = async (id: string): Promise<any> => {
  console.log('I am being called')
  const data = await fetchJSON(`${BASE_URL}/alerts/users/${id}/unsubscribe`, {
    method: "POST",
  });
  return data.data;
};

// 🔹 Submit feedback
export const submitFeedback = async (payload: any): Promise<any> => {
  const data = await fetchJSON(`${BASE_URL}/feedback`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data;
};
