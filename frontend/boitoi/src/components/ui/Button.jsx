import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center transition-colors group space-x-2';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-white',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-transparent',
    neutral: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500 border border-neutral-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
    link: 'text-primary-600 hover:text-primary-700 focus:ring-primary-500 underline-offset-4 hover:underline bg-transparent hover:bg-primary-50',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
    // Auth page specific variants
    authPrimary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md transition-all duration-300',
    authSecondary: 'bg-white-10 text-primary-600 hover:bg-white-20 focus:ring-primary-500 border border-primary-600 transition-all duration-300',
    authToggle: 'bg-primary-50 text-primary-600 hover:bg-primary-700 hover:text-white focus:ring-primary-500 border focus:border-primary-200 transition-all duration-300',
    authToggleActive: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 focus:bg-primary-500 shadow-md transition-all duration-300'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export const BackToHomeButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`mb-6 flex items-center ${className}`}>
      <Button
        onClick={() => {
          if (onClick) onClick();
          navigate('/');
        }}
        variant="ghost"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Button>
    </div>
  );
};

export const BackToAdminButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`mb-6 flex items-center ${className}`}>
      <Button
        onClick={() => {
          if (onClick) onClick();
          navigate('/admin');
        }}
        variant="ghost"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Admin Panel</span>
      </Button>
    </div>
  );
};

export const BackToAuthorsButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`mb-6 flex items-center ${className}`}>
      <Button
        onClick={() => {
          if (onClick) onClick();
          navigate('/authors');
        }}
        variant="ghost"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Authors</span>
      </Button>
    </div>
  );
};


export default Button;