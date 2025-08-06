/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

interface LoginResponse {
  accessToken: string;
  username: string;
  userId: number;
}

export const register = (username: string, password: string) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const login = (username: string, password: string) => {
  return axios
    .post<LoginResponse>(`${API_URL}/login`, { username, password })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};
