import api from "./api";

import {
  Category,
  FoodItem,
} from "../model/types";

// Retrieve all food categories from the backend.
export const getCategories = async (): Promise<Category[]> => {
  
  // Send request to fetch category data.
  const response = await api.get<Category[]>(
    "/categories"
  );

  // Return retrieved category list.
  return response.data;
};

// Create a new food category.
export const createCategory = async (
  payload: {
    name: string;
    description: string;
  }
): Promise<Category> => {
  
  // Send request to create a new category.
  const response = await api.post<Category>(
    "/categories",
    payload
  );

  // Return created category details.
  return response.data;
};

// Update details of an existing category.
export const updateCategory = async (
  categoryId: number,
  payload: {
    name: string;
    description: string;
  }
): Promise<Category> => {
  
  // Send request to update category details.
  const response = await api.put<Category>(
    `/categories/${categoryId}`,
    payload
  );

  // Return updated category details.
  return response.data;
};

// Delete selected category from the system.
export const deleteCategory = async (
  categoryId: number
) => {
  
  // Send request to delete category.
  await api.delete(
    `/categories/${categoryId}`
  );
};

// Retrieve food items from the backend.
export const getFoods = async (
  availableOnly = false
): Promise<FoodItem[]> => {
  
  // Send request to fetch food item data.
  const response = await api.get<FoodItem[]>(
    "/foods",
    {
      params: {
        availableOnly,
      },
    }
  );

  // Return retrieved food items.
  return response.data;
};

// Create a new food item.
export const createFood = async (
  payload: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    status:
      | "AVAILABLE"
      | "OUT_OF_STOCK";
    categoryId: number;
  }
): Promise<FoodItem> => {
  
  // Send request to create a new food item.
  const response = await api.post<FoodItem>(
    "/foods",
    payload
  );

  // Return created food item details.
  return response.data;
};

// Update details of an existing food item.
export const updateFood = async (
  foodId: number,
  payload: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    status:
      | "AVAILABLE"
      | "OUT_OF_STOCK";
    categoryId: number;
  }
): Promise<FoodItem> => {
  
  // Send request to update food item details.
  const response = await api.put<FoodItem>(
    `/foods/${foodId}`,
    payload
  );

  // Return updated food item details.
  return response.data;
};

// Delete selected food item from the system.
export const deleteFood = async (
  foodId: number
) => {
  
  // Send request to delete food item.
  await api.delete(
    `/foods/${foodId}`
  );
};