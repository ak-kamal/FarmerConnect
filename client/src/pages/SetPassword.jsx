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
    setError("Please enter and confirm your new password.");
    setLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    setLoading(false);
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long.");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/users/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Password setup failed.");
    }

    // Always clear OTP stage storage after successful set-password
    localStorage.removeItem("verificationEmail");
    localStorage.removeItem("verifiedEmail");

    // If token exists (admin), log in
    if (data.token) {
      saveAuthData(data.token, {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return;
    }

    // Non-admin: go to pending approval page
    window.history.pushState({}, "", "/pending-approval");
    window.dispatchEvent(new PopStateEvent("popstate"));
  } catch (err) {
    console.error("Set Password error:", err.message);
    setError(err.message || "An unexpected error occurred during password setup.");
  } finally {
    setLoading(false);
  }
};

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