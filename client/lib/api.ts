const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import axios from "axios";
import { 
  ApiResponse, 
  LoginData, 
  RegisterData, 
  TemplateDetail, 
  TemplateDetailResponse, 
  TemplateResponse,
  CartItem,
  CartResponse,
  AddToCartData,
  OrderResponse,
  CreateOrderData,
  UserProfile,
  UpdateProfileData
} from ".";


export const authAPI = {
  async signup(data: RegisterData): Promise<ApiResponse> {
    const response = await axios.post(`${API_BASE_URL}/api/user/signup`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = response.data;
    if (response.status !== 201) {
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
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<UserProfile>> {
    const response = await axios.put(
      `${API_BASE_URL}/api/user/update-profile`,
      data,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async sendVerificationEmail(): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/send-verification-email`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async verifyEmail(otp: string): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/verify-email`,
      { otp },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/change-password`,
      { currentPassword, newPassword },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async sendPasswordChangeOtp(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/send-password-change-otp`,
      { currentPassword, newPassword },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async verifyPasswordChangeOtp(otp: string): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/verify-password-change-otp`,
      { otp },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/forgot-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/reset-password`,
      { token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
  
};


export const templateAPI = {
  async getAllTemplates(): Promise<TemplateResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/templates/get-all-templates`);
    return response.data;
  },

  async getTemplateById(id: string): Promise<TemplateResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/templates/get-template/${id}`);
    return response.data;
  },
};


export const templateDetailAPI = {
  async getTemplateDetailByTemplateId(templateId: string): Promise<TemplateDetailResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/template-details/get-by-template/${templateId}`);
    return response.data;
  },
};

export const cartAPI = {
  async getCart(): Promise<CartResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/cart`, {
      withCredentials: true,
    });
    return response.data;
  },

  async addToCart(data: AddToCartData): Promise<CartResponse> {
    const response = await axios.post(`${API_BASE_URL}/api/cart/add`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async updateCartItem(cartItemId: string, quantity: number): Promise<CartResponse> {
    const response = await axios.put(
      `${API_BASE_URL}/api/cart/update/${cartItemId}`,
      { quantity },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async removeFromCart(cartItemId: string): Promise<CartResponse> {
    const response = await axios.delete(
      `${API_BASE_URL}/api/cart/remove/${cartItemId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async clearCart(): Promise<CartResponse> {
    const response = await axios.delete(`${API_BASE_URL}/api/cart/clear`, {
      withCredentials: true,
    });
    return response.data;
  },
};

export const orderAPI = {
  async createOrder(data: CreateOrderData): Promise<OrderResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/orders/checkout`,
      data,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  async getUserOrders(): Promise<OrderResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/orders/get-all-orders`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async cancelOrder(orderId: string): Promise<OrderResponse> {
    const response = await axios.put(
      `${API_BASE_URL}/api/orders/${orderId}/cancel`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async getOrderByPaymentId(paymentId: string): Promise<OrderResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/api/orders/payment/${paymentId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async createPaymentIntent(amount: number): Promise<ApiResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/payment/create-payment-intent`,
      { amount },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }
}