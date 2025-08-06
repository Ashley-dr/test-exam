import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.accessToken) {
      return { Authorization: `Bearer ${user.accessToken}` };
    }
  }
  return {};
};

export const getMovies = (page = 1, limit = 10) => {
  return axios.get(`${API_URL}/movies`, {
    params: { page, limit },
  });
};

export const getMovieById = (id: number) => {
  return axios.get(`${API_URL}/movies/${id}`);
};

export const addMovie = (movie: {
  title: string;
  genre?: string;
  year: number;
}) => {
  return axios.post(`${API_URL}/movies`, movie, { headers: getAuthHeaders() });
};

export const updateMovie = (
  id: number,
  movie: { title: string; genre?: string; year: number }
) => {
  return axios.put(`${API_URL}/movies/${id}`, movie, {
    headers: getAuthHeaders(),
  });
};

export const deleteMovie = (id: number) => {
  return axios.delete(`${API_URL}/movies/${id}`, { headers: getAuthHeaders() });
};
