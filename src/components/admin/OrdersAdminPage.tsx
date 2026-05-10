import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../service/AdminService";
import { Order, OrderStatus } from "../model/types";
import { Alert } from "../util/Alert";
import { Loading } from "../util/Loading";
import { extractErrorMessage } from "../service/api";

// Available order statuses supported by the backend.
const statuses: OrderStatus[] = [
  "PLACED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

export const OrdersAdminPage = () => {
  // Stores all orders retrieved from the backend.
  const [orders, setOrders] = useState<Order[]>([]);

  // Currently selected status filter for narrowing displayed orders.
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Start date filter used for filtering orders.
  const [dateFrom, setDateFrom] = useState("");

  // End date filter used for filtering orders.
  const [dateTo, setDateTo] = useState("");

  // Controls loading spinner visibility while fetching order data.
  const [loading, setLoading] = useState(true);

  // Success message displayed after admin actions.
  const [message, setMessage] = useState("");

  // Stores API or validation errors shown to the admin user.
  const [error, setError] = useState("");

  // Fetch all orders from the backend and synchronize the admin view.
  const loadOrders = async () => {
    setLoading(true);

    try {
      setOrders(await getAllOrders());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Load order data when the page is first rendered.
  useEffect(() => {
    loadOrders();
  }, []);

  // Update order status and refresh the orders list afterward.
  const handleStatusChange = async (
    orderId: number,
    status: OrderStatus
  ) => {
    try {
      await updateOrderStatus(orderId, status);

      setMessage("Order status updated");

      // Reload orders to keep frontend data synchronized with the backend.
      await loadOrders();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Filter orders locally using selected status and date range.
  const filteredOrders = orders.filter((order) => {
    // Exclude orders that do not match the selected status filter.
    if (statusFilter !== "ALL" && order.status !== statusFilter) {
      return false;
    }

    // Convert order creation date into a comparable timestamp.
    const createdAt = new Date(order.createdAt).getTime();

    if (dateFrom) {
      // Generate timestamp for the selected starting date.
      const fromTime = new Date(`${dateFrom}T00:00:00`).getTime();

      // Exclude orders created before the selected start date.
      if (createdAt < fromTime) {
        return false;
      }
    }

    if (dateTo) {
      // Generate timestamp for the selected ending date.
      const toTime = new Date(`${dateTo}T23:59:59.999`).getTime();

      // Exclude orders created after the selected end date.
      if (createdAt > toTime) {
        return false;
      }
    }

    // Keep orders that satisfy all filter conditions.
    return true;
  });

  // Reset all filter values back to their default state.
  const clearFilters = () => {
    setStatusFilter("ALL");
    setDateFrom("");
    setDateTo("");
  };

  // Display loading indicator while order data is being fetched.
  if (loading) {
    return <Loading label="Loading orders..." />;
  }

  // Main admin orders management interface.
  return (
    <section className="space-y-6">
      {/* Orders page header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          Admin Orders
        </p>

        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          Monitor and update all orders
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

      {/* Order filtering section */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        {/* Filter controls container */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Filter inputs grid */}
          <div className="grid gap-4 sm:grid-cols-3 lg:flex-1">
            {/* Status filter dropdown */}
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as OrderStatus | "ALL")
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              >
                <option value="ALL">All statuses</option>
                <option value="PLACED">Placed</option>
                <option value="PREPARING">Preparing</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>

            {/* Start date filter */}
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Date from</span>

              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              />
            </label>

            {/* End date filter */}
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Date to</span>

              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              />
            </label>
          </div>

          {/* Filter summary and reset controls */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-stone-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-stone-50"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders results list */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          /* Individual order card */
          <article
            key={order.orderId}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              {/* Order information section */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Order ID: {order.orderId}
                  </h3>

                  {/* Current order status badge */}
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    {order.status}
                  </span>
                </div>

                {/* Customer and delivery details */}
                <p className="mt-2 text-sm text-stone-600">
                  {order.customerName} • {order.deliveryAddress}
                </p>

                {/* Order creation timestamp */}
                <p className="mt-2 text-sm text-stone-500">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Order Created At:{" "}
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                  </span>
                </p>
              </div>

              {/* Order status update controls */}
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(event) =>
                    handleStatusChange(
                      order.orderId,
                      event.target.value as OrderStatus
                    )
                  }
                  className="rounded-2xl border border-stone-300 px-4 py-3"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {/* Total order amount */}
                <div className="text-lg font-semibold text-slate-900">
                  Rs. {order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty state displayed when no orders match filters */}
      {!filteredOrders.length ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
          {orders.length
            ? "No orders match the selected filters."
            : "No orders yet."}
        </div>
      ) : null}
    </section>
  );
};