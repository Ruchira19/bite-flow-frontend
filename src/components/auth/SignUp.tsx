import { FormEvent, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

import { appSignup } from "../service/AuthService";

import { Alert } from "../util/Alert";

import { extractErrorMessage } from "../service/api";

import signUpLogo from "../../assets/sign-up-logo.png";

export const SignUp = () => {
  
  // Stores signup form input values.
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // Stores authentication or validation errors.
  const [error, setError] = useState("");
  
  // Controls loading state during signup requests.
  const [loading, setLoading] = useState(false);
  
  // Access authentication functions from AuthProvider.
  const { login } = useAuth();
  
  // Used for page navigation after successful signup.
  const navigate = useNavigate();

  // Handle user signup form submission.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validate whether password and confirm password fields match.
    if (form.password !== form.confirmPassword) {
      
      // Display validation error message.
      setError("Passwords do not match");

      // Stop form submission when validation fails.
      return;
    }

    // Enable loading state during signup request.
    setLoading(true);

    // Clear previous error messages.
    setError("");

    try {
      
      // Send signup request to the backend.
      const response = await appSignup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      // Store authenticated user details and token.
      login(response.token, {
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      });

      // Redirect newly registered user to the foods page.
      navigate("/foods");
    } catch (err) {
      
      // Display authentication or API errors.
      setError(extractErrorMessage(err));
    } finally {
      
      // Disable loading state after request completion.
      setLoading(false);
    }
  };

  // Main signup page interface.
  return (
    <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.9fr]">
      
      {/* Signup promotional section */}
      <div className="rounded-3xl border border-stone-200 bg-white px-8 py-10 shadow-sm">
        
        {/* Promotional signup message */}
        <p className="text-3xl text-slate-900">
          Don’t have an account? Let’s create one and start ordering
        </p>

        {/* Signup illustration image */}
        <div className="mt-6 h-full">
          <img
            src={signUpLogo}
            alt="logo"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Signup form section */}
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
        
        {/* Signup form heading */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">
            Sign Up
          </h3>
        </div>

        {/* Signup form */}
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

          {/* Full name input field */}
          <input
            type="text"
            placeholder="Full name"
            value={form.fullName}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                fullName: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            required
          />

          {/* Email input field */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                email: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            required
          />

          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            required
          />

          {/* Confirm password input field */}
          <input
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            required
          />

          {/* Signup submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-200"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </section>
  );
};