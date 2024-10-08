import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for form submission logic

    if (!email || !password || !username || !firstname || !lastname) {
      setErrorMessage("All fields required for submission");
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, firstname, lastname, error }),
      });

      if (response.ok) {
        // If the account is created successfully, navigate to the landing page
        navigate('/');
      } else {
        // If the response indicates failure, handle the error
        const data = await response.json();
        setErrorMessage(data.message || 'Error creating account.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  //requires email, username, password, firstName, lastName 
  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Username:</label>
          <input 
            type="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>First Name:</label>
          <input 
            type="text" 
            value={firstname} 
            onChange={(e) => setFirstname(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input 
            type="text" 
            value={lastname} 
            onChange={(e) => setLastname(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Create Account</button>
        {/* Display the error message if it exists */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default CreateAccountPage;
