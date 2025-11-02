// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Import all your pages (unchanged)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// 2. === NEW: Import our Gatekeeper ===
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* These routes are "public" - anyone can see them */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* === NEW: Our Protected Route ===
        1. The router matches the path "/dashboard"
        2. It tries to render the 'element'
        3. The <ProtectedRoute> component runs its logic *first*.
        4. If it finds a token, it renders its 'children' (<DashboardPage />).
        5. If it *doesn't* find a token, it redirects to "/login".
      */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />

    </Routes>
  );
}

export default App;