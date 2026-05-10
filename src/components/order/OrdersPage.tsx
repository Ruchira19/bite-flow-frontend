import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelOrder, getMyOrders, payForOrder } from "../service/OrderService";
import { Alert } from "../util/Alert";
import { Loading } from "../util/Loading";
import { Order } from "../model/types";
import { extractErrorMessage } from "../service/api";
import { useAuth } from "../auth/AuthProvider";


export const OrdersPage = () => {
  
  const { user } = useAuth();
  
  const location = useLocation();
  
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [paymentRefs, setPaymentRefs] = useState<Record<number, string>>({});
  
  const [loading, setLoading] = useState(true);
  
  const [message, setMessage] = useState(
    (location.state as { message?: string } | null)?.message ?? ""
  );
  
  const [error, setError] = useState("");

  
  const isPaymentLocked = (order: Order) =>
    order.paymentStatus === "COMPLETED" || order.status === "CANCELLED";

  // Reload the customer's order list whenever a payment or cancellation changes it.
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      setOrders(await getMyOrders());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter state stays local so customers can browse their history without extra requests.
  
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "COMPLETED" | "NOT_COMPLETED">("ALL");
  
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PLACED" | "PREPARING" | "DELIVERED" | "CANCELLED">("ALL");

  // Apply payment and order status filters together in one pass.
  
  const filteredOrders = useMemo(() => {
    // returning the output from this part
    return orders.filter((o) => {
      if (paymentFilter === "COMPLETED" && o.paymentStatus !== "COMPLETED") return false;
      if (paymentFilter === "NOT_COMPLETED" && o.paymentStatus === "COMPLETED") return false;
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      // returning the output from this part
      return true;
    });
  }, [orders, paymentFilter, statusFilter]);

  useEffect(() => {
    if ((location.state as { message?: string } | null)?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // Cancellation is only attempted when the backend still allows the order to change.
  
  const handleCancel = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      setMessage("Order cancelled");
      await loadOrders();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // The transaction reference becomes the payment audit trail, so require it before saving.
  
  const handlePay = async (orderId: number) => {
    
    const transactionReference = paymentRefs[orderId];
    if (!transactionReference?.trim()) {
      setError("Transaction reference is required");
      // returning the output from this part
      return;
    }
    try {
      await payForOrder({
        orderId,
        status: "COMPLETED",
        transactionReference,
      });
      setMessage("Payment updated");
      await loadOrders();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  if (loading) {
    // returning the output from this part
    return <Loading label="Loading your orders..." />;
  }

  if (user?.role !== "CUSTOMER") {
    // returning the output from this part
    return (
      <section className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">Orders</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Customer orders</h2>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
          Only customers can view their orders.
        </div>
      </section>
    );
  }

  // returning the output from this part
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          Orders
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          Track your orders and payments
        </h2>
      </div>

      {message ? (
        <Alert type="success" message={message} onClose={() => setMessage("")} />
      ) : null}
      {error ? (
        <Alert type="failed" message={error} onClose={() => setError("")} />
      ) : null}

      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <label className="text-sm text-stone-600">Payment</label>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
            <option value="ALL">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="NOT_COMPLETED">Not completed</option>
          </select>

          <label className="text-sm text-stone-600">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
            <option value="ALL">All</option>
            <option value="PLACED">Placed</option>
            <option value="PREPARING">Preparing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {filteredOrders.map((order) => (
          <article
            key={order.orderId}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Order ID: {order.orderId}
                  </h3>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                    {order.paymentStatus ?? "NO_PAYMENT"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  {/* Keep the date inline with the order summary for a compact card layout. */}
                     <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Order Created At{new Date(order.createdAt).toLocaleString()}
                  
                  </span>   
                </p>
                <p className="mt-2 text-sm text-stone-600">
                   {/* Delivery address is separated so it is easy to spot during handoff. */}
                   <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Delivery Address: {order.deliveryAddress}
                  </span>   
                </p>
              </div>
              <div className="text-lg font-semibold text-slate-900">
                Rs. {order.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 text-sm"
                >
                  <span>
                    {item.foodName} x {item.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">
                    Rs. {item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <input
                type="text"
                value={paymentRefs[order.orderId] || ""}
                onChange={(event) =>
                  setPaymentRefs((prev) => ({
                    ...prev,
                    [order.orderId]: event.target.value,
                  }))
                }
                disabled={isPaymentLocked(order)}
                className="rounded-2xl border border-stone-300 px-4 py-3"
                placeholder="Transaction reference"
              />
              <button
                type="button"
                onClick={() => handlePay(order.orderId)}
                disabled={isPaymentLocked(order)}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Mark payment complete
              </button>
              <button
                type="button"
                onClick={() => handleCancel(order.orderId)}
                disabled={order.status === "CANCELLED" || order.status === "DELIVERED"}
                className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
              >
                Cancel order
              </button>
            </div>
          </article>
        ))}
        {!orders.length ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
            No orders yet.
          </div>
        ) : null}
      </div>
    </section>
  );
};
