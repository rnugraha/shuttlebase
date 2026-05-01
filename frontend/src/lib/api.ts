import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000",
});

// Get token from localStorage on each request when available
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// When getting 401-Unauthorised error, remove token and redirect to login page
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default api;
