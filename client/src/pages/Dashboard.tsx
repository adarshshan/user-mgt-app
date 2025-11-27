import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { Calendar, Mail, Phone, User, Shield, LogOut } from "lucide-react";

const Dashboard: React.FC = () => {
  const { loading: authLoading, isAuthenticated, logout } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      try {
        setLoadingProfile(true);
        const res = await api.get("/users/profile");
        if (res.data.success) {
          setProfileData(res.data.data);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch profile."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-red-600 text-xl font-medium">
          Error: Could not load profile.
        </div>
      </div>
    );
  }

  const userName = profileData.name || "User";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {userName.split(" ")[0]}!
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Here's your account overview
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {initials}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{userName}</h2>
              <p className="text-gray-600 mt-1">{profileData.email}</p>

              <div className="mt-8 flex justify around gap-4">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    profileData.emailVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {profileData.emailVerified ? "Verified" : "Unverified"}
                </div>
              </div>

              <button
                onClick={logout}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-pink-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(profileData.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Account Status
                    </p>
                    <p className="text-lg font-semibold text-emerald-600">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
              <p className="text-green-800 font-medium text-lg">
                You're all set! Your account is secure and active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
