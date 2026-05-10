import React, { useEffect, useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";

import { getAllPayments } from "../service/AdminService";

import { getFoods } from "../service/CatalogService";

import { getMyOrders } from "../service/OrderService";

import { Payment, FoodItem, Order } from "../model/types";

// Format month and year for dashboard income summary.
const monthName = (d: Date) =>
  d.toLocaleString(undefined, {
    month: "short",
    year: "numeric",
  });

export const Home = () => {
  
  // Retrieve currently logged-in user details.
  const { user } = useAuth();

  // Stores payment records retrieved from the backend.
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // Stores food item records retrieved from the backend.
  const [foods, setFoods] = useState<FoodItem[]>([]);
  
  // Stores selected inventory filter option.
  const [filter, setFilter] = useState<
    "ALL" | "AVAILABLE" | "OUT"
  >("ALL");
  
  // Controls loading state while fetching payment data.
  const [loadingPayments, setLoadingPayments] = useState(false);
  
  // Controls loading state while fetching food item data.
  const [loadingFoods, setLoadingFoods] = useState(false);
  
  // Stores customer order history.
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Controls loading state while fetching customer orders.
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Stores selected start date for order filtering.
  const [startDate, setStartDate] = useState<string>("");
  
  // Stores selected end date for order filtering.
  const [endDate, setEndDate] = useState<string>("");

  // Fetch payment data for the admin dashboard.
  useEffect(() => {
    
    const load = async () => {
      setLoadingPayments(true);

      try {
        
        // Retrieve all payment records.
        const data = await getAllPayments();

        // Store payment data in state.
        setPayments(data || []);
      } catch (e) {
        
        // Reset payments when request fails.
        setPayments([]);
      } finally {
        
        // Disable loading state after request completion.
        setLoadingPayments(false);
      }
    };

    load();
  }, []);

  // Fetch food inventory data for the dashboard.
  useEffect(() => {
    
    const loadFoods = async () => {
      setLoadingFoods(true);

      try {
        
        // Retrieve all food items including unavailable items.
        const data = await getFoods(false);

        // Store food item data in state.
        setFoods(data || []);
      } catch (e) {
        
        // Reset foods when request fails.
        setFoods([]);
      } finally {
        
        // Disable loading state after request completion.
        setLoadingFoods(false);
      }
    };

    loadFoods();
  }, []);

  // Fetch customer order history only for customer accounts.
  useEffect(() => {
    
    // Stop execution for non-customer accounts.
    if (user?.role !== "CUSTOMER") return;
    
    const load = async () => {
      setLoadingOrders(true);

      try {
        
        // Retrieve logged-in customer orders.
        const data = await getMyOrders();

        // Store order history in state.
        setOrders(data || []);
      } catch (e) {
        
        // Reset orders when request fails.
        setOrders([]);
      } finally {
        
        // Disable loading state after request completion.
        setLoadingOrders(false);
      }
    };

    load();
  }, [user?.role]);

  // Calculate income summary for the last three months.
  const incomeByMonth = useMemo(() => {
    
    // Retrieve current date.
    const now = new Date();
    
    // Stores monthly income summary data.
    const months: {
      label: string;
      start: Date;
      end: Date;
      amount: number;
    }[] = [];

    // Generate last three month ranges.
    for (let i = 2; i >= 0; i--) {
      
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );
      
      const start = new Date(
        d.getFullYear(),
        d.getMonth(),
        1,
        0,
        0,
        0
      );
      
      const end = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        1,
        0,
        0,
        0
      );

      months.push({
        label: monthName(d),
        start,
        end,
        amount: 0,
      });
    }

    // Calculate completed payment totals for each month.
    payments.forEach((p) => {
      
      // Skip records without payment date.
      if (!p.paidAt) return;
      
      const paid = new Date(p.paidAt);

      months.forEach((m) => {
        
        // Add completed payment amounts to matching month.
        if (
          paid >= m.start &&
          paid < m.end &&
          p.status === "COMPLETED"
        ) {
          m.amount += p.amount;
        }
      });
    });

    // Return calculated monthly income summary.
    return months;
  }, [payments]);

  // Filter food inventory based on selected status.
  const filteredFoods = useMemo(() => {
    
    // Return all food items when no filter is selected.
    if (filter === "ALL") return foods;

    // Return only available food items.
    if (filter === "AVAILABLE") {
      return foods.filter(
        (f) => f.status === "AVAILABLE"
      );
    }

    // Return only out-of-stock food items.
    return foods.filter(
      (f) => f.status === "OUT_OF_STOCK"
    );
  }, [foods, filter]);

  // Filter customer orders using selected date range.
  const filteredOrders = useMemo(() => {
    
    // Return all orders when no date filters are applied.
    if (!startDate && !endDate) return orders;
    
    const start = startDate
      ? new Date(startDate)
      : new Date("1970-01-01");
    
    const end = endDate
      ? new Date(endDate + "T23:59:59")
      : new Date();

    // Return only orders within selected date range.
    return orders.filter((o) => {
      
      const created = new Date(o.createdAt);

      return created >= start && created <= end;
    });
  }, [orders, startDate, endDate]);

  // Main dashboard interface.
  return (
    <section className="page-shell space-y-6">
      
      {/* Dashboard welcome section */}
      <div className="rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-sm">
        
        {/* Dashboard section label */}
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
          Dashboard
        </p>

        {/* Welcome message */}
        <h2 className="mt-2 text-3xl font-semibold">
          Welcome back, {user?.fullName}.
        </h2>

        {/* Dashboard description based on user role */}
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          {user?.role === "ADMIN"
            ? "Use the management screens to maintain categories, menu items, orders, payments, and user records."
            : "Browse the menu, manage your cart, place orders, and track payments from one place."}
        </p>
      </div>

      {/* Dashboard statistics layout */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Admin dashboard widgets */}
        {user?.role === "ADMIN" && (
          <>
            
            {/* Signed-in user summary card */}
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Signed In As
              </p>

              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {user?.role}
              </h3>

              <p className="mt-2 text-sm text-stone-600">
                {user?.email}
              </p>
            </article>

            {/* Income summary widget */}
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Income (last 3 months)
              </p>

              <h3 className="mt-3 text-lg font-semibold text-emerald-700">
                {loadingPayments
                  ? "Loading..."
                  : "Income summary"}
              </h3>

              {/* Monthly income breakdown */}
              <div className="mt-3 text-sm text-stone-600 space-y-2">

                {incomeByMonth.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-stone-700">
                      {m.label}
                    </span>

                    <span className="font-medium text-slate-900">
                      LKR {m.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            {/* Inventory summary widget */}
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              
              <div className="flex items-center justify-between">
                
                {/* Inventory section heading */}
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    Inventory
                  </p>

                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    Food items & counts
                  </h3>
                </div>

                {/* Inventory filter dropdown */}
                <div>
                  <label className="text-xs text-stone-500 mr-2">
                    Filter
                  </label>

                  <select
                    value={filter}
                    onChange={(e) =>
                      setFilter(e.target.value as any)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="ALL">All</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="OUT">Out of stock</option>
                  </select>
                </div>
              </div>

              {/* Inventory list section */}
              <div className="mt-3 text-sm text-stone-600">

                {loadingFoods ? (
                  
                  // Loading message while inventory data is being fetched.
                  <div>Loading...</div>
                ) : (
                  
                  // Food inventory list.
                  <div className="space-y-2 max-h-44 overflow-auto">

                    {filteredFoods.map((f) => (
                      
                      /* Individual food inventory row */
                      <div
                        key={f.id}
                        className="flex items-center justify-between border-b py-2"
                      >
                        
                        {/* Food item information */}
                        <div>
                          <div className="font-medium text-slate-900">
                            {f.name}
                          </div>

                          <div className="text-xs text-stone-500">
                            {f.categoryName}
                          </div>
                        </div>

                        {/* Food stock and availability details */}
                        <div className="text-sm">
                          <span className="mr-3">
                            {f.stockQuantity}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              f.status === "AVAILABLE"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {f.status === "AVAILABLE"
                              ? "Available"
                              : "Out"}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Empty inventory message */}
                    {filteredFoods.length === 0 && (
                      <div className="text-xs text-stone-500">
                        No items to show.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          </>
        )}
      </div>

      {/* Customer order history section */}
      {user?.role === "CUSTOMER" && (
        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          
          <div className="flex items-center justify-between">
            
            {/* Orders section heading */}
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Your Orders
              </p>

              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Recent orders & status
              </h3>
            </div>

            {/* Order date filter controls */}
            <div className="flex items-center gap-2">
              
              {/* Start date filter */}
              <div className="flex flex-col text-sm">
                <label className="text-xs text-stone-500">
                  From
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="border rounded px-2 py-1"
                />
              </div>

              {/* End date filter */}
              <div className="flex flex-col text-sm">
                <label className="text-xs text-stone-500">
                  To
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Customer orders list */}
          <div className="mt-4 text-sm text-stone-600">

            {loadingOrders ? (
              
              // Loading message while order data is being fetched.
              <div>Loading orders...</div>
            ) : (
              
              // Customer order history list.
              <div className="space-y-3 max-h-60 overflow-auto">

                {filteredOrders.map((o) => (
                  
                  /* Individual customer order card */
                  <div
                    key={o.orderId}
                    className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
                  >
                    
                    {/* Order details section */}
                    <div>
                      
                      {/* Order ID */}
                      <div className="font-medium text-slate-900">
                        Order ID{o.orderId}
                      </div>

                      {/* Order creation timestamp */}
                      <div className="text-xs text-stone-500">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Order status and payment details */}
                    <div className="text-right">
                      
                      {/* Order total amount */}
                      <div className="text-sm font-semibold">
                        Rs. {o.totalAmount.toFixed(2)}
                      </div>

                      {/* Order and payment status badges */}
                      <div className="mt-1">
                        
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700 mr-2">
                          {o.status}
                        </span>

                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
                          {o.paymentStatus ?? "NO_PAYMENT"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty orders message */}
                {!filteredOrders.length && (
                  <div className="text-xs text-stone-500">
                    No orders found for selected dates.
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      )}
    </section>
  );
};