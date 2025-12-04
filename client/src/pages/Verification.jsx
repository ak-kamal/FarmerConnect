import React, { useState, useEffect } from 'react';

// This component assumes the email for verification is passed as a prop
const Verification = ({ verificationEmail, onVerificationSuccess }) => {
  // If email isn't passed (e.g., direct access), try to get it from local storage or ask user
  const initialEmail = verificationEmail || localStorage.getItem('verificationEmail') || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Timer State: 5 minutes = 300 seconds
  const INITIAL_TIMER = 300; 
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // --- Timer Logic ---
  useEffect(() => {
    if (timer > 0) {
      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount or re-render
    } else {
      // Timer hit zero, OTP is considered expired locally
      setOtpExpired(true);
    }
  }, [timer]);
  
  // Format the timer display (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- Verification Handler ---
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
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

  // --- Resend OTP Handler ---
  const handleResend = async () => {
    setResendLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Resend failed.');
      }
      
      // Resend success: Reset timer and unmark expired state
      setTimer(INITIAL_TIMER); 
      setOtpExpired(false);
      
      // Temporarily save email if not passed as prop
      localStorage.setItem('verificationEmail', email);

      setError(null);
      alert(data.message || 'A new OTP has been sent to your email.');

    } catch (err) {
      console.error('Resend error:', err.message);
      setError(err.message || 'Could not resend code. Please check your email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Verify Your Email
        </h2>
        
        <p className="text-center text-sm text-gray-600 mb-6">
            A 6-digit verification code has been sent to 
            <strong className="text-green-600 block">{email}</strong>.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
            
          {/* OTP Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Verification Code (6 Digits)
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="123456"
            />
          </div>
          
          {/* Timer Display */}
          <div className="text-center">
            {otpExpired ? (
                <p className="text-red-500 font-bold">Code Expired. Please Resend.</p>
            ) : (
                <p className="text-sm text-gray-700">
                    Time remaining: 
                    <strong className="text-blue-600 ml-1 font-mono">{formatTime(timer)}</strong>
                </p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Verification Button */}
          <div>
            <button
              type="submit"
              disabled={loading || otpExpired}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-200 ${
                loading || otpExpired
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>
        
        {/* Resend OTP Section */}
        <div className="mt-6 border-t pt-4 text-center">
            <button
                onClick={handleResend}
                disabled={resendLoading}
                className={`text-sm font-medium transition duration-200 ${
                    resendLoading || !otpExpired
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700'
                }`}
            >
                {resendLoading ? 'Sending New Code...' : 'Resend OTP'}
            </button>
            <p className="text-xs text-gray-500 mt-1">
                {otpExpired ? 'Click "Resend OTP" to generate a new code.' : 'The resend option will be available when the timer expires.'}
            </p>
        </div>
        
      </div>
    </div>
  );
};

export default Verification;