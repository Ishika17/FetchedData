import React, { useState } from 'react';
import { Cookies } from 'react-cookie'; // Make sure to import Cookies from react-cookie
import './loginPage.css';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = (event) => {
    event.preventDefault();
    const cookies = new Cookies();
 
    // Make the login request to the API
    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email, // Using dynamic email
        password: password, // Using dynamic password
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          });
        }
        return response.json(); // Parse the response data
      })
      .then((data) => {
        console.log('Login successful:', data);
        
        // Set the access token in cookies
        cookies.set('accessToken', data.accessToken);

        // Call the users API after successful login
        fetch(`https://dummyjson.com/users/${data.id}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((usersData) => {
            console.log('Users data:', usersData);
           localStorage.setItem('firstName' , usersData.firstName);
           localStorage.setItem('role' , usersData.role);
           navigate ("/list");
           
          })
          .catch((error) => {
            console.error('Failed to fetch users:', error.message);
          });

        // Show a pop-up message for successful login
        alert('Login successful!'); // Pop-up message
      })
      .catch((error) => {
        setErrorMessage('Login failed. Please try again.');
        console.error('Login failed:', error.message);
      });
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email</label>
          <input
            // type="email" // Ensure email format
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit">Login</button>
      </form>

      <p>
        Forgot password? <a href="/reset-password">Click here</a>
      </p>
    </div>
  );
};

export default LoginPage;
