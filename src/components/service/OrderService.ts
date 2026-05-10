import api from "./api";

import {
  Order,
  Payment,
  PaymentStatus,
} from "../model/types";

// Create a new customer order from cart items.
export const placeOrder = async (
  payload: {
    deliveryAddress: string;
  }
): Promise<Order> => {
  
  // Send request to place a new order.
  const response = await api.post<Order>(
    "/orders",
    payload
  );

  // Return created order details.
  return response.data;
};

// Retrieve orders belonging to the currently logged-in customer.
export const getMyOrders = async (): Promise<Order[]> => {
  
  // Send request to fetch customer order history.
  const response = await api.get<Order[]>(
    "/orders/me"
  );

  // Return retrieved order list.
  return response.data;
};

// Cancel selected customer order.
export const cancelOrder = async (
  orderId: number
): Promise<Order> => {
  
  // Send request to cancel the order.
  const response = await api.patch<Order>(
    `/orders/${orderId}/cancel`
  );

  // Return updated order details.
  return response.data;
};

// Update payment status for a selected order.
export const payForOrder = async (
  payload: {
    orderId: number;
    status: PaymentStatus;
    transactionReference: string;
  }
): Promise<Payment> => {
  
  // Send request to update payment information.
  const response = await api.patch<Payment>(
    "/payments",
    payload
  );

  // Return updated payment details.
  return response.data;
};

// Retrieve payment details related to a specific order.
export const getPaymentByOrder = async (
  orderId: number
): Promise<Payment> => {
  
  // Send request to fetch payment details by order ID.
  const response = await api.get<Payment>(
    `/payments/order/${orderId}`
  );

  // Return retrieved payment information.
  return response.data;
};