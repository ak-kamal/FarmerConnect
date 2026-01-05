import React, { useState, useEffect } from "react";

import Home from "./pages/Home";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Loader2,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import PendingApproval from "./pages/PendingApproval.jsx";
import PaymentSuccess from "./components/Wholesaler/PaymentSuccess";
//import Signup from "./pages/Signup.jsx";



// =========================================================================
// 2. PAGE COMPONENTS (Consolidated from client/src/pages/*)
// =========================================================================

// --- 2A. Login Component (Aesthetic Improvements + Bug Fix) ---
const Login = () => {
  const { saveAuthData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Server returned an unreadable response. Check backend logs."
        );
      }

      if (!response.ok) {
        // pending approval case
        if (response.status === 403 && data?.code === "ADMIN_PENDING") {
          window.history.pushState({}, "", "/pending-approval");
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }
        throw new Error(data.message || "Login failed. Check server status.");
      }

      saveAuthData(data.token, {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        adminStatus: data.adminStatus,
      });
    } catch (err) {
      console.error("Login error:", err.message);
      setError(
        err.message || "An unexpected error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Leaf className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Farmer Connect
            </p>
            <p className="text-xs text-emerald-100/70">
              Smarter markets for every harvest
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="card bg-black/60 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div className="card-body space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">
                Welcome back
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Access your dashboard to manage harvests, offers, and trips.
              </p>
            </div>

            {error && (
              <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-gray-200"
                >
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <Mail className="w-4 h-4 text-emerald-300/80" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={onChange}
                    className="input input-bordered w-full pl-9 bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                    placeholder="farmer@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-gray-200"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <Lock className="w-4 h-4 text-emerald-300/80" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={onChange}
                    className="input input-bordered w-full pl-9 bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-block rounded-full bg-emerald-500 border-none text-black font-semibold mt-2 hover:bg-emerald-400 disabled:bg-emerald-700 disabled:text-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing you in…</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-2">
              New to Farmer Connect?{" "}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", "/signup");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="text-emerald-300 hover:text-emerald-200 font-medium"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

// Signup (with mandatory NID front/back upload + FormData submit)
const Signup = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [nidFrontFile, setNidFrontFile] = useState(null);
  const [nidBackFile, setNidBackFile] = useState(null);

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
    { value: "farmer", label: "Farmer" },
    { value: "wholesaler", label: "Wholesaler" },
    { value: "transport", label: "Transport Company" },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email) {
      setError("Please enter your full name and email address.");
      setLoading(false);
      return;
    }

    if (!role) {
      setError("Your intended role must be selected.");
      setLoading(false);
      return;
    }

    if (!nidFrontFile || !nidBackFile) {
      setError("NID front and back images are required.");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("role", role);
      form.append("nidFront", nidFrontFile);
      form.append("nidBack", nidBackFile);

      const response = await fetch("/api/users/signup", {
        method: "POST",
        body: form, // IMPORTANT: don't set Content-Type manually for FormData
      });

      // Robust parsing: avoids "unreadable response" masking real errors
      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(raw || "Server returned an unreadable response.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setSuccess(
        data.message ||
          "Registration successful! Check your email for the verification code."
      );

      if (typeof onSignupSuccess === "function") {
        onSignupSuccess(email);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Leaf className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Farmer Connect
            </p>
            <p className="text-xs text-emerald-100/70">
              Built for farmers, buyers & transport
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="card bg-black/60 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div className="card-body space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">
                Create your account
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Join the Farmer Connect network
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Set up your profile so you can upload produce, receive offers,
                or confirm trips.
              </p>
            </div>

            {error && (
              <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert bg-emerald-900/30 border-emerald-500/40 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Full name */}
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-medium text-gray-200">
                  Enter your full name (as appears on your NID)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <User className="w-4 h-4 text-emerald-300/80" />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={onChange}
                    className="input input-bordered w-full pl-9 bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                    placeholder="e.g., Rinto Ahmed"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-gray-200">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <Mail className="w-4 h-4 text-emerald-300/80" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={onChange}
                    className="input input-bordered w-full pl-9 bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Role selection */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-200">
                  Select your intended role
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {availableRoles.map((r) => (
                    <label
                      key={r.value}
                      className={`
                        cursor-pointer rounded-2xl border px-3 py-2 text-xs flex items-center gap-2
                        ${
                          role === r.value
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                            : "border-white/10 bg-black/40 text-gray-300 hover:border-emerald-300/70"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={onChange}
                        className="radio radio-xs radio-emerald"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* NID uploads */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-200">
                  NID Front (clear photo) <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setNidFrontFile(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered w-full bg-black/60 border-white/10"
                />
                {nidFrontFile && (
                  <p className="text-[11px] text-emerald-200/80">
                    Selected: {nidFrontFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-200">
                  NID Back (clear photo) <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setNidBackFile(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered w-full bg-black/60 border-white/10"
                />
                {nidBackFile && (
                  <p className="text-[11px] text-emerald-200/80">
                    Selected: {nidBackFile.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !!success}
                className="btn btn-block rounded-full bg-emerald-500 border-none text-black font-semibold mt-2 hover:bg-emerald-400 disabled:bg-emerald-700 disabled:text-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending verification code…</span>
                  </>
                ) : (
                  "Sign Up & Get Verification Code"
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-2">
              Already registered?{" "}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", "/login");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="text-emerald-300 hover:text-emerald-200 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};


// --- 2C. Verification Component ---
const Verification = ({ verificationEmail, onVerificationSuccess }) => {
  const initialEmail =
    verificationEmail || localStorage.getItem("verificationEmail") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const INITIAL_TIMER = 300; // 5 minutes
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) {
      setOtpExpired(true);
      return;
    }
    const id = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (otpExpired) {
      setError("Verification code has expired. Please click Resend OTP.");
      setLoading(false);
      return;
    }

    if (!email || otp.length !== 6) {
      setError(
        "Please enter a valid 6-digit code and make sure your email is correct."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an unreadable response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Verification failed. Please check the code."
        );
      }

      localStorage.setItem("verifiedEmail", email);
      localStorage.removeItem("verificationEmail");

      if (typeof onVerificationSuccess === "function") {
        onVerificationSuccess(email);
      }
    } catch (err) {
      console.error("Verification error:", err.message);
      setError(
        err.message ||
          "Verification failed. Please check the code or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);

    if (!email) {
      setError("Please enter your email to resend the code.");
      setResendLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/resend-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    });


      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an unreadable response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not resend code. Please wait a moment and try again."
        );
      }

      setTimer(INITIAL_TIMER);
      setOtpExpired(false);
      localStorage.setItem("verificationEmail", email);
      setError(null);
      alert(
        data.message || "A new OTP has been sent to your email address."
      );
    } catch (err) {
      console.error("Resend error:", err.message);
      setError(
        err.message || "Could not resend code. Please check your email."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Verify your email
            </p>
            <p className="text-xs text-emerald-100/70">
              We’ve sent a code to your inbox.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div className="card-body space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Enter the 6-digit code
              </h2>
              <div className="flex items-center gap-1 text-xs text-emerald-200">
                <Clock3 className="w-4 h-4" />
                <span>{formatTime(timer)}</span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Check <span className="font-mono text-emerald-200">{email}</span>{" "}
              for your verification code. Codes expire after 5 minutes.
            </p>

            {error && (
              <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="otp"
                  className="text-xs font-medium text-gray-200"
                >
                  6-digit code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="input input-bordered w-full text-center tracking-[0.5em] text-lg bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-block rounded-full bg-emerald-500 border-none text-black font-semibold hover:bg-emerald-400 disabled:bg-emerald-700 disabled:text-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying…</span>
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{otpExpired ? "Code expired." : "Didn’t receive the code?"}</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="btn btn-xs rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-100 hover:bg-emerald-500/40 disabled:opacity-60"
              >
                {resendLoading ? "Resending…" : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// --- 2D. Set Password Component ---
const SetPassword = ({ verifiedEmail, onPendingApproval }) => {
  const { saveAuthData } = useAuth();

  const email = verifiedEmail || localStorage.getItem("verifiedEmail") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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
      setError("Please enter and confirm your password.");
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

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an unreadable response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to set password. Please try again."
        );
      }

      // If server did NOT issue a token, user is pending admin approval
if (!data?.token) {
  if (typeof onPendingApproval === "function") onPendingApproval();
  else window.location.href = "/pending-approval";
  return;
}


      saveAuthData(data.token, {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        adminStatus: data.adminStatus,
      });

      localStorage.removeItem("verificationEmail");
      localStorage.removeItem("verifiedEmail");
    } catch (err) {
      console.error("Set password error:", err.message);
      setError(
        err.message ||
          "An unexpected error occurred while setting your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <KeyRound className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Create your password
            </p>
            <p className="text-xs text-emerald-100/70">
              This secures your Farmer Connect account.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div className="card-body space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Set a strong password
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                You’re setting a password for{" "}
                <span className="font-mono text-emerald-200">{email}</span>.
              </p>
            </div>

            {error && (
              <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-gray-200"
                >
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className="input input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-gray-200"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={onChange}
                  className="input input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                  placeholder="Re-type your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-block rounded-full bg-emerald-500 border-none text-black font-semibold mt-2 hover:bg-emerald-400 disabled:bg-emerald-700 disabled:text-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving & signing you in…</span>
                  </>
                ) : (
                  "Save password & continue"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

// =========================================================================
// 3. MAIN ROUTER LOGIC (Top Level App Component)
// =========================================================================

const Router = () => {
  const { user, token, isLoading } = useAuth();

  //const path = window.location.pathname;

  // Track current path in React state
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [authStage, setAuthStage] = useState({
    page: window.location.pathname.startsWith("/verify") ? "VERIFY" : "LOGIN",
    email:
      localStorage.getItem("verificationEmail") ||
      localStorage.getItem("verifiedEmail") ||
      "",
  });

  const handleSignupSuccess = (email) => {
    localStorage.setItem('verificationEmail', email);
    setAuthStage({ page: 'VERIFY', email });
    window.history.pushState({}, '', '/verify');
    setPath("/verify");
  };

  const handleVerificationSuccess = (email) => {
    localStorage.setItem('verifiedEmail', email);
    setAuthStage({ page: 'SET_PASSWORD', email });
    window.history.pushState({}, '', '/set-password');
    setPath("/set-password");
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-500">Loading Application...</h1>
      </div>
    );
  }

  // Public landing page for visitors
  if (!user && !token && path === "/") {
    return <Home />;
  }

  // --- Protected Routes ---
if (user && token) {
  // ✅ Stripe payment success page
  if (path === "/wholesaler/payment-success") {
    return <PaymentSuccess />;
  }
  // ✅ If not approved (and not an admin), always show PendingApproval
  if (user.role !== "admin" && user.adminStatus !== "approved") {
    if (path !== "/pending-approval") {
      window.history.pushState({}, "", "/pending-approval");
      setPath("/pending-approval");
    }
    return <PendingApproval />;
  }

  // ✅ Otherwise go to dashboard
  if (path !== "/") {
    window.history.pushState({}, "", "/");
    setPath("/");
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
      return (
  <SetPassword
    verifiedEmail={verifiedEmail}
    onPendingApproval={() => {
      localStorage.removeItem("verifiedEmail");
      localStorage.removeItem("verificationEmail");
      setAuthStage({ page: "LOGIN", email: "" });
      window.history.pushState({}, "", "/pending-approval");
      setPath("/pending-approval");
    }}
  />
);

  }
  
  // 2. Check if user needs Verification (is mid-signup)
  if (verificationEmail && (path === '/verify' || authStage.page === 'VERIFY')) {
      return <Verification 
          verificationEmail={verificationEmail} 
          onVerificationSuccess={handleVerificationSuccess} 
      />;
  }
  
  // 3. Pending Approval Page
  if (path === "/pending-approval") return <PendingApproval />;

  // 4. Default (Login or unknown path)
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