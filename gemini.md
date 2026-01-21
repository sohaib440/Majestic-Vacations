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
