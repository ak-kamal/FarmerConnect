import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Changed import to rely on automatic resolution (no .jsx extension)
import App from './App'; // Import your main application component

// Find the root element defined in your public/index.html file
const rootElement = document.getElementById('root');

if (rootElement) {
  // Use ReactDOM.createRoot for modern React concurrent mode rendering
  ReactDOM.createRoot(rootElement).render(
    // StrictMode runs checks and warnings in development
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    console.error("Failed to find the root element in the HTML document ('root').");
}