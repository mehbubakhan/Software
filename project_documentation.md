# Smart Nanny Platform - Project Documentation

## 1. Project Overview

The **Smart Nanny Platform** is a comprehensive management system designed to connect parents, nannies, daycares, adoption staff, and marketplace sellers. It facilitates daycare admissions, job postings, safety monitoring, child activities, and e-commerce functionalities tailored to childcare.

## 2. Technology Stack & Languages

- **Frontend:** 
  - **Language:** JavaScript (ES6+), React.js
  - **Framework/Build Tool:** Create React App (CRA) / Vite
  - **Styling:** Tailwind CSS, Radix UI (for accessible UI components), Framer Motion (for animations)
  - **Routing:** React Router DOM
- **Backend:** 
  - **Language:** JavaScript (Node.js)
  - **Framework:** Express.js
  - **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
  - **File Uploads:** Multer, Cloudinary
- **Database:** 
  - **Database System:** MySQL (currently hosted on Railway)
  - **Queries:** Raw SQL queries via `mysql2` package

## 3. System Architecture

The project follows a standard **Client-Server Architecture** separating the user interface from the business logic and data storage.

- **Client (Frontend):** A Single Page Application (SPA) built with React. It handles the UI, routing, and state management. It communicates with the backend via RESTful APIs using the `axios` HTTP client.
- **Server (Backend):** A REST API built with Node.js and Express. It acts as the bridge between the frontend and the database. It handles authentication, data validation, business logic, and database interactions.
- **Database (MySQL):** A relational database storing users, children, admissions, jobs, applications, activities, marketplace products, and more. 

### How the Website Works
1. **Authentication:** Users sign up or log in. The backend issues a JWT token which the frontend stores and sends in the `Authorization` header for subsequent protected API requests.
2. **Dashboard Routing:** Based on the user's role (e.g., Parent, Admin, Nanny), the frontend routes them to their specific dashboard containing specialized features.
3. **Data Fetching:** The frontend components mount and trigger `axios` requests to the backend (e.g., fetching a parent's schedule or an admin's pending admissions).
4. **Data Processing:** The backend Express controllers process the request, interact with the MySQL database using `mysql2`, and return JSON responses.
5. **UI Update:** The React frontend updates its state with the received data, rendering tables, lists, and forms dynamically.

## 4. User Roles and Details

The platform supports multiple distinct user roles, each with its own dashboard and permissions:

### 1. Parent
- **Core Function:** Manages their children, hires nannies, and interacts with daycares.
- **Features:**
  - **Profile Management:** Manage family details.
  - **Family Schedule:** View and manage daily schedules.
  - **Job Requests & Interviews:** Post jobs for nannies and manage interview schedules.
  - **Safety Monitoring:** GPS/Safety map to monitor safe zones for children.
  - **Messaging:** Communicate with nannies and daycares.
  - **Admissions:** Apply for daycare admissions.

### 2. Nanny
- **Core Function:** Finds jobs, manages their schedule, and logs child activities.
- **Features:**
  - **Job Applications:** Browse and apply to job postings created by parents or admins.
  - **Payments:** Track earnings and payment statuses.
  - **Activity Logging:** Add activities (e.g., meals, naps, playtime) for the children they care for.
  - **Settings & Profile:** Maintain their professional profile.

### 3. Daycare
- **Core Function:** Manages daycare operations and staff.
- **Features:**
  - **Booking Management:** Approve or reject daycare bookings from parents.
  - **Staff Management:** Add, edit, and delete daycare staff profiles.
  - **CCTV Monitoring:** Dashboard for camera feeds.

### 4. Admin
- **Core Function:** Oversees the entire platform.
- **Features:**
  - **Admissions Management:** Review, approve, or reject daycare applications.
  - **Job Management:** Post jobs and decide on nanny applications.
  - **Platform Oversight:** Manage organizations, children, safety features, and support tickets.
  - **Analytics:** Access full analytics and generate system reports.

### 5. Adoption Staff
- **Core Function:** Manages the adoption workflows.
- **Features:**
  - **Dashboard:** Specialized view for managing adoption cases.
  - **Reports:** Generate final reports for adoption processes.

### 6. Marketplace Seller
- **Core Function:** Sells childcare-related products on the platform.
- **Features:**
  - **Product Management:** Full CRUD (Create, Read, Update, Delete) capabilities for their products.
  - **Order Management:** Track and update the status of incoming orders.

### 7. Child (Mode)
- **Core Function:** A restricted mode designed for kids.
- **Features:**
  - **Video Library:** Access to embedded educational content.
  - **PIN Validation:** Secured by a PIN to prevent unauthorized exit from child mode.
