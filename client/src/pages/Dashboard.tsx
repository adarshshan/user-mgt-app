import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading, checkAuth, isAuthenticated } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState<any>(null); // To store fetched profile data

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return; // Don't fetch if not authenticated

      try {
        setLoadingProfile(true);
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setProfileData(res.data.data);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch profile.');
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (!user && !profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg">Error: Could not load user data.</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Dashboard</h2>
        {profileData && (
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {profileData.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {profileData.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {profileData.phone}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Date of Birth:</span> {profileData.dob}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email Verified:</span>{' '}
              {profileData.emailVerified ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
