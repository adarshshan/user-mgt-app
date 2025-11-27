import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

interface EditProfileFormData {
  name: string;
  phone: string;
  dob: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, checkAuth, setUser } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const methods = useForm<EditProfileFormData>();
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await api.get('/users/profile');
            if (res.data.success) {
                const profile = res.data.data;
                reset({
                    name: profile.name,
                    phone: profile.phone,
                    dob: profile.dob,
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch profile for editing.');
            navigate('/dashboard'); // Redirect if profile can't be fetched
        } finally {
            setLoadingProfile(false);
        }
    };

    if (!authLoading && user) {
      fetchProfile();
    } else if (!authLoading && !user) {
        navigate('/login'); // Redirect to login if not authenticated
    }
  }, [authLoading, user, reset, navigate]);


  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const res = await api.put('/users/profile', data);
      toast.success(res.data.message);
      setUser(prevUser => (prevUser ? { ...prevUser, ...data } : null)); // Update local user state
      navigate('/dashboard'); // Redirect to dashboard after update
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profile update failed.');
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input name="name" label="Full Name" type="text" />
            <Input name="phone" label="Phone Number" type="tel" />
            <Input name="dob" label="Date of Birth" type="date" />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Profile
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditProfile;
