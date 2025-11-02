// src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Link is how we navigate pages

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-slate-800 mb-6">Welcome to Vocab-Builder</h1>
      <p className="text-xl text-slate-600 mb-10">Your personal app for mastering exam vocabulary.</p>
      
      {/* This is how we link to other pages */}
      <div className="space-x-4">
        <Link 
          to="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="px-6 py-3 bg-white text-slate-700 rounded-lg shadow font-semibold hover:bg-slate-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
}