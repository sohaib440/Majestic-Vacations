# Majestic Travel Project Overview

This document outlines the structure and plan for working on the Majestic Travel project.

## About the Project

Majestic Travel is a full-stack web application for a travel agency.

*   **Backend:** The backend is a Node.js/Express application that manages user authentication, tour packages, bookings, inquiries, and payments. It uses a MongoDB database (inferred from `database.js` and Mongoose-style schemas).
*   **Frontend:** The frontend is a React application built with TypeScript and Vite. It provides the user interface for customers to browse packages, make bookings, and for administrators to manage the platform.

## How We Work

To ensure clarity and maintain code quality, we will follow a structured process for all changes:

1.  **Plan:** Before any code is modified, we will create a detailed plan. This plan will specify:
    *   **What** is the goal of the change (e.g., fix a bug, add a feature).
    *   **How** we will implement the change (e.g., which files to modify, which new functions to create).
    *   **Verification** how we will test the changes to ensure they work as expected.

2.  **Document:** Any new findings, architectural decisions, or important context discovered during development that may be needed for future reference will be documented in this file.

## Key Findings: Tour & Booking Modules

### Tour/Package

*   **Backend Model (`backend/models/tourSchema.js`):**
    *   Defines the `Tour` schema with fields like `title`, `destination`, `country`, `images`, `duration`, `featured`, `remaining_seats`, and `priceTiers`.
    *   `priceTiers` is an array for age-based pricing, e.g., `{ ageGroup: 'Adult', ageRange: '12+', price: 1000 }`.
    *   Features a soft-delete mechanism with `isDeleted` and `isActive` flags.

*   **Backend API (`backend/routes/tour.js` & `backend/controllers/tourPackage.controller.js`):**
    *   **`GET /api/tour`**: Fetches all tours with extensive filtering capabilities (e.g., by price, destination, featured status).
    *   **`GET /api/tour/:id`**: Fetches a single tour package by its ID.
    *   **`GET /api/tour/featured`**: Fetches featured tours.
    *   **`POST /api/tour`**: (Admin) Creates a new tour. Handles `multipart/form-data` for image uploads.
    *   **`PATCH /api/tour/:id`**: (Admin) Updates an existing tour.
    *   **`DELETE /api/tour/:id`**: (Admin) Soft-deletes a tour by setting `isDeleted` to `true` and `isActive` to `false`.
    *   **`GET /api/tour/check/availability`**: Checks if a specified number of seats are available for a tour.

*   **Frontend Implementation:**
    *   **Type:** `frontend/src/types/tour-package.ts`
    *   **API Hooks:** `frontend/src/features/tourPackageApi.ts` (uses `@tanstack/react-query`).
    *   **Components:**
        *   `PackageCard.tsx`: Displays a single tour in a grid.
        *   `PackagesGrid.tsx`: Renders a grid of `PackageCard` components based on filters.
        *   `TourDetailPage.tsx`: Shows detailed information for a single tour.
        *   `frontend/src/components/tour/admin/TourForm.tsx`: Admin form for creating/editing tours.

### Booking

*   **Backend Model (`backend/models/booking.model.js`):**
    *   Defines the `Booking` schema, which references a `Tour`.
    *   Includes `customerInfo`, `participants` (detailing number of people per age group), `pricing` details (`totalAmount`, `currency`, `paymentPlan`, `monthlyAmount`, `monthsRequired`), `bookingStatus` (`pending`, `confirmed`, `cancelled`, `completed`), and `paymentStatus` (`unpaid`, `partial`, `paid`, `failed`).
    *   Generates a unique `bookingReference` before saving.
    *   A virtual property `seatsBooked` calculates total participants.

*   **Backend API (`backend/routes/bookingRoutes.js` & `backend/controllers/bookingController.js`):**
    *   **`POST /api/booking`**: Creates a new booking. Calculates total price based on `priceTiers` from the referenced `Tour`.
    *   **`GET /api/booking`**: Fetches all bookings (admin view).
    *   **`GET /api/booking/:id`**: Fetches a single booking by its ID.
    *   **`PUT /api/booking/:id`**: (Admin) Updates a booking.
    *   **`DELETE /api/booking/:id`**: (Admin) Deletes a booking.

*   **Frontend Implementation:**
    *   **Type:** `frontend/src/types/booking.ts`
    *   **API Hooks:** `frontend/src/features/bookingApi.ts` (uses `@tanstack/react-query`).
    *   **Components:**
        *   `BookingForm.tsx`: A comprehensive form for users to create a booking, select participants, and see the total price.
        *   `BookingsList.tsx`: (Admin/User) A table to view and manage bookings.
        *   `frontend/src/pages/admin/bookings/BookingSuccess.tsx`: Page to handle successful payment redirection and booking confirmation.
        *   `frontend/src/pages/admin/bookings/BookingCancel.tsx`: Page to handle cancelled payment redirection.
