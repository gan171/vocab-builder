// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import the icons
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';

// This is the same placeholder graphic component
const AuthGraphic = () => (
  <div className="hidden md:block w-1/2 bg-gray-800 p-12">
        <h2 className="text-3xl font-bold text-white mt-6">
      Welcome Back!
    </h2>
    <p className="text-gray-300 mt-4">
      Ready to pick up where you left off? Let's get you signed in.
    </p>
  </div>
);

export default function LoginPage() {
  // 2. Setup our form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // 3. Create the form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 4. Call the LOGIN endpoint
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // 5. Handle SUCCESS
      // The server sends back a "token". We need to save it!
      // localStorage is a simple way to save it in the browser.
      localStorage.setItem('token', data.token);
      
      // We also save user info, this can be useful
      localStorage.setItem('user', JSON.stringify(data.user));

      // 6. Redirect to the main app!
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-xl shadow-2xl overflow-hidden">
        
        <AuthGraphic />

        <div className="w-full md:w-1/2 p-8 bg-white">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Hello! Welcome Back</h1>
          <p className="text-slate-600 mb-6">Sign in to continue your progress.</p>

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
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <button 
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="mx-4 text-sm text-slate-500">Or continue with</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>

          {/* Social Logins */}
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

          {/* Link to Register Page */}
          <p className="text-center text-sm text-slate-600 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}