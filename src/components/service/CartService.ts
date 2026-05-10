import api from "./api";

import { Cart } from "../model/types";

// Retrieve current customer cart details.
export const getCart = async (): Promise<Cart> => {
  
  // Send request to fetch cart data.
  const response = await api.get<Cart>("/cart");

  // Return retrieved cart details.
  return response.data;
};

// Add selected food item to the cart.
export const addCartItem = async (
  payload: {
    foodItemId: number;
    quantity: number;
  }
): Promise<Cart> => {
  
  // Send request to add item into the cart.
  const response = await api.post<Cart>(
    "/cart/items",
    payload
  );

  // Return updated cart details.
  return response.data;
};

// Update quantity of an existing cart item.
export const updateCartItem = async (
  cartItemId: number,
  payload: {
    quantity: number;
  }
): Promise<Cart> => {
  
  // Send request to update cart item quantity.
  const response = await api.put<Cart>(
    `/cart/items/${cartItemId}`,
    payload
  );

  // Return updated cart details.
  return response.data;
};

// Remove selected item from the cart.
export const removeCartItem = async (
  cartItemId: number
): Promise<Cart> => {
  
  // Send request to remove cart item.
  const response = await api.delete<Cart>(
    `/cart/items/${cartItemId}`
  );

  // Return updated cart details.
  return response.data;
};

// Remove all items from the customer cart.
export const clearCart = async (): Promise<Cart> => {
  
  // Send request to clear the cart.
  const response = await api.delete<Cart>(
    "/cart"
  );

  // Return updated empty cart details.
  return response.data;
};