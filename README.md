# User Management App (MERN Stack)

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for user management with secure session-based authentication, 2FA (Email OTP), and data encryption.

## Features

-   **User Registration:** Collects name, email, password, phone, DOB. Includes email verification.
-   **User Login:** Secure session-based authentication with 2FA via email OTP.
-   **User Logout:** Securely destroys user session.
-   **Dashboard:** Displays basic user details (protected route).
-   **Edit Profile:** Users can update their profile information (name, phone, DOB).
-   **Secure Data:** All user information (except email) stored in the database is encrypted.
-   **Form Validation:** Client-side validation using React Hook Form.
-   **Global Notifications:** Toast notifications for user feedback.

## Tech Stack

**Frontend:**
-   React
-   Vite
-   TypeScript
-   Tailwind CSS
-   React Router DOM
-   React Hook Form
-   Axios
-   React Hot Toast

**Backend:**
-   Node.js
-   Express.js
-   TypeScript
-   MongoDB (Mongoose ODM)
-   Bcrypt (for password hashing)
-   Node `crypto` module (for data encryption)
-   Nodemailer (for email verification and OTP)
-   Express Session (for session management)
-   Connect Mongo (for session store)
-   CSURF (for CSRF protection)
-   Helmet (for HTTP headers security)
-   CORS
-   Dotenv

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/              # Environment variables and configuration
│   │   │   └── index.ts
│   │   ├── controllers/         # Handles HTTP requests, calls services
│   │   │   ├── auth.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── middlewares/         # Express middleware (auth, error handling)
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/              # Mongoose schemas and models
│   │   │   └── User.ts
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   └── user.service.ts
│   │   ├── utils/               # Utility functions (crypto, email, response)
│   │   │   ├── crypto.ts
│   │   │   ├── email.ts
│   │   │   └── response.ts
│   │   └── server.ts            # Main Express application setup
│   ├── .env.example             # Example environment variables for backend
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
│   ├── components/          # Reusable React components
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Spinner.tsx
│   ├── context/             # React Context for global state (Auth)
│   │   └── AuthContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts
│   ├── pages/               # Application pages/views
│   │   ├── Dashboard.tsx
│   │   ├── EditProfile.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Register.tsx
│   │   ├── VerifyEmail.tsx
│   │   └── VerifyOTP.tsx
│   ├── services/            # API service (Axios instance)
│   │   └── api.ts
│   ├── App.tsx              # Main React application component, routing
│   ├── index.css            # Tailwind CSS directives and global styles
│   └── main.tsx             # React entry point
├── .env.example             # Example environment variables for frontend
├── .gitignore
├── package.json
├── postcss.config.js        # PostCSS configuration for Tailwind
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts           # Vite build configuration
```

## Installation and Setup

### Prerequisites

-   Node.js (LTS recommended)
-   npm or Yarn
-   MongoDB instance (local or cloud-hosted)

### 1. Clone the repository

```bash
git clone <repository-url>
cd user-mgt-app
```

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  Create a `.env` file in the `backend` directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
4.  Edit the `.env` file with your MongoDB connection string, email credentials, session secret, and encryption keys.
    -   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/user-mgt-app`)
    -   `SESSION_SECRET`: A long, random string for session encryption.
    -   `ENCRYPTION_KEY`: A 32-character hexadecimal string for data encryption. You can generate one using `require('crypto').randomBytes(32).toString('hex')` in Node.js.
    -   `ENCRYPTION_IV`: A 16-character hexadecimal string for data encryption. You can generate one using `require('crypto').randomBytes(16).toString('hex')` in Node.js.
    -   `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: Your SMTP server details for Nodemailer (e.g., Gmail, SendGrid, Mailtrap for testing).
    -   `FRONTEND_URL`: The URL where your frontend application will run (e.g., `http://localhost:3000`).
5.  Start the backend development server:
    ```bash
    npm run dev
    # or yarn dev
    ```
    The backend server will run on `http://localhost:5000` (or your specified `PORT`).

### 3. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  Create a `.env` file in the `frontend` directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
4.  Edit the `.env` file with your backend API base URL:
    -   `VITE_API_BASE_URL`: Should point to your backend (e.g., `http://localhost:5000/api`).
5.  Start the frontend development server:
    ```bash
    npm run dev
    # or yarn dev
    ```
    The frontend application will run on `http://localhost:3000` (or your specified Vite port).

## Usage

1.  **Register:** Access the frontend application at `http://localhost:3000`. Register a new account. An email verification link will be sent to the provided email address.
2.  **Verify Email:** Click the verification link in your email. This will redirect you back to the frontend with a success message.
3.  **Login:** Use your verified credentials to log in. You will then receive an OTP via email.
4.  **Verify OTP:** Enter the OTP received in your email to complete the login process.
5.  **Dashboard:** After successful login, you'll be redirected to the dashboard, displaying your encrypted user details.
6.  **Edit Profile:** Navigate to the profile page to update your name, phone number, or date of birth.
7.  **Logout:** Click the logout button in the navigation bar to end your session.

## Important Security Notes

-   **Encryption Keys:** Keep your `ENCRYPTION_KEY` and `ENCRYPTION_IV` in the backend's `.env` file absolutely secure and do not commit them to version control. They are crucial for decrypting user data.
-   **Session Secret:** The `SESSION_SECRET` in the backend's `.env` file should be a strong, randomly generated string.
-   **Email Credentials:** Handle your `EMAIL_PASS` securely and do not commit it to version control.
-   **CSRF Protection:** The application includes CSRF protection. Ensure your frontend properly sends the `X-CSRF-Token` header for all mutating requests (`POST`, `PUT`, `DELETE`).
-   **HTTPS:** For production environments, it is critical to deploy both the frontend and backend with HTTPS to ensure secure communication and cookie transmission.
-   **Error Handling:** The current error handling is basic. In a production system, implement more robust error logging and monitoring.
#   u s e r - m g t - a p p  
 