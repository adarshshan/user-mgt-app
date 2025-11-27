import {
  createBrowserRouter,
  RouterProvider,
  Outlet, // Import Outlet for layout rendering
  Navigate,
  useLocation, // Keep useLocation for conditional Navbar rendering
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

// Define a Layout component for conditional Navbar rendering
const Layout: React.FC = () => {
  const location = useLocation();
  const noNavbarPaths = ["/login", "/register", "/"]; // Added '/' to hide Navbar on initial load
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        {shouldShowNavbar && <Navbar />}
        <Outlet /> {/* Renders the current route's component */}
      </AuthProvider>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use the Layout component for all routes
    children: [
      {
        index: true, // This makes Home the default route for "/"
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "*", // Catch-all for 404
        element: <NotFound />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
