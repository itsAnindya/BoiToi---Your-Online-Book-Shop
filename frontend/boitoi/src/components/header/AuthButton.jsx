import React from 'react';

const AuthButton = ({ isAuthenticated, onLogin, onLogout }) => {
  return (
    <button
      onClick={isAuthenticated ? onLogout : onLogin}
      className="auth-button"
    >
      {isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
};

export default AuthButton;