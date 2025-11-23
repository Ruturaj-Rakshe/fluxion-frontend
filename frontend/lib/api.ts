const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import axios from "axios";
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse<T = any> {
  message: string;
  user?: T;
  token?: string;
  errors?: any;
}

export const authAPI = {
  async signup(data: RegisterData): Promise<ApiResponse> {
    const response = await axios.post(`${API_BASE_URL}/api/user/signup`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = response.data;
    if (response.status !== 200) {
      throw new Error(result.message || "Signup failed");
    }
    return result;
  },

  async signin(data: LoginData): Promise<ApiResponse> {
    const response = await axios.post(`${API_BASE_URL}/api/user/signin`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = response.data;
    if (response.status !== 200) {
      throw new Error(result.message || "Signin failed");
    }
    return result;
  },

  async getProfile(): Promise<ApiResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/user/get-profile`, {
      withCredentials: true,
    });
    const result = response.data;
    if (response.status !== 200) {
      throw new Error(result.message || "Failed to fetch profile");
    }
    return result;
  }
};

