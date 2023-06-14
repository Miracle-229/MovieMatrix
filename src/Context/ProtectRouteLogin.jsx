import React from 'react';
import { UserAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectRouteLogin({ children }) {
  const { user } = UserAuth();
  if (user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default ProtectRouteLogin;