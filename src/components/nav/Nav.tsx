import { useState } from "react";

import {
  ShoppingCartIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  QueueListIcon,
  CreditCardIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

// Navigation links displayed for customer accounts.
const customerNav = [
  {
    name: "Home",
    to: "/home",
    icon: Squares2X2Icon,
  },
  {
    name: "Food",
    to: "/foods",
    icon: QueueListIcon,
  },
  {
    name: "Cart",
    to: "/cart",
    icon: ShoppingCartIcon,
  },
  {
    name: "Orders",
    to: "/orders",
    icon: ClipboardDocumentListIcon,
  },
];

// Navigation links displayed for admin accounts.
const adminNav = [
  {
    name: "Home",
    to: "/home",
    icon: Squares2X2Icon,
  },
  {
    name: "Categories",
    to: "/admin/categories",
    icon: QueueListIcon,
  },
  {
    name: "Foods",
    to: "/admin/foods",
    icon: ShoppingCartIcon,
  },
  {
    name: "Orders",
    to: "/admin/orders",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Payments",
    to: "/admin/payments",
    icon: CreditCardIcon,
  },
  {
    name: "Users",
    to: "/admin/users",
    icon: UsersIcon,
  },
];

// Navigation links displayed for unauthenticated users.
const guestNav = [
  {
    name: "Login",
    to: "/login",
    icon: ArrowLeftOnRectangleIcon,
  },
  {
    name: "Sign Up",
    to: "/signup",
    icon: UsersIcon,
  },
];

// Generate consistent navigation link styles.
const navItemClass = ({
  isActive,
}: {
  isActive: boolean;
}) =>
  [
    "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",

    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-200 hover:text-slate-900",
  ].join(" ");

export default function Nav() {
  
  // Retrieve authentication details and logout function.
  const {
    isAuthenticated,
    logout,
    user,
  } = useAuth();
  
  // Used for page navigation after logout.
  const navigate = useNavigate();
  
  // Controls mobile navigation menu visibility.
  const [menuOpen, setMenuOpen] = useState(false);

  // Select navigation links based on authentication role.
  const navigation = isAuthenticated
    ? user?.role === "ADMIN"
      ? adminNav
      : customerNav
    : guestNav;

  // Handle user logout process.
  const handleLogout = () => {
    
    // Clear authentication details.
    logout();

    // Redirect user to the login page.
    navigate("/login");
  };

  // Main navigation bar interface.
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-100/95 backdrop-blur">
      
      {/* Navigation container */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Application branding section */}
        <div>
          
          {/* Application name */}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            BiteFlow
          </p>

          {/* Welcome heading for authenticated users */}
          <h1 className="text-lg font-semibold text-slate-900">
            {isAuthenticated
              ? "Welcome to BiteFlow"
              : ""}
          </h1>
        </div>

        {/* Mobile navigation menu toggle button */}
        <button
          type="button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="md:hidden inline-flex items-center justify-center rounded-full p-2 hover:bg-slate-200"
        >
          {menuOpen ? (
            
            // Close menu icon
            <XMarkIcon className="h-6 w-6 text-slate-900" />
          ) : (
            
            // Open menu icon
            <Bars3Icon className="h-6 w-6 text-slate-900" />
          )}
        </button>

        {/* Desktop navigation menu */}
        <nav className="hidden flex-wrap items-center gap-2 md:flex">

          {navigation.map((item) => {
            
            // Retrieve icon component for navigation item.
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={navItemClass}
              >
                
                {/* Navigation icon */}
                <Icon className="h-4 w-4" />

                {/* Navigation label */}
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile navigation drawer */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-stone-200 bg-stone-100 md:hidden z-30">
            
            {/* Mobile navigation links */}
            <nav className="flex flex-col divide-y divide-stone-200 px-4 py-2">

              {navigation.map((item) => {
                
                // Retrieve icon component for mobile navigation item.
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.to}

                    // Close mobile menu after navigation.
                    onClick={() =>
                      setMenuOpen(false)
                    }

                    className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
                  >
                    
                    {/* Mobile navigation icon */}
                    <Icon className="h-4 w-4" />

                    {/* Mobile navigation label */}
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* User profile and logout section */}
        <div className="flex items-center gap-3">

          {/* Logged-in user summary */}
          {user ? (
            <div className="hidden rounded-full border border-stone-300 bg-white px-3 py-2 text-right md:block">
              
              {/* User role */}
              <div className="text-xs uppercase tracking-[0.2em] text-stone-500">
                {user.role}
              </div>

              {/* User full name */}
              <div className="text-sm font-semibold text-slate-900">
                {user.fullName}
              </div>
            </div>
          ) : null}

          {/* Logout button for authenticated users */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-400 hover:text-rose-700"
            >
              
              {/* Logout icon */}
              <ArrowRightOnRectangleIcon className="h-4 w-4" />

              {/* Logout button label */}
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}