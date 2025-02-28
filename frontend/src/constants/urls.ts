import axios from "axios";

export const API_BASE_URL = 'http://localhost:4000';
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
  });
  