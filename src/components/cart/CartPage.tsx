import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../service/CartService";

import { placeOrder } from "../service/OrderService";

import { Alert } from "../util/Alert";

import { Loading } from "../util/Loading";

import { Cart } from "../model/types";

import { extractErrorMessage } from "../service/api";

export const CartPage = () => {
  
  // Used for page navigation after successful order placement.
  const navigate = useNavigate();
  
  // Stores cart details retrieved from the backend.
  const [cart, setCart] = useState<Cart | null>(null);
  
  // Stores delivery address entered by the customer.
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  // Controls loading spinner visibility while fetching cart data.
  const [loading, setLoading] = useState(true);
  
  // Success message displayed after cart operations.
  const [message, setMessage] = useState("");
  
  // Stores API or validation errors shown to the user.
  const [error, setError] = useState("");

  // Fetch cart details from the backend.
  const loadCart = async () => {
    setLoading(true);

    try {
      
      // Retrieve current cart data.
      setCart(await getCart());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      
      // Disable loading state after request completion.
      setLoading(false);
    }
  };

  // Load cart data when the page is first rendered.
  useEffect(() => {
    loadCart();
  }, []);

  // Update cart item quantity.
  const handleUpdate = async (
    cartItemId: number,
    quantity: number
  ) => {
    try {
      
      // Send quantity update request to the backend.
      const nextCart = await updateCartItem(cartItemId, {
        quantity,
      });

      // Update cart state with latest data.
      setCart(nextCart);

      // Display success message.
      setMessage("Cart updated");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Remove selected item from the cart.
  const handleRemove = async (cartItemId: number) => {
    try {
      
      // Send remove item request to the backend.
      const nextCart = await removeCartItem(cartItemId);

      // Update cart state after item removal.
      setCart(nextCart);

      // Display success message.
      setMessage("Item removed");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Remove all items from the cart.
  const handleClearCart = async () => {
    try {
      
      // Send clear cart request to the backend.
      const nextCart = await clearCart();

      // Update cart state after clearing items.
      setCart(nextCart);

      // Display success message.
      setMessage("Cart cleared");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Place customer order using cart items.
  const handlePlaceOrder = async () => {
    
    // Validate whether delivery address is provided.
    if (!deliveryAddress.trim()) {
      
      // Display validation error message.
      setError("Delivery address is required");

      // Stop order placement when validation fails.
      return;
    }

    try {
      
      // Send place order request to the backend.
      const order = await placeOrder({
        deliveryAddress,
      });

      // Clear delivery address field after successful order placement.
      setDeliveryAddress("");

      // Reload cart to reflect updated backend state.
      await loadCart();

      // Navigate user to the orders page.
      navigate("/orders", {
        state: {
          
          // Pass success message to the orders page.
          message: `Order ID${order.orderId} placed successfully.`,
        },
      });
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Display loading spinner while cart data is being fetched.
  if (loading) {
    return <Loading label="Loading cart..." />;
  }

  // Main cart management and checkout interface.
  return (
    <section className="space-y-6">
      
      {/* Cart page header section */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        
        {/* Cart section label */}
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          Cart
        </p>

        {/* Cart page heading */}
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          Review and place your order
        </h2>
      </div>

      {/* Success alert message */}
      {message ? (
        <Alert
          type="success"
          message={message}
          onClose={() => setMessage("")}
        />
      ) : null}

      {/* Error alert message */}
      {error ? (
        <Alert
          type="failed"
          message={error}
          onClose={() => setError("")}
        />
      ) : null}

      {/* Cart items and checkout layout */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        
        {/* Cart items section */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          
          {/* Cart header and clear cart action */}
          <div className="mb-4 flex items-center justify-between gap-3">
            
            {/* Cart items heading */}
            <h3 className="text-lg font-semibold text-slate-900">
              Cart items
            </h3>

            {/* Clear cart button */}
            <button
              type="button"
              onClick={handleClearCart}
              disabled={!cart?.items.length}
              className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
            >
              Clear cart
            </button>
          </div>

          {/* Cart items list */}
          <div className="space-y-4">

            {cart?.items.length ? (
              cart.items.map((item) => (
                
                /* Individual cart item card */
                <div
                  key={item.cartItemId}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  
                  {/* Food item details section */}
                  <div>
                    
                    {/* Food item name */}
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.foodName}
                    </h3>

                    {/* Food item unit price */}
                    <p className="text-sm text-stone-600">
                      Rs. {item.unitPrice.toFixed(2)} each
                    </p>

                    {/* Current stock availability */}
                    <p className="text-xs text-stone-500">
                      {item.stockQuantity} units currently in stock
                    </p>
                  </div>

                  {/* Cart item controls section */}
                  <div className="flex items-center gap-3">
                    
                    {/* Quantity input field */}
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, item.stockQuantity)}
                      value={item.quantity}
                      onChange={(event) =>
                        handleUpdate(
                          item.cartItemId,
                          Number(event.target.value)
                        )
                      }
                      className="w-20 rounded-2xl border border-stone-300 px-3 py-2"
                    />

                    {/* Line total amount */}
                    <div className="min-w-28 text-right text-sm font-semibold text-slate-900">
                      Rs. {item.lineTotal.toFixed(2)}
                    </div>

                    {/* Remove cart item button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.cartItemId)}
                      className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              
              // Empty cart message
              <p className="text-sm text-stone-600">
                Your cart is empty.
              </p>
            )}
          </div>
        </div>

        {/* Checkout section */}
        <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          
          {/* Checkout heading */}
          <h3 className="text-lg font-semibold text-slate-900">
            Checkout
          </h3>

          {/* Checkout instructions */}
          <p className="mt-2 text-sm text-stone-600">
            Enter your phone number and delivery address before placing the order.
          </p>

          {/* Checkout form section */}
          <div className="mt-5 space-y-4">
            
            {/* Delivery address input field */}
            <textarea
              rows={5}
              value={deliveryAddress}
              onChange={(event) =>
                setDeliveryAddress(event.target.value)
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              placeholder={"Phone number\n\nDelivery address"}
            />

            {/* Order total section */}
            <div className="flex items-center justify-between text-sm">
              
              <span className="text-stone-600">
                Total
              </span>

              <span className="text-lg font-semibold text-slate-900">
                Rs. {cart?.totalAmount.toFixed(2) ?? "0.00"}
              </span>
            </div>

            {/* Place order button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!cart?.items.length}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Place order
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};