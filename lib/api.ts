// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxied via next.config.mjs
  headers: {
    "Content-Type": "application/json",
  },
});

export interface FeedbackData {
  rating: number;
  message: string;
  email: string;
  name: string;
}

// ✅ Submit Feedback
export const submitFeedback = async (
  feedback: FeedbackData
): Promise<FeedbackData> => {
  const response = await api.post<FeedbackData>("/feedback/", feedback);
  return response.data;
};

export default api;
