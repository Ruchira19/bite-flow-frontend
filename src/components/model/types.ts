// User roles supported by the application.
export type Role =
  | "ADMIN"
  | "CUSTOMER";

// Food item availability states.
export type FoodStatus =
  | "AVAILABLE"
  | "OUT_OF_STOCK";

// Order processing statuses used in the order workflow.
export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED";

// Payment processing statuses.
export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED";

// Authentication response returned after successful login or signup.
export interface AuthResponse {
  
  // Authentication token used for authorized requests.
  token: string;

  // Unique identifier of the authenticated user.
  userId: number;

  // Full name of the authenticated user.
  fullName: string;

  // Email address of the authenticated user.
  email: string;

  // Role assigned to the authenticated user.
  role: Role;
}

// User profile details.
export interface UserProfile {
  
  // Unique user identifier.
  id: number;

  // User full name.
  fullName: string;

  // User email address.
  email: string;

  // User role within the system.
  role: Role;
}

// Food category details.
export interface Category {
  
  // Unique category identifier.
  id: number;

  // Category name.
  name: string;

  // Category description.
  description: string;
}

// Food item details displayed in the catalog.
export interface FoodItem {
  
  // Unique food item identifier.
  id: number;

  // Food item name.
  name: string;

  // Food item description.
  description: string;

  // Price per food item.
  price: number;

  // Current stock quantity available.
  stockQuantity: number;

  // Current availability status.
  status: FoodStatus;

  // Related category identifier.
  categoryId: number;

  // Related category name.
  categoryName: string;
}

// Individual cart item details.
export interface CartItem {
  
  // Unique cart item identifier.
  cartItemId: number;

  // Related food item identifier.
  foodItemId: number;

  // Food item name.
  foodName: string;

  // Unit price of the food item.
  unitPrice: number;

  // Quantity added to the cart.
  quantity: number;

  // Total price for the cart item.
  lineTotal: number;

  // Current available stock quantity.
  stockQuantity: number;
}

// Shopping cart details.
export interface Cart {
  
  // Unique cart identifier.
  cartId: number;

  // Owner user identifier.
  userId: number;

  // List of cart items.
  items: CartItem[];

  // Total cart amount.
  totalAmount: number;
}

// Individual order item details.
export interface OrderItem {
  
  // Unique order item identifier.
  orderItemId: number;

  // Related food item identifier.
  foodItemId: number;

  // Food item name.
  foodName: string;

  // Ordered quantity.
  quantity: number;

  // Unit price of the ordered item.
  unitPrice: number;

  // Total price for the ordered quantity.
  lineTotal: number;
}

// Customer order details.
export interface Order {
  
  // Unique order identifier.
  orderId: number;

  // Customer user identifier.
  userId: number;

  // Customer full name.
  customerName: string;

  // Current order processing status.
  status: OrderStatus;

  // Delivery address for the order.
  deliveryAddress: string;

  // Total order amount.
  totalAmount: number;

  // Order creation timestamp.
  createdAt: string;

  // List of ordered items.
  items: OrderItem[];

  // Payment status related to the order.
  paymentStatus: PaymentStatus | null;
}

// Payment transaction details.
export interface Payment {
  
  // Unique payment identifier.
  paymentId: number;

  // Related order identifier.
  orderId: number;

  // Payment amount.
  amount: number;

  // Current payment status.
  status: PaymentStatus;

  // Payment completion timestamp.
  paidAt: string;

  // External payment transaction reference.
  transactionReference: string;
}