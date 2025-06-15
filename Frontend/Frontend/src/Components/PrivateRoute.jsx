import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

//   if (adminOnly && !isAdmin) {
//     return <Navigate to="/" replace />;
//   }

  return children;
};

export default PrivateRoute;
