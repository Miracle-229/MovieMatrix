import React from 'react';
import { UserAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectRouteAccount({ children }) {
  const user = localStorage.getItem('accessToken');
  if (!user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default ProtectRouteAccount;
