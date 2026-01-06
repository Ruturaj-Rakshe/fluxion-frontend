import axios from 'axios';
import { AdminLoginData, AdminStatsResponse, RecentOrder, RecentUser } from './index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminAuthAPI = {
  login: (data: AdminLoginData) => 
        apiClient.post('/api/user/signin', data),
  
  logout: () => 
    apiClient.post('/api/user/logout'),
  
  getProfile: () => 
    apiClient.get('/api/user/get-profile'),
};

export const adminAPI = {
  getDashboardStats: () => 
    apiClient.get<AdminStatsResponse>('/api/admin/dashboard-stats'),
  
  getRecentOrders: (limit: number = 10) => 
    apiClient.get<{ message: string; orders: RecentOrder[] }>(`/api/admin/recent-orders?limit=${limit}`),
  
  getRecentUsers: (limit: number = 10) => 
    apiClient.get<{ message: string; users: RecentUser[] }>(`/api/admin/recent-users?limit=${limit}`),
  
  getAllUsers: (page: number = 1, limit: number = 20, search?: string) => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    if (search) params.append('search', search);
    return apiClient.get(`/api/admin/users?${params.toString()}`);
  },
  
  updateUserRole: (userId: string, role: 'USER' | 'ADMIN') => 
    apiClient.patch(`/api/admin/users/${userId}/role`, { role }),
};

export { apiClient };
