# BiteFlow Frontend

## Overview

A comprehensive frontend web application for a food ordering platform built using React, TypeScript, React Router, Axios, and Tailwind CSS.

This frontend provides secure authentication, role-based authorization, food browsing, shopping cart management, order tracking, payment workflows, admin management dashboards, and responsive navigation for a complete food ordering experience.

---

# Features

## Authentication & Security

- JWT-based authentication integration
- Persistent login using localStorage
- Role-based route protection
- Protected customer and admin pages
- Axios interceptor for automatic token attachment
- Secure logout handling

## User Management

- User registration and login
- Authentication state management
- Profile-based navigation rendering
- Admin user management interface

## Food & Category Management

- Food catalog browsing
- Food search functionality
- Category-based filtering
- Food item management for admins
- Category management for admins
- Real-time inventory visibility

## Shopping Cart

- Add items to cart
- Update cart quantities
- Remove cart items
- Clear shopping cart
- Live cart synchronization

## Order Management

- Place food orders
- View customer order history
- Cancel customer orders
- Order status tracking
- Admin order management
- Payment completion workflow

## Payment Management

- Payment status tracking
- Transaction reference submission
- Payment monitoring dashboard
- Order-payment synchronization

## Dashboard & Navigation

- Customer dashboard
- Admin dashboard
- Inventory overview
- Income summaries
- Responsive navigation menu
- Mobile-friendly layout

# Frontend Architecture Layers

- auth - Authentication and authorization handling
- admin - Admin management pages
- cart - Shopping cart management
- dashboard - Dashboard and analytics pages
- food - Food catalog management
- nav - Navigation components
- order - Order and payment management
- service - API communication layer
- util - Reusable utility components
- model - Shared TypeScript interfaces and types


# Main Pages

## Public Pages

- Login Page
- Signup Page

## Customer Pages

- Home Dashboard
- Food Catalog
- Shopping Cart
- Orders Page

## Admin Pages

- Categories Management
- Foods Management
- Orders Management
- Payments Management
- Users Management


---

# Routing Structure

## Public Routes

- `/login`
- `/signup`

## Customer Routes

- `/home`
- `/foods`
- `/cart`
- `/orders`

## Admin Routes

- `/admin/categories`
- `/admin/foods`
- `/admin/orders`
- `/admin/payments`
- `/admin/users`

---

# Authentication Flow

- User logs in or signs up
- Backend returns JWT token
- Token is stored in localStorage
- Axios interceptor attaches token to API requests
- Protected routes validate authentication and roles
- Unauthorized users are redirected automatically

---

# API Communication

## Main Service Modules

- AuthService.ts
- CartService.ts
- CatalogService.ts
- OrderService.ts
- AdminService.ts

## Axios Features

- Shared Axios instance
- Automatic JWT token injection
- Centralized error handling
- API base URL configuration

---


---

# Environment Configuration

Changes the below in api.ts in src/service.

```Local Host
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

Production:

```env
REACT_APP_API_BASE_URL=https://your-production-url/api/v1/
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Navigate to Project

```bash
cd biteflow-frontend
```

---

## Install Dependencies

```bash
npm install
```

---

# Running the Application

## Start Development Server

```bash
npm start
```
Application runs on:

```text
http://localhost:3000
```

---

# Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend Framework |
| TypeScript | Type Safety |
| React Router | Client-Side Routing |
| Axios | API Communication |
| Tailwind CSS | UI Styling |
| Heroicons | Icons |
| Context API | State Management |
| JWT | Authentication |

---

---

# Security Features

- JWT token authentication
- Protected routes
- Role-based authorization
- Axios request interceptor
- Persistent login sessions
- Automatic unauthorized redirects

---

# Business Rules

- Only authenticated users can access protected routes
- Customers can only access customer pages
- Admins can only access admin pages
- Payments require transaction references
- Empty carts cannot place orders
- Out-of-stock items cannot be added beyond available quantity

---

# Backend Integration

This frontend application communicates with the BiteFlow Spring Boot backend API for:

- Authentication
- Food management
- Cart operations
- Order processing
- Payment management
- User management

---

# Author

Ruchira Sampath

GitHub:
https://github.com/Ruchira19
