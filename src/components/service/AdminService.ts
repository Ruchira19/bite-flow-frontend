import api from "./api";

import {
  Order,
  OrderStatus,
  Payment,
  Role,
  UserProfile,
} from "../model/types";

// Retrieve all customer orders for admin management.
export const getAllOrders = async (): Promise<Order[]> => {
  
  // Send request to fetch all orders.
  const response = await api.get<Order[]>("/orders");

  // Return retrieved order data.
  return response.data;
};

// Update the status of a selected order.
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus
): Promise<Order> => {
  
  // Send request to update order status.
  const response = await api.patch<Order>(
    `/orders/${orderId}/status`,
    {
      status,
    }
  );

  // Return updated order details.
  return response.data;
};

// Retrieve all payment records for admin monitoring.
export const getAllPayments = async (): Promise<Payment[]> => {
  
  // Send request to fetch all payments.
  const response = await api.get<Payment[]>("/payments");

  // Return retrieved payment data.
  return response.data;
};

// Retrieve all registered users from the backend.
export const getAllUsers = async (): Promise<UserProfile[]> => {
  
  // Send request to fetch all users.
  const response = await api.get<UserProfile[]>("/users");

  // Return retrieved user data.
  return response.data;
};

// Create a new user account.
export const createUser = async (
  payload: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
  }
): Promise<UserProfile> => {
  
  // Send request to create a new user.
  const response = await api.post<UserProfile>(
    "/users",
    payload
  );

  // Return created user details.
  return response.data;
};

// User deletion functionality is temporarily disabled.
// export const deleteUser = async (userId: number): Promise<void> => {
//   await api.delete(`/users/${userId}`);
// };

// Retrieve currently authenticated user profile details.
export const getProfile = async (): Promise<UserProfile> => {
  
  // Send request to fetch authenticated user profile.
  const response = await api.get<UserProfile>("/users/me");

  // Return retrieved user profile data.
  return response.data;
};