import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "access_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateProfileBio = async () => {
  const response = await api.post("/ai/profile/bio", {});
  return response.data.data.bio;
};

export const generateNoteTitles = async (content) => {
  const response = await api.post("/ai/notes/title", { content });
  return response.data.data.titles;
};

export const generateNoteSummary = async ({ title, content }) => {
  const response = await api.post("/ai/notes/summary", { title, content });
  return response.data.data.summary;
};

export const rewriteNoteDraft = async ({ title, content, mode }) => {
  const response = await api.post("/ai/notes/rewrite", { title, content, mode });
  return response.data.data;
};

export default api;
