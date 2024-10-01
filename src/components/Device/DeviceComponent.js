import React, { useState } from 'react';

// DeviceEmulator Component
const DeviceEmulator = ({ apiEndpoint }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to open the device emulator
  const openDeviceEmulator = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulating the API response for device settings
      const device_settings = {
        height: 600,
        width: 400,
      };

      // Extract necessary device details
      const { width, height } = device_settings;

      // Get the screen dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;

      // Calculate the position to center the popup
      const left = (screenWidth - width) / 2;
      const top = (screenHeight - height) / 2;

      // Open a new browser window in the center of the screen
      const popupWindow = window.open(
        apiEndpoint,
        '_blank',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popupWindow) {
        throw new Error(
          'Failed to open the new window. Please disable your popup blocker.'
        );
      }

      popupWindow.document.title = `Instagram`;

      // Check periodically if the popup window is closed
      const popupCheckInterval = setInterval(() => {
        if (popupWindow.closed) {
          clearInterval(popupCheckInterval);
          console.log('Popup window closed');
          alert('The emulated device window was closed.');
        }
      }, 500); // Check every 500 milliseconds
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Device Emulator</h1>
      <p>Click the button to open a simulated device with a website loaded.</p>

      {/* Display loading spinner or button */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button
          onClick={openDeviceEmulator}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Open Device Emulator
        </button>
      )}

      {/* Display error message if something goes wrong */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeviceEmulator;
