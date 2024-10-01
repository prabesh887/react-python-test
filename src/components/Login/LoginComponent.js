import React, { useState } from 'react';
import axios from 'axios';

function LoginComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [challengeUrl, setChallengeUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Updated API call with the new cURL configuration
      const response = await axios.post(
        'http://54.208.118.176:8000/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: 'cff33ff22fe23de23ed3242ed', // Example access token from the cURL command
          },
        }
      );

      if (response.data.status === 'challenge_required') {
        // If challenge is required, open the challenge URL in a small window
        setChallengeUrl(response.data.challenge_url);
        window.open(response.data.challenge_url, 'popup');
      } else {
        setSuccessMessage('Login successful!');
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error);
      // Handle error
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to retry login after the user has completed the challenge
  const handleChallengeResolved = async () => {
    try {
      const response = await axios.post(
        'http://54.208.118.176:8000/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: 'cff33ff22fe23de23ed3242ed', // Example access token from the cURL command
          },
        }
      );
      setSuccessMessage('Login successful after challenge!');
    } catch (error) {
      setErrorMessage('Login failed again after challenge. Please try again.');
    }
  };

  // Toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}{' '}
              {/* You can replace this with an icon */}
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {/* This button appears once the challenge is required */}
      {challengeUrl && (
        <div>
          <p>Please complete the challenge in the popup window.</p>
          <button onClick={handleChallengeResolved}>
            I have completed the challenge
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
