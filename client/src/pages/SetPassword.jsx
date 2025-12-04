import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Import the Auth Context hook

// This component assumes the verified email is passed as a prop
const SetPassword = ({ verifiedEmail }) => {
  const { saveAuthData } = useAuth();
  
  // Use the verified email for API context
  const email = verifiedEmail || localStorage.getItem('verifiedEmail') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Call the server endpoint to hash and set the password
      const response = await fetch('/api/users/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password setup failed.');
      }

      // Successful setup: This route returns the final JWT, so we log the user in
      saveAuthData(data.token, { 
        id: data._id, 
        name: data.name, 
        email: data.email, 
        role: data.role // Critical for RBAC dashboard
      });
      
      // Clear persistence items
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('verifiedEmail');
      
      // Redirection to the Dashboard is now implicit via the AuthContext state change
      
    } catch (err) {
      console.error('Set Password error:', err.message);
      setError(err.message || 'An unexpected error occurred during password setup.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
      return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 text-center">
              <div className="p-8 bg-white rounded-xl shadow-2xl">
                  <p className="text-xl text-red-500 font-bold">Error: Missing Verification Context</p>
                  <p className="mt-2 text-gray-600">Please return to the <a href="/signup" className="text-green-600 hover:underline">Sign Up</a> page to restart the verification process.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Final Step: Set Your Password
        </h2>
        
        <p className="text-center text-sm text-gray-600 mb-6">
            Your account (<strong className="text-green-600">{email}</strong>) is verified. Choose a secure password for future logins.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password (Min 8 Characters)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-200 ${
                loading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {loading ? 'Setting Password...' : 'Set Password & Go to Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;