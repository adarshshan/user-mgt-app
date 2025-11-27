import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
}

const Register: React.FC = () => {
  const methods = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const { handleSubmit } = methods;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post('/auth/register', data);
      toast.success(res.data.message);
      navigate('/login'); // Redirect to login after successful registration
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input name="name" label="Full Name" type="text" />
            <Input name="email" label="Email" type="email" />
            <Input name="password" label="Password" type="password" />
            <Input name="phone" label="Phone Number" type="tel" />
            <Input name="dob" label="Date of Birth" type="date" />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
        </FormProvider>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
