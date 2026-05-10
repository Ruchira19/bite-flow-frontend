import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createFood,
  deleteFood,
  getCategories,
  getFoods,
  updateFood,
} from "../service/CatalogService";
import { Category, FoodItem, FoodStatus } from "../model/types";
import { Alert } from "../util/Alert";
import { Loading } from "../util/Loading";
import { extractErrorMessage } from "../service/api";

// Default form values used when creating a new food item.
const emptyForm = {
  name: "",
  description: "",
  price: 0,
  stockQuantity: 0,
  status: "AVAILABLE" as FoodStatus,
  categoryId: 0,
};

export const FoodsAdminPage = () => {
  
  // Stores all food items retrieved from the backend.
  const [foods, setFoods] = useState<FoodItem[]>([]);
  
  // Stores all food categories used in the category dropdown.
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Stores current form input values.
  const [form, setForm] = useState(emptyForm);
  
  // Tracks which food item is currently being edited.
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Controls loading spinner visibility while fetching data.
  const [loading, setLoading] = useState(true);
  
  // Success message displayed after create, update, or delete actions.
  const [message, setMessage] = useState("");
  
  // Stores API or validation errors shown to the admin user.
  const [error, setError] = useState("");

  // Fetch both food items and categories from the backend.
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      
      // Execute both food items and categories API calls
      const [foodsData, categoriesData] = await Promise.all([
        getFoods(false),
        getCategories(),
      ]);

      // Store retrieved food items.
      setFoods(foodsData);

      // Store retrieved categories.
      setCategories(categoriesData);

      // Automatically assign the first available category for new food items.
      setForm((prev) =>
        !prev.categoryId && categoriesData.length
          ? { ...prev, categoryId: categoriesData[0].id }
          : prev
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load food items and categories when the page is first rendered.
  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Handle both create and update operations using the same form.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      
      // Update existing food item if editing mode is active.
      if (editingId) {
        await updateFood(editingId, form);
        setMessage("Food item updated");
      } else {
        // Create a new food item when not editing.
        await createFood(form);
        setMessage("Food item created");
      }

      // Reset form values after successful submission.
      setForm({
        ...emptyForm,
        categoryId: categories[0]?.id ?? 0,
      });

      // Exit editing mode after submission.
      setEditingId(null);

      // Reload food items to keep frontend data synchronized.
      await loadData();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Load selected food item data into the form for editing.
  const beginEdit = (food: FoodItem) => {
    setEditingId(food.id);

    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      stockQuantity: food.stockQuantity,
      status: food.status,
      categoryId: food.categoryId,
    });
  };

  // Delete food item and refresh the food items list afterward.
  const handleDelete = async (foodId: number) => {
    try {
      await deleteFood(foodId);

      setMessage("Food item deleted");

      // Reload food items to remove deleted records from the UI.
      await loadData();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Display loading spinner while food data is being fetched.
  if (loading) {
    return <Loading label="Loading food items..." />;
  }

  // Main food management interface.
  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      
      {/* Food create and update form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        
        {/* Food management heading */}
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          Food Management
        </p>

        {/* Dynamic heading based on create or edit mode */}
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {editingId ? "Edit food item" : "Create food item"}
        </h2>

        {/* Total stock summary */}
        <p className="mt-2 text-sm text-stone-600">
          Total available food units:{" "}
          {foods.reduce((sum, food) => sum + food.stockQuantity, 0)}
        </p>

        {/* Food form fields container */}
        <div className="mt-6 space-y-4">

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

          {/* Food name input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Food name</span>

            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="Enter food name"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              required
            />
          </label>

          {/* Food description input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Description</span>

            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Enter description"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              required
            />
          </label>

          {/* Price and stock quantity section */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Food price input */}
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Price</span>

              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(event.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
                required
              />
            </label>

            {/* Food stock quantity input */}
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Stock quantity</span>

              <input
                type="number"
                min={0}
                value={form.stockQuantity}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    stockQuantity: Number(event.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
                placeholder="Enter available units"
                required
              />
            </label>
          </div>

          {/* Food status selection section */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Food availability status dropdown */}
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Status</span>

              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status:
                      event.target.value as "AVAILABLE" | "OUT_OF_STOCK",
                  }))
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              </select>
            </label>
          </div>

          {/* Food category selection */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Category</span>

            <select
              value={form.categoryId}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: Number(event.target.value),
                }))
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {/* Form action buttons */}
          <div className="flex gap-3">

            {/* Submit button for create or update actions */}
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              {editingId ? "Update" : "Create"}
            </button>

            {/* Cancel button displayed only during edit mode */}
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  // Exit editing mode.
                  setEditingId(null);

                  // Reset form values back to default state.
                  setForm({
                    ...emptyForm,
                    categoryId: categories[0]?.id ?? 0,
                  });
                }}
                className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {/* Existing food items display section */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        {/* Food items list heading */}
        <h3 className="text-xl font-semibold text-slate-900">
          Current food items
        </h3>

        {/* Food items list container */}
        <div className="mt-5 space-y-4">

          {foods.map((food) => (
            
            /* Individual food item card */
            <div
              key={food.id}
              className="rounded-2xl border border-stone-200 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                
                {/* Food item details section */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">

                    {/* Food item name */}
                    <h4 className="text-lg font-semibold text-slate-900">
                      {food.name}
                    </h4>

                    {/* Food availability status badge */}
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                      {food.status}
                    </span>

                    {/* Food stock quantity badge */}
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                      {food.stockQuantity} units
                    </span>
                  </div>

                  {/* Food category name */}
                  <p className="mt-1 text-sm text-stone-600">
                    {food.categoryName}
                  </p>

                  {/* Food description */}
                  <p className="mt-3 text-sm text-stone-600">
                    {food.description}
                  </p>
                </div>

                {/* Food item action section */}
                <div className="min-w-36 text-right">

                  {/* Food item price */}
                  <div className="text-lg font-semibold text-slate-900">
                    Rs. {food.price.toFixed(2)}
                  </div>

                  {/* Food item action buttons */}
                  <div className="mt-4 flex justify-end gap-3">

                    {/* Edit food item button */}
                    <button
                      type="button"
                      onClick={() => beginEdit(food)}
                      className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                    >
                      Edit
                    </button>

                    {/* Delete food item button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(food.id)}
                      className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};