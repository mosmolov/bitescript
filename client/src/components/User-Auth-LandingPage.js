import React from 'react';
import { useHistory } from 'react-router-dom';

const LandingPage = () => {
  const history = useHistory();

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <div>
        <button onClick={() => history.push('/login')}>Log In</button>
        <button onClick={() => history.push('/create-account')}>Create Account</button>
      </div>
    </div>
  );
};

export default LandingPage;
