import { FormEvent, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

import { appLogin } from "../service/AuthService";

import { Alert } from "../util/Alert";

import { extractErrorMessage } from "../service/api";

import frontLogo from "../../assets/front-logo.jpg";

export const Login = () => {
  
  // Stores login form input values.
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  // Stores authentication or validation errors.
  const [error, setError] = useState("");
  
  // Controls loading state during login requests.
  const [loading, setLoading] = useState(false);
  
  // Access authentication functions from AuthProvider.
  const { login } = useAuth();
  
  // Used for page navigation after successful login.
  const navigate = useNavigate();

  // Handle user login form submission.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Enable loading state during authentication request.
    setLoading(true);

    // Clear previous error messages.
    setError("");

    try {
      
      // Send login request to the backend.
      const response = await appLogin(form);

      // Store authenticated user details and token.
      login(response.token, {
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      });

      // Redirect user to the home page after successful login.
      navigate("/home");
    } catch (err) {
      
      // Display authentication or API errors.
      setError(extractErrorMessage(err));
    } finally {
      
      // Disable loading state after request completion.
      setLoading(false);
    }
  };

  // Main login page interface.
  return (
    <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.9fr]">
      
      {/* Welcome banner section */}
      <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white">
        
        {/* Application welcome message */}
        <p className="text-2xl uppercase text-emerald-300">
          Welcome to BiteFlow
        </p>

        {/* Application slogan */}
        <h2 className="mt-3 text-1xl font-semibold">
          <i>Crave it. Tap it. Get it.</i>
        </h2>
        
        {/* Application promotional image */}
        <div className="mt-6 h-full">
          <img
            src={frontLogo}
            alt="logo"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Login form section */}
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        
        {/* Login form heading */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-slate-900">
            Login
          </h3>
        </div>

        {/* Login form */}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
        >
          
          {/* Error alert message */}
          {error ? (
            <Alert
              type="failed"
              message={error}
              onClose={() => setError("")}
            />
          ) : null}

          {/* Email input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-800">
            <span>Email</span>

            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-500"
              required
            />
          </label>

          {/* Password input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-800">
            <span>Password</span>

            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-500"
              required
            />
          </label>

          {/* Login submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
};