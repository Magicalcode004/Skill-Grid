import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('user');

  if (!token || !userString || userString === 'undefined') {
    return <Navigate to="/login" replace />;
  }

  // allowedRoles is given theck the role
  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const user = JSON.parse(userString);
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
      }
    } catch (err) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;