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


folder structure 
├── backend
│   ├── config
│   │   ├── database.js
│   │   └── multer.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── inquiry.controller.js
│   │   ├── payment.controller.js
│   │   ├── tourPackage.controller.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── audit.js
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── permission.js
│   │   └── role.js
│   ├── models
│   │   ├── Inquiry.model.js
│   │   ├── User.js
│   │   ├── booking.model.js
│   │   ├── paymentSchema.js
│   │   └── tourSchema.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── bookingRoutes.js
│   │   ├── index.js
│   │   ├── inquiry.route.js
│   │   ├── payment.routes.js
│   │   ├── tour.js
│   │   └── users.js
│   ├── utils
│   │   ├── generateToken.js
│   │   └── initializeAdmin.js
│   ├── webhooks
│   │   ├── paypalWebhook.js
│   │   └── stripeWebhook.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── public
│   │   ├── favicon.ico
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   ├── src
│   │   ├── Styles
│   │   │   └── topAttraction.css
│   │   ├── assets
│   │   │   ├── about.jpg
│   │   │   ├── contact.avif
│   │   │   ├── logo.webp
│   │   │   └── testimonial.jpg
│   │   ├── components
│   │   │   ├── booking
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   └── BookingsList.tsx
│   │   │   ├── destinations
│   │   │   │   └── AnimatedDestinationPage.tsx
│   │   │   ├── layout
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── payment
│   │   │   │   ├── StripePaymentForm.tsx
│   │   │   │   └── paymentPage.tsx
│   │   │   ├── shared
│   │   │   │   ├── currency
│   │   │   │   │   ├── CurrencyDisplay.tsx
│   │   │   │   │   ├── CurrencyPrice.tsx
│   │   │   │   │   ├── CurrencySelector.tsx
│   │   │   │   │   └── PriceDisplay.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── DestinationCard.tsx
│   │   │   │   ├── DestinationPackagesSection.tsx
│   │   │   │   ├── FeaturedPackagesSection.tsx
│   │   │   │   ├── ImageCarousel.tsx
│   │   │   │   ├── PackageCard.tsx
│   │   │   │   ├── PackagesGrid.tsx
│   │   │   │   ├── PhotoGallery.tsx
│   │   │   │   ├── SectionHeading.tsx
│   │   │   │   ├── TestimonialCard.tsx
│   │   │   │   ├── TourDetailPage.tsx
│   │   │   │   └── WhatsAppButton.tsx
│   │   │   ├── textAnimations
│   │   │   │   ├── CountUp.tsx
│   │   │   │   ├── GradientText.tsx
│   │   │   │   ├── RotatingText.tsx
│   │   │   │   ├── ScrollRevealText.tsx
│   │   │   │   ├── ShinyText.tsx
│   │   │   │   ├── ShuffleText.tsx
│   │   │   │   ├── SplitText.tsx
│   │   │   │   ├── TextType.tsx
│   │   │   │   └── index.ts
│   │   │   ├── tour
│   │   │   │   ├── admin
│   │   │   │   │   └── TourForm.tsx
│   │   │   │   └── TourFilter.tsx
│   │   │   ├── ui
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── aspect-ratio.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── collapsible.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── context-menu.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── hover-card.tsx
│   │   │   │   ├── input-otp.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── loading-spinner.tsx
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── resizable.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── sonner.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   ├── toggle-group.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── use-toast.ts
│   │   │   ├── NavLink.tsx
│   │   │   └── ScrollToTop.tsx
│   │   ├── contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── CurrencyContext.tsx
│   │   ├── features
│   │   │   ├── authApi.ts
│   │   │   ├── bookingApi.ts
│   │   │   ├── inquiryApi.ts
│   │   │   └── tourPackageApi.ts
│   │   ├── hooks
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useCurrency.ts
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   ├── currency.ts
│   │   │   ├── gsapAnimations.ts
│   │   │   ├── image-utils.ts
│   │   │   ├── tour-utils.ts
│   │   │   └── utils.ts
│   │   ├── pages
│   │   │   ├── Home Section
│   │   │   │   ├── Aboutus.tsx
│   │   │   │   └── Carousel.tsx
│   │   │   ├── Package
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── admin
│   │   │   │   ├── bookings
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── BookingCancel.tsx
│   │   │   │   │   ├── BookingSuccess.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── customer
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dashboard
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── inquiry
│   │   │   │   │   └── inquiryPage.tsx
│   │   │   │   ├── layout
│   │   │   │   │   ├── Layout.tsx
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   └── Sidebar.tsx
│   │   │   │   └── pakages
│   │   │   │       ├── [id]
│   │   │   │       │   ├── detail
│   │   │   │       │   │   └── page.tsx
│   │   │   │       │   └── edit
│   │   │   │       │       └── page.tsx
│   │   │   │       ├── create
│   │   │   │       │   └── page.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── auth
│   │   │   │   └── Login.tsx
│   │   │   ├── destinations
│   │   │   │   ├── Dubai.tsx
│   │   │   │   ├── Greece.tsx
│   │   │   │   ├── Indonesia.tsx
│   │   │   │   ├── Thailand.tsx
│   │   │   │   └── Turkey.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── providers
│   │   │   └── CurrencyProvider.tsx
│   │   ├── services
│   │   │   └── currencyService.ts
│   │   ├── types
│   │   │   ├── booking.ts
│   │   │   ├── index.ts
│   │   │   └── tour-package.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── protectedRoute.tsx
│   │   └── vite-env.d.ts
│   ├── .gitignore
│   ├── README.md
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .gitignore
└── gemini.md
