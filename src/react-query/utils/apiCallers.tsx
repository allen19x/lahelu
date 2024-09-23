import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Set up constants
const API_HOST = 'https://api.9gag.com';
const HTTP_REQUEST_TIMEOUT = 10000;

// Function to check if status is OK
const IS_OK = (status: number) => status >= 200 && status < 300;

// API response formatter
const responseFormatter = (response: AxiosResponse) => {
    const statusCode = response.status;
    const responseContent = response.data.data;
    const errorMessage = !IS_OK(statusCode) ? response.data.error_message || 'Something went wrong!' : '';
    const errorCode = !IS_OK(statusCode) ? response.data.error_code : '';

    return {
        statusCode,
        responseContent,
        errorMessage,
        errorCode,
    };
};

// API caller for fetching 9gag posts
const apiCaller = () => {
    // Axios instance configuration
    const configs: AxiosRequestConfig = {
        baseURL: API_HOST,
        timeout: HTTP_REQUEST_TIMEOUT,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
    };

    // Create Axios instance
    const instance = axios.create(configs);

    // Axios interceptor for responses
    instance.interceptors.response.use(
        (response: AxiosResponse) => response, // Just return the response for now
        (error) => {
            const response = error.response || {};
            return Promise.reject(response);  // Reject with the response, to be formatted later
        }
    );
    return instance;
};