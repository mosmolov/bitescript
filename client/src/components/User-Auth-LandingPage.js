import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const history = useHistory();
  const navigate = useNavigate();


  return (
    <div>
      <h1>Welcome to Our App</h1>
      <div>
        <button onClick={() => navigate('/login')}>Log in</button>
        <button onClick={() => navigate('/create-account')}>Ceate Account</button>
      </div>
    </div>
  );
};

export default LandingPage;
