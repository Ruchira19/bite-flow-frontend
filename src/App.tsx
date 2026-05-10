import "./App.css";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./components/auth/AuthProvider";

import { Login } from "./components/auth/Login";

import { SignUp } from "./components/auth/SignUp";

import Nav from "./components/nav/Nav";

import { ProtectedRoute } from "./components/util/ProtectedRoute";

import { Home } from "./components/dashboard/Home";

import { FoodCatalog } from "./components/food/FoodCatalog";

import { CartPage } from "./components/cart/CartPage";

import { OrdersPage } from "./components/order/OrdersPage";

import { CategoriesPage } from "./components/admin/CategoriesPage";

import { FoodsAdminPage } from "./components/admin/FoodsAdminPage";

import { OrdersAdminPage } from "./components/admin/OrdersAdminPage";

import { PaymentsPage } from "./components/admin/PaymentsPage";

import { UsersPage } from "./components/admin/UsersPage";

// Redirect users based on authentication status.
const RootRedirect = () => {
  
  // Retrieve authentication status from AuthProvider.
  const { isAuthenticated } = useAuth();

  // Redirect unauthenticated users to the login page.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Redirect authenticated users to the home page.
  return (
    <Navigate
      to="/home"
      replace
    />
  );
};

// Main application layout and routing container.
function AppShell() {
  return (
    
    // Main application wrapper.
    <div className="min-h-screen bg-stone-100 text-slate-900">
      
      {/* Top navigation bar */}
      <Nav />

      {/* Main application content area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Application route definitions */}
        <Routes>
          
          {/* Default root route */}
          <Route
            path="/"
            element={<RootRedirect />}
          />

          {/* Login page route */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Signup page route */}
          <Route
            path="/signup"
            element={<SignUp />}
          />

          {/* Shared home dashboard route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Customer food catalog route */}
          <Route
            path="/foods"
            element={
              <ProtectedRoute
                roles={["CUSTOMER"]}
              >
                <FoodCatalog />
              </ProtectedRoute>
            }
          />

          {/* Customer cart route */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute
                roles={["CUSTOMER"]}
              >
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Customer orders route */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute
                roles={["CUSTOMER"]}
              >
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Admin category management route */}
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          {/* Admin food management route */}
          <Route
            path="/admin/foods"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <FoodsAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Admin order management route */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <OrdersAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Admin payment management route */}
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin user management route */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route for invalid paths */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// Root application component.
function App() {
  return (
    
    // Authentication provider wrapper for the entire application.
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

// Export root application component.
export default App;