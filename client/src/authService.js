import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; // Double check your port!

export const register = (email, password) => {
    return axios.post(API_URL + 'register', { email, password });
};

export const login = async (email, password) => {
    // This matches the LoginDto in AuthController.cs
    const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email: email, 
        password: password 
    });
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    // Make sure to remove 'token' here too
    localStorage.removeItem('token');
};

