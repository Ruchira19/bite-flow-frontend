import { useEffect, useMemo, useState } from "react";

import { addCartItem, getCart } from "../service/CartService";

import {
  getCategories,
  getFoods,
} from "../service/CatalogService";

import { Alert } from "../util/Alert";

import { Loading } from "../util/Loading";

import {
  Cart,
  Category,
  FoodItem,
} from "../model/types";

import { extractErrorMessage } from "../service/api";

export const FoodCatalog = () => {
  
  // Stores all food items retrieved from the backend.
  const [foods, setFoods] = useState<FoodItem[]>([]);
  
  // Stores all food categories for filtering.
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Stores current customer cart details.
  const [cart, setCart] = useState<Cart | null>(null);
  
  // Stores selected category filter value.
  const [selectedCategory, setSelectedCategory] = useState<
    number | "ALL"
  >("ALL");
  
  // Stores search input value.
  const [search, setSearch] = useState("");
  
  // Success message displayed after cart operations.
  const [message, setMessage] = useState("");
  
  // Stores API or validation errors shown to the user.
  const [error, setError] = useState("");
  
  // Controls loading spinner visibility while fetching menu data.
  const [loading, setLoading] = useState(true);
  
  // Stores selected quantities for each food item.
  const [quantities, setQuantities] = useState<
    Record<number, number>
  >({});

  // Fetch menu items, categories, and cart details.
  const loadData = async () => {
    setLoading(true);

    try {
      
      // Retrieve food items and categories together.
      const [foodsData, categoriesData] =
        await Promise.all([
          getFoods(true),
          getCategories(),
        ]);

      // Store retrieved food items.
      setFoods(foodsData);

      // Store retrieved categories.
      setCategories(categoriesData);

      try {
        
        // Retrieve customer cart details.
        setCart(await getCart());
      } catch {
        
        // Reset cart when retrieval fails.
        setCart(null);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      
      // Disable loading state after request completion.
      setLoading(false);
    }
  };

  // Load menu data when the page is first rendered.
  useEffect(() => {
    loadData();
  }, []);

  // Filter food items using search text and category selection.
  const filteredFoods = useMemo(() => {
    
    return foods.filter((food) => {
      
      // Check whether food item matches selected category.
      const matchesCategory =
        selectedCategory === "ALL" ||
        food.categoryId === selectedCategory;
      
      // Check whether food item matches search keyword.
      const matchesSearch = `${food.name} ${food.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      // Return only matching food items.
      return matchesCategory && matchesSearch;
    });
  }, [foods, search, selectedCategory]);

  // Calculate total available food units after cart reservations.
  const totalAvailableUnits = filteredFoods.reduce(
    (sum, food) =>
      sum +
      Math.max(
        0,
        food.stockQuantity -
          (
            cart?.items.find(
              (item) => item.foodItemId === food.id
            )?.quantity ?? 0
          )
      ),
    0
  );

  // Retrieve already reserved quantity for a food item.
  const getReservedQuantity = (foodId: number) =>
    cart?.items.find(
      (item) => item.foodItemId === foodId
    )?.quantity ?? 0;

  // Add selected food item to the cart.
  const handleAddToCart = async (foodId: number) => {
    
    // Clear previous messages before adding item.
    setError("");
    setMessage("");

    try {
      
      // Send add-to-cart request to the backend.
      const nextCart = await addCartItem({
        foodItemId: foodId,
        quantity: quantities[foodId] || 1,
      });

      // Update cart state with latest data.
      setCart(nextCart);

      // Display success message.
      setMessage("Item added to cart");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // Display loading spinner while menu data is being fetched.
  if (loading) {
    return <Loading label="Loading menu..." />;
  }

  // Main food catalog interface.
  return (
    <section className="space-y-6">
      
      {/* Menu header and filter section */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        
        {/* Menu heading section */}
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
            Menu
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            Browse available food items
          </h2>

          {/* Menu summary information */}
          <p className="mt-3 text-sm text-stone-600">
            {filteredFoods.length} menu items available,{" "}
            {totalAvailableUnits} total units ready to order.
          </p>
        </div>

        {/* Search and category filter controls */}
        <div className="grid gap-3 sm:grid-cols-2">
          
          {/* Food search input */}
          <input
            type="search"
            placeholder="Search food"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="rounded-2xl border border-stone-300 px-4 py-3"
          />

          {/* Category filter dropdown */}
          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value === "ALL"
                  ? "ALL"
                  : Number(event.target.value)
              )
            }
            className="rounded-2xl border border-stone-300 px-4 py-3"
          >
            <option value="ALL">
              All categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
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

      {/* Food items grid layout */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {filteredFoods.map((food) => (
          
          /* Individual food item card */
          <article
            key={food.id}
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            {(() => {
              
              // Retrieve already reserved quantity in the cart.
              const reservedQuantity =
                getReservedQuantity(food.id);
              
              // Calculate remaining available quantity.
              const availableToAdd = Math.max(
                0,
                food.stockQuantity - reservedQuantity
              );

              return (
                <>
                  
                  {/* Food item header section */}
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Food item details */}
                    <div>
                      
                      {/* Food category */}
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                        {food.categoryName}
                      </p>

                      {/* Food item name */}
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">
                        {food.name}
                      </h3>

                      {/* Available stock information */}
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                        {availableToAdd} available to add
                      </p>

                      {/* Reserved quantity information */}
                      {reservedQuantity > 0 ? (
                        <p className="mt-1 text-xs text-stone-500">
                          {reservedQuantity} already in your cart
                        </p>
                      ) : null}
                    </div>

                    {/* Food item price */}
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      Rs. {food.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Food item description */}
                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    {food.description}
                  </p>

                  {/* Quantity selector and add-to-cart controls */}
                  <div className="mt-6 flex items-center gap-3">
                    
                    {/* Quantity input field */}
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, availableToAdd)}
                      value={quantities[food.id] || 1}
                      onChange={(event) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [food.id]: Math.min(
                            Math.max(1, availableToAdd),
                            Math.max(
                              1,
                              Number(event.target.value)
                            )
                          ),
                        }))
                      }
                      className="w-20 rounded-2xl border border-stone-300 px-3 py-2"
                    />

                    {/* Add-to-cart button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(food.id)
                      }
                      disabled={availableToAdd <= 0}
                      className="flex-1 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      {availableToAdd <= 0
                        ? "Max in cart"
                        : "Add to cart"}
                    </button>
                  </div>
                </>
              );
            })()}
          </article>
        ))}
      </div>
    </section>
  );
};