// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Importing the main App component
import './index.css'; // Optional, if you want to add some custom styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Render the App component */}
  </React.StrictMode>
);
