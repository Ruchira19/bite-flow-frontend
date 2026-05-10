import { FormEvent, useEffect, useState } from "react";

// import { createUser, deleteUser, getAllUsers, getProfile } from "../service/AdminService";
import { createUser, getAllUsers, getProfile } from "../service/AdminService";

import { Role, UserProfile } from "../model/types";

import { Alert } from "../util/Alert";

import { Loading } from "../util/Loading";

import { extractErrorMessage } from "../service/api";

// Default form values used when creating a new user account.
const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "CUSTOMER" as Role,
};

export const UsersPage = () => {
  
  // Stores all registered users retrieved from the backend.
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // Stores currently logged-in user details.
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Stores current form input values.
  const [form, setForm] = useState(emptyForm);
  
  // Controls loading spinner visibility while fetching user data.
  const [loading, setLoading] = useState(true);
  
  // Success message displayed after user creation.
  const [message, setMessage] = useState("");
  
  // Stores errors shown to the admin user.
  const [error, setError] = useState("");

  // Fetch all users and currently logged-in user details.
  const loadUsers = async () => {
    setLoading(true);

    try {
      
      // Execute both users list and profile API calls
      const [usersData, profileData] = await Promise.all([
        getAllUsers(),
        getProfile(),
      ]);

      // Store retrieved users list.
      setUsers(usersData);

      // Store current logged-in user details.
      setCurrentUser(profileData);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Load users data when the page is first rendered.
  useEffect(() => {
    void loadUsers();
  }, []);

  // Create a new user account using submitted form data.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      
      // Send create user request to the backend.
      await createUser(form);

      // Reset form values after successful submission.
      setForm(emptyForm);

      // Display success message.
      setMessage("User created");

      // Reload users list to keep frontend data synchronized.
      await loadUsers();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // User deletion functionality is temporarily disabled.
  // const handleDelete = async (userId: number) => {
  //   try {
  //     await deleteUser(userId);
  //     setMessage("User deleted");
  //     await loadUsers();
  //   } catch (err) {
  //     setError(extractErrorMessage(err));
  //   }
  // };

  // Display loading spinner while user data is being fetched.
  if (loading) {
    return <Loading label="Loading users..." />;
  }

  // Main user management interface.
  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      
      {/* User creation form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        
        {/* User management heading */}
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          User Management
        </p>

        {/* Form title */}
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Add user account
        </h2>

        {/* Total users summary */}
        <p className="mt-2 text-sm text-stone-600">
          Total registered users: {users.length}
        </p>

        {/* User form fields container */}
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

          {/* Full name input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Full name</span>

            <input
              value={form.fullName}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
              placeholder="Enter full name"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              required
            />
          </label>

          {/* Email input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
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
              placeholder="Enter email address"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              required
            />
          </label>

          {/* Password input field */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
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
              placeholder="Enter password"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              required
            />
          </label>

          {/* User role selection */}
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Role</span>

            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  role: event.target.value as Role,
                }))
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          {/* Create user button */}
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Create user
          </button>
        </div>
      </form>

      {/* Registered users display section */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        {/* Registered users list heading */}
        <h3 className="text-xl font-semibold text-slate-900">
          Registered accounts
        </h3>

        {/* Users list container */}
        <div className="mt-5 space-y-4">

          {users.map((user) => (
            
            /* Individual user account card */
            <article
              key={user.id}
              className="rounded-2xl border border-stone-200 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                
                {/* User information section */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">

                    {/* User full name */}
                    <h4 className="text-lg font-semibold text-slate-900">
                      {user.fullName}
                    </h4>

                    {/* User role badge */}
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                      {user.role}
                    </span>

                    {/* Logged-in user indicator */}
                    {currentUser?.id === user.id ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        YOU
                      </span>
                    ) : null}
                  </div>

                  {/* User email address */}
                  <p className="mt-2 text-sm text-stone-600">
                    {user.email}
                  </p>
                </div>

                {/* Delete functionality is temporarily disabled until backend support is completed. */}
                {/* <button
                  type="button"
                  onClick={() => handleDelete(user.id)}
                  disabled={currentUser?.id === user.id}
                  className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
                >
                  Delete
                </button> */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};