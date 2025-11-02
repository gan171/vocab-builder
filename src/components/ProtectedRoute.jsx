// src/components/ProtectedRoute.jsx

import React from 'react';
// 1. We import 'Navigate' from react-router-dom
// This component's job is to redirect the user.
import { Navigate } from 'react-router-dom';

// 2. We accept a prop called 'children'.
// 'children' will be whatever component we "wrap"
// In our case, it will be the <DashboardPage />
export default function ProtectedRoute({ children }) {
  
  // 3. We check localStorage for our token
  // This is the same token we saved during login
  const token = localStorage.getItem('token');

  // 4. The "Gatekeeper" Logic
  if (!token) {
    // If there is NO token, the user is not logged in.
    // We "replace" their navigation history with '/login'.
    // This means they can't click the "back" button to get
    // back to the protected page.
    return <Navigate to="/login" replace />;
  }

  // 5. If the token *does* exist, we're all good.
  // We simply render the 'children' that were passed in.
  // (This will be our <DashboardPage />)
  return children;
}