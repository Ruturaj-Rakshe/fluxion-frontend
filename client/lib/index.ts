export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization?: string;
  contactNumber?: string;
  address?: string;
  avatarUrl?: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  organization?: string;
  contactNumber?: string;
  address?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  user?: T;
  token?: string;
  errors?: string[];
}

export interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface TemplateResponse {
  message: string;
  template?: Template;
  templates?: Template[];
}

export interface TemplateDetail {
  id: string;
  tempelateId: string;
  header: string;
  headerSubtitle: string;
  features: string[];
  benefits: string[];
  createdAt: string;
  updatedAt: string;
  tempelate?: {
    id: string;
    title: string;
    price: number;
  };
}

export interface TemplateDetailResponse {
  message: string;
  templateDetails?: TemplateDetail;
  templateDetail?: TemplateDetail;
}

export interface CartItem {
  id: string;
  userId: string;
  tempelateId: string;
  tempelateDetailId: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  tempelate: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    thumbnailUrl: string;
    isActive: "ACTIVE" | "INACTIVE";
  };
  tempelateDetail?: {
    id: string;
    header: string;
    headerSubtitle: string;
  } | null;
}

export interface CartResponse {
  message: string;
  cart?: CartItem[];
  cartItem?: CartItem;
  summary?: {
    totalItems: number;
    totalPrice: number;
    itemCount: number;
  };
  deletedItems?: number;
}

export interface AddToCartData {
  tempelateId: string;
  tempelateDetailId?: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  paymentId: string | null;
  paymentRef: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  tempelateId: string;
  tempelateDetailId: string | null;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  tempelate: {
    id: string;
    title: string;
    thumbnailUrl: string
  };
  tempelateDetail?: {
    id: string;
    header: string;
  } | null;
}

export interface OrderResponse {
  message: string;
  order?: Order;
  orders?: Array<{
    id: string;
    total: number;
    status: string;
    itemCount: number;
    items: Array<{
      template: string;
      model: string | null;
      quantity: number;
      price: number;
    }>;
    createdAt: string;
  }>;
}

export interface CreateOrderData {
  paymentId: string;
  paymentRef: string;
}
