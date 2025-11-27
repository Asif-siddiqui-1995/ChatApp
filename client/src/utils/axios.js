import axios from "axios";

// configure Base Url
const BASE_URL = "http://localhost:8000";
const axiosInstance = axios.create({baseURL: BASE_URL});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || "Something went Wrong"
        )
);

export default axiosInstance;
