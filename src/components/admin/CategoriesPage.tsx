import { FormEvent, useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../service/CatalogService";
import { Category } from "../model/types";
import { Alert } from "../util/Alert";
import { Loading } from "../util/Loading";
import { extractErrorMessage } from "../service/api";

// Default form values used when creating a new category.
const emptyForm = { name: "", description: "" };

export const CategoriesPage = () => {
  
  // Stores all category records retrieved from the backend.
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Stores current form input values.
  const [form, setForm] = useState(emptyForm);
  
  // Tracks which category is currently being edited.
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Controls loading spinner visibility while fetching category data.
  const [loading, setLoading] = useState(true);
  
  // Success message displayed after create, update, or delete actions.
  const [message, setMessage] = useState("");
  
  // Stores API or validation errors shown to the admin user.
  const [error, setError] = useState("");

  // Fetch all categories from the backend and refresh the UI.
  const loadCategories = async () => {
    setLoading(true);

    try {
      setCategories(await getCategories());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Load category data when the page is first rendered.
  useEffect(() => {
    loadCategories();
  }, []);

  // Handle both create and update operations using the same form.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // Update existing category if editing mode is active.
      if (editingId) {
        await updateCategory(editingId, form);
        setMessage("Category updated");
      } else {
        // Create a new category when not editing.
        await createCategory(form);
        setMessage("Category created");
      }

      // Reset form fields after successful submission.
      setForm(emptyForm);

      // Exit editing mode after submission.
      setEditingId(null);

      // Reload categories to keep frontend data synchronized.
      await loadCategories();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Load selected category data into the form for editing.
  const beginEdit = (category: Category) => {
    setEditingId(category.id);

    setForm({
      name: category.name,
      description: category.description,
    });
  };

  // Delete category and refresh the categories list afterward.
  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);

      setMessage("Category deleted");

      // Reload categories to remove deleted records from the UI.
      await loadCategories();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Display loading spinner while category data is being fetched.
  if (loading) {
    return <Loading label="Loading categories..." />;
  }

  // Main category management interface.
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      
      {/* Category create and update form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {/* Category management heading */}
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          Category Management
        </p>

        {/* Dynamic heading based on create or edit mode */}
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {editingId ? "Edit category" : "Create category"}
        </h2>

        {/* Category form fields container */}
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

          {/* Category name input field */}
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Category name"
            className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            required
          />

          {/* Category description input field */}
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            rows={4}
            placeholder="Description"
            className="w-full rounded-2xl border border-stone-300 px-4 py-3"
          />

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
                  setForm(emptyForm);
                }}
                className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {/* Existing categories display section */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        {/* Categories list heading */}
        <h3 className="text-xl font-semibold text-slate-900">
          Existing categories
        </h3>

        {/* Categories list container */}
        <div className="mt-5 space-y-4">

          {categories.map((category) => (
            
            /* Individual category card */
            <div
              key={category.id}
              className="flex flex-col gap-4 rounded-2xl border border-stone-200 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              
              {/* Category information section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {category.name}
                </h4>

                <p className="mt-1 text-sm text-stone-600">
                  {category.description}
                </p>
              </div>

              {/* Category action buttons */}
              <div className="flex gap-3">

                {/* Edit category button */}
                <button
                  type="button"
                  onClick={() => beginEdit(category)}
                  className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                >
                  Edit
                </button>

                {/* Delete category button */}
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};