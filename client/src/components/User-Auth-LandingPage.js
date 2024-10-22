import React from 'react';
import { Navigate } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <div>
        <button><Navigate to="/login" replace={true}/></button>
        <button><Navigate to="/login" replace={true}/>Create Account</button>
      </div>
    </div>
  );
};

export default LandingPage;
