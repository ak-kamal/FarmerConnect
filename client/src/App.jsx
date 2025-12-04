import React, { createContext, useContext, useState, useEffect } from 'react';

// =========================================================================
// 1. AUTH CONTEXT AND HOOK (Consolidated from client/src/context/AuthContext.jsx)
// =========================================================================

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuthData = (token, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call the server endpoint 
      await fetch('/api/users/logout', { 
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
        console.error("Logout API call failed, proceeding with local cleanup:", error);
    }

    // Critical cleanup steps
    localStorage.removeItem('userToken'); 
    localStorage.removeItem('user'); 
    setToken(null);
    setUser(null);
    
    // Force redirect to login page
    window.location.replace('/login'); 
  };
  
  useEffect(() => {
    if (token || user) {
        setIsLoading(false);
    } else {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsLoading(false);
    }
  }, []); 

  const contextValue = {
    token,
    user,
    isLoading,
    saveAuthData,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


// =========================================================================
// 2. PAGE COMPONENTS (Consolidated from client/src/pages/*)
// =========================================================================

// --- 2A. Login Component (Aesthetic Improvements + Bug Fix) ---
const Login = () => {
  const { saveAuthData } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
      });
      
      // FIX FOR JSON ERROR: Read text first to catch server crashes
      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          // If the server crashes and sends non-JSON data (the root cause of the error)
          throw new Error('Server returned an unreadable response. Check Node console for backend crash.');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Check server status.');
      }

      saveAuthData(data.token, { 
        id: data._id, 
        name: data.name, 
        email: data.email, 
        role: data.role
      });
      
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Aesthetics: Brighter background for contrast (using a light green gradient)
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-sans"> 
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100 transform transition duration-300 hover:shadow-2xl">
        
        <div className="flex justify-center mb-6">
            <span className="text-5xl text-green-700">🌱</span> 
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Sign In to Farmer Connect
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              value={email} 
              onChange={onChange} 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition duration-150 text-base" 
              placeholder="you@example.com" 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              value={password} 
              onChange={onChange} 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition duration-150 text-base" 
              placeholder="••••••••" 
            />
          </div>

          {error && (<div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-xl">{error}</div>)}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-lg font-bold text-white transition duration-200 shadow-lg ${
                loading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? 
            <a href="/signup" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/signup'); window.location.reload(); }} className="font-bold text-green-600 hover:text-green-800 ml-1 transition duration-150">
              Sign Up
            </a>
          </p>
          <p className="text-center text-sm">
            <a href="/forgot-password" onClick={(e) => { e.preventDefault(); /* Implement forgot password logic */ }} className="font-medium text-blue-600 hover:text-blue-800 transition duration-150">
              Forgot Password?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};


// --- 2B. Signup Component (Aesthetic Improvements) ---
const Signup = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '', 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const { name, email, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };
  
  const availableRoles = [
      { value: 'farmer', label: 'Farmer' },
      { value: 'wholesaler', label: 'Wholesaler' },
      { value: 'transport', label: 'Transport Company' },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email) {
      setError('Please fill in your name and email.');
      setLoading(false);
      return;
    }
    
    if (!role) {
      setError('Your intended role must be selected.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/signup', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ name, email, role }),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error('Server returned an unreadable response. Check Node console for backend crash.');
        }
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setSuccess(data.message);
      
      setTimeout(() => onSignupSuccess(email), 1000); 

    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Aesthetics: Brighter background for contrast and better centering
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-gray-200 transform transition duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Create Your Farmer Connect Account
        </h2>
        
        {success && (
            <div className="p-3 mb-4 text-base text-green-700 bg-green-100 rounded-xl font-medium border border-green-300">
              {success} You are being redirected...
            </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Role Selection Field (Improved Spacing and Font) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              Select Your Intended Role <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {availableRoles.map((r) => (
                <label key={r.value} className="flex items-center justify-center space-x-2 cursor-pointer p-3 rounded-xl transition duration-150 flex-grow text-base font-bold text-gray-600 hover:bg-gray-100 has-[:checked]:bg-green-100 has-[:checked]:text-green-800 border-2 has-[:checked]:border-green-600 shadow-md">
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={onChange}
                    required
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-400 rounded"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* End Role Selection */}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input id="name" name="name" type="text" required value={name} onChange={onChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner placeholder-gray-400 focus:ring-green-500 focus:border-green-500 text-base" placeholder="John Doe" />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input id="email" name="email" type="email" required value={email} onChange={onChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner placeholder-gray-400 focus:ring-green-500 focus:border-green-500 text-base" placeholder="you@example.com" />
          </div>

          {error && (<div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-xl">{error}</div>)}

          <div className="pt-4">
            <button type="submit" disabled={loading || success} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-lg font-bold text-white transition duration-200 shadow-lg ${loading || success ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}>
              {loading ? 'Sending OTP...' : 'Sign Up & Get Verification Code'}
            </button>
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? 
            <a href="/login" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/login'); window.location.reload(); }} className="font-bold text-green-600 hover:text-green-800 ml-1">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

// --- 2C. Verification Component ---
const Verification = ({ verificationEmail, onVerificationSuccess }) => {
  const initialEmail = verificationEmail || localStorage.getItem('verificationEmail') || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const INITIAL_TIMER = 300; // 5 minutes = 300 seconds
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Timer Logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setOtpExpired(true);
    }
  }, [timer]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Verification Handler
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (otpExpired) {
      setError('Verification code has expired. Please click Resend OTP.');
      setLoading(false);
      return;
    }
    
    if (!email || otp.length !== 6) {
      setError('Please enter a valid 6-digit code and ensure your email is correct.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/verify', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ email, otp }),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) { throw new Error('Server returned an unreadable response.'); }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      // Successful verification: Proceed to set password step
      onVerificationSuccess(email); 

    } catch (err) {
      console.error('Verification error:', err.message);
      setError(err.message || 'An unexpected error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResend = async () => {
    setResendLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) { throw new Error('Server returned an unreadable response.'); }
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Resend failed.');
      }
      
      // Resend success: Reset timer and unmark expired state
      setTimer(INITIAL_TIMER); 
      setOtpExpired(false);
      localStorage.setItem('verificationEmail', email);

      setError(null);
      // NOTE: Using a custom message instead of alert()
      alert(data.message || 'A new OTP has been sent to your email.');

    } catch (err) {
      console.error('Resend error:', err.message);
      setError(err.message || 'Could not resend code. Please check your email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    // IMPROVEMENT: Brighter background and clean layout
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Verify Your Email
        </h2>
        
        <p className="text-center text-md text-gray-700 mb-6">
            We sent a 6-digit code to 
            <strong className="text-green-600 block">{email}</strong>.
            Please enter it below to proceed to password setup.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Verification Code</label>
            <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner placeholder-gray-400 text-center text-2xl font-mono tracking-widest focus:ring-green-500 focus:border-green-500" placeholder="••••••" />
          </div>
          
          <div className="text-center py-2">
            {otpExpired ? (
                <p className="text-lg text-red-600 font-bold">Code Expired.</p>
            ) : (
                <p className="text-md text-gray-700">
                    Expires in: 
                    <strong className="text-blue-600 ml-1 font-mono text-lg">{formatTime(timer)}</strong>
                </p>
            )}
          </div>

          {error && (<div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>)}

          <div>
            <button type="submit" disabled={loading || otpExpired} className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-lg font-semibold text-white transition duration-200 shadow-md ${loading || otpExpired ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}>
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 border-t pt-4 text-center">
            <button onClick={handleResend} disabled={resendLoading || !otpExpired} className={`text-sm font-medium transition duration-200 ${resendLoading || !otpExpired ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700 font-semibold'}`}>
                {resendLoading ? 'Sending New Code...' : 'Resend OTP'}
            </button>
            <p className="text-xs text-gray-500 mt-1">
                A new code can be requested once the current one expires.
            </p>
        </div>
        
      </div>
    </div>
  );
};

// --- 2D. Set Password Component ---
const SetPassword = ({ verifiedEmail }) => {
  const { saveAuthData } = useAuth();
  
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
      const response = await fetch('/api/users/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) { throw new Error('Server returned an unreadable response.'); }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Password setup failed.');
      }

      saveAuthData(data.token, { 
        id: data._id, 
        name: data.name, 
        email: data.email, 
        role: data.role
      });
      
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('verifiedEmail');
      
    } catch (err) {
      console.error('Set Password error:', err.message);
      setError(err.message || 'An unexpected error occurred during password setup.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
      return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 text-center">
              <div className="p-8 bg-white rounded-xl shadow-2xl">
                  <p className="text-xl text-red-500 font-bold">Error: Missing Verification Context</p>
                  <p className="mt-2 text-gray-600">Please return to the <a href="/signup" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/signup'); window.location.reload(); }} className="text-green-600 hover:underline">Sign Up</a> page to restart the verification process.</p>
              </div>
          </div>
      );
  }

  return (
    // IMPROVEMENT: Brighter background and clean layout
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Final Step: Set Your Password
        </h2>
        
        <p className="text-center text-md text-gray-700 mb-6">
            Your account (<strong className="text-green-600">{email}</strong>) is verified. Choose a secure password for future logins.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (Min 8 Characters)</label>
            <input id="password" name="password" type="password" required value={password} onChange={onChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner placeholder-gray-400 focus:ring-green-500 focus:border-green-500" placeholder="••••••••" />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={onChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner placeholder-gray-400 focus:ring-green-500 focus:border-green-500" placeholder="••••••••" />
          </div>

          {error && (<div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>)}

          <div className="pt-4">
            <button type="submit" disabled={loading} className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-lg font-semibold text-white transition duration-200 shadow-md ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}>
              {loading ? 'Setting Password...' : 'Set Password & Go to Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- 2E. Dashboard Components (From Developer 2's FR-2/FR-3 work) ---

const FarmerDashboard = () => {
  return (
    <div className="p-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Farmer Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome, Farmer! This is where you will manage your produce (FR-5), view orders, and check payment status.</p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-green-500">
        <h2 className="text-xl font-semibold text-green-600">Produce Management (FR-5 Link)</h2>
        <p className="text-gray-500">This section will contain the Produce Upload Form and your current inventory list.</p>
      </div>
    </div>
  );
};

const WholesalerDashboard = () => {
  return (
    <div className="p-6 bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Wholesaler Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome, Wholesaler! This dashboard focuses on viewing available produce, placing bulk orders, and tracking logistics.</p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-blue-500">
        <h2 className="text-xl font-semibold text-blue-600">Marketplace Access</h2>
        <p className="text-gray-500">You can browse and filter all produce uploads from registered farmers here.</p>
      </div>
    </div>
  );
};

const TransportDashboard = () => {
  return (
    <div className="p-6 bg-yellow-50">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Transport Company Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome, Transport Company! Your interface is for managing assigned deliveries and confirming successful logistics completion.</p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-600">Delivery Management</h2>
        <p className="text-gray-500">View pickup locations, drop-off points, and shipment manifests.</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome, Admin! You have centralized control over users, disputes, and system settings.</p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-600">User Management</h2>
        <p className="text-gray-500">Ability to modify user roles and approve new registrations.</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoading, logout } = useAuth();
  let ActiveDashboard = null;

  if (isLoading || !user || !user.role) {
    // Should be handled by the router outside, but good defensive coding
    return null; 
  }

  // Determine which dashboard to show
  switch (user.role.toLowerCase()) {
    case 'farmer':
      ActiveDashboard = FarmerDashboard;
      break;
    case 'wholesaler':
      ActiveDashboard = WholesalerDashboard;
      break;
    case 'transport':
      ActiveDashboard = TransportDashboard;
      break;
    case 'admin':
      ActiveDashboard = AdminDashboard;
      break;
    default:
      return (
        <div className="p-6 min-h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600">Your role ({user.role}) is not recognized by the system.</p>
        </div>
      );
  }
  
  // Render the header (with logout) and the active dashboard component
  return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="text-xl font-semibold text-gray-800">
                Farmer Connect - {user.role.toUpperCase()} View
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm hidden sm:inline">
                    Logged in as: <strong className="font-medium">{user.name || user.email}</strong>
                </span>
                <button
                    onClick={logout}
                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-150 shadow-lg"
                    aria-label="Logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </header>

        <main className="p-4">
            <ActiveDashboard />
        </main>
    </div>
  );
};


// =========================================================================
// 3. MAIN ROUTER LOGIC (Top Level App Component)
// =========================================================================

const Router = () => {
  const { user, isLoading } = useAuth();
  
  const [authStage, setAuthStage] = useState({
    page: window.location.pathname.startsWith('/verify') ? 'VERIFY' : 'LOGIN',
    email: localStorage.getItem('verificationEmail') || localStorage.getItem('verifiedEmail') || '',
  });

  const path = window.location.pathname;

  const handleSignupSuccess = (email) => {
    localStorage.setItem('verificationEmail', email);
    setAuthStage({ page: 'VERIFY', email });
    window.history.pushState({}, '', '/verify');
  };

  const handleVerificationSuccess = (email) => {
    localStorage.setItem('verifiedEmail', email);
    setAuthStage({ page: 'SET_PASSWORD', email });
    window.history.pushState({}, '', '/set-password');
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-500">Loading Application...</h1>
      </div>
    );
  }

  // --- Protected Routes ---
  if (user && user.token) {
    if (path !== '/') {
         // Redirect any old auth paths to the dashboard once logged in
         window.history.pushState({}, '', '/');
    }
    return <Dashboard />;
  }

  // --- Public Routes (FR-1 Workflow) ---
  
  // Handle Sign Up
  if (path === '/signup') {
    return <Signup onSignupSuccess={handleSignupSuccess} />;
  }

  // Handle the multi-step flow when not logged in
  const verifiedEmail = authStage.email || localStorage.getItem('verifiedEmail');
  const verificationEmail = authStage.email || localStorage.getItem('verificationEmail');
  
  // 1. Check if user needs to Set Password (is verified)
  if (verifiedEmail && (path === '/set-password' || authStage.page === 'SET_PASSWORD')) {
      return <SetPassword verifiedEmail={verifiedEmail} />;
  }
  
  // 2. Check if user needs Verification (is mid-signup)
  if (verificationEmail && (path === '/verify' || authStage.page === 'VERIFY')) {
      return <Verification 
          verificationEmail={verificationEmail} 
          onVerificationSuccess={handleVerificationSuccess} 
      />;
  }

  // 3. Default (Login or unknown path)
  if (path === '/' || path === '/login') {
    return <Login />;
  }
  
  // Fallback for any other unauthorized path
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-600">The requested page does not exist or you are not authorized to view it.</p>
        <a href="/login" className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">Go to Login</a>
      </div>
    </div>
  );
};

// --- 4. Main Export ---
const App = () => {
    return (
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
};

export default App;