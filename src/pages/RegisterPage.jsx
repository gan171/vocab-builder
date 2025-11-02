// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
// We need 'Link' for the "Already have an account?" link
// and 'useNavigate' to redirect the user after they register
import { Link, useNavigate } from 'react-router-dom';

// 1. Import the icons we need from the library
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';

// This is a placeholder for your cool graphic
const AuthGraphic = () => (
  <div className="hidden md:block w-1/2 bg-gray-800 p-12">
    {/* This is where you'd put your image.
      For now, we'll just put some placeholder text.
    */}
        <h2 className="text-3xl font-bold text-white mt-6">
      Master vocabulary, one word at a time.
    </h2>
    <p className="text-gray-300 mt-4">
      Join our community and start building your knowledge base for your upcoming exams.
    </p>
  </div>
);

export default function RegisterPage() {
  // 2. Setup our form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate(); // This hook lets us redirect the user

  // 3. Create the form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setError(null); // Clear old errors
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server sent an error (like "User already exists")
        throw new Error(data.message || 'Failed to register');
      }

      // 4. Handle SUCCESS
      setSuccess('Success! Redirecting you to login...');
      // After 2 seconds, send them to the login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // 5. Handle ERRORS
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* This is the main card, matching your UI design */}
      <div className="w-full max-w-4xl flex rounded-xl shadow-2xl overflow-hidden">
        
        {/* Column 1: The Graphic (hidden on mobile) */}
        <AuthGraphic />

        {/* Column 2: The Form */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-600 mb-6">Let's get you started.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiOutlineMail className="h-5 w-5 text-slate-400" />
                </span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
                </span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6" // Good practice!
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Account
            </button>
          </form>

          {/* Separator ("Or continue with") */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="mx-4 text-sm text-slate-500">Or continue with</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>

          {/* Social Logins (like your UI) */}
          <div className="flex justify-center space-x-4">
            <button className="p-3 border border-slate-300 rounded-full hover:bg-slate-50">
              <FcGoogle className="h-6 w-6" />
            </button>
            <button className="p-3 border border-slate-300 rounded-full hover:bg-slate-50">
              <FaApple className="h-6 w-6" />
            </button>
            <button className="p-3 border border-slate-300 rounded-full hover:bg-slate-50">
              <FaFacebook className="h-6 w-6 text-blue-700" />
            </button>
          </div>

          {/* Link to Login Page */}
          <p className="text-center text-sm text-slate-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}