import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    const verifyUserEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('No verification token found.');
        toast.error('No verification token found.');
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setVerificationStatus('success');
        setMessage(res.data.message);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirect to login after 3 seconds
      } catch (error: any) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed.');
        toast.error(error.response?.data?.message || 'Email verification failed.');
      }
    };

    verifyUserEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {verificationStatus === 'loading' && (
          <>
            <Spinner />
            <p className="mt-4 text-lg text-gray-700">Verifying your email...</p>
          </>
        )}
        {verificationStatus === 'success' && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Verification Successful!</h2>
            <p className="text-gray-700">{message}</p>
            <p className="mt-2 text-gray-500">Redirecting to login page...</p>
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed!</h2>
            <p className="text-gray-700">{message}</p>
            <button
              onClick={() => navigate('/register')}
              className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Go to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
