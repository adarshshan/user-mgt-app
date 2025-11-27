import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../services/api";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

interface OTPFormData {
  otp: string;
}

const VerifyOTP: React.FC = () => {
  const methods = useForm<OTPFormData>();
  const navigate = useNavigate();
  const { handleSubmit } = methods;
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth(); // Renamed to avoid conflict with local login function

  const onSubmit = async (data: OTPFormData) => {
    setLoading(true);
    const tempUserId = localStorage.getItem("tempUserId");

    if (!tempUserId) {
      toast.error(
        "User ID not found for OTP verification. Please try logging in again."
      );
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", {
        otp: data.otp,
        userId: tempUserId,
      });
      toast.success(res.data.message);
      localStorage.removeItem("tempUserId"); // OTP verified, clear tempUserId
      await authLogin(); // Update authentication status
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-4">
          A One-Time Passcode has been sent to your email. Please enter it below
          to complete your login.
        </p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="otp"
              label="One-Time Passcode"
              type="text"
              maxLength={6}
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default VerifyOTP;
