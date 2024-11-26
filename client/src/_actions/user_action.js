import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
} from './types';
import { USER_SERVER } from '../components/Config.js';

export async function registerUser(dataTosubmit) {
    try {
        const request = await axios.post(`${USER_SERVER}/register`, dataTosubmit);        
        
        return {
            type: REGISTER_USER,
            payload: request.data
        }
    } catch (error) {
        console.error("Register failed:", error);
    }
}

export async function loginUser(dataTosubmit) {
    try {
        const request = await axios.post(`${USER_SERVER}/login`, dataTosubmit);        
        
        return {
            type: LOGIN_USER,
            payload: request.data
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
}

export async function auth() {
    try {
        const request = await axios.get(`${USER_SERVER}/auth`);                        
                
        return {
            type: AUTH_USER,
            payload: request.data
        }
    } catch (error) {
        return {
            type: AUTH_USER,
            payload: { error: true, message: error.message },
        }
    }
}

export async function logoutUser() {    
    try {
        const request = await axios.get(`${USER_SERVER}/logout`);
        return {
            type: LOGOUT_USER,
            payload: request.data
        }
    } catch (error) {
        console.error("logout failed:", error);
    }
}
