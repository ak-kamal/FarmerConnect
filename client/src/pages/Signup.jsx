import React, { useState } from "react";

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
      setError("Please fill in your name and email.");
      setLoading(false);
      return;
    }

    if (!role) {
      setError("Your intended role must be selected.");
      setLoading(false);
      return;
    }

    if (!nidFrontFile || !nidBackFile) {
      setError("Please upload clear photos of BOTH sides of your NID.");
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
        // IMPORTANT: do NOT set Content-Type manually for FormData
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(data.message);
      onSignupSuccess(email);
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Create Your Farmer Connect Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Verify your identity with NID photos. Admin approval is required before login.
        </p>

        {success && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {success} You are being redirected...
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Your Intended Role <span className="text-red-500">*</span>
            </label>

            <div className="flex justify-between space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {availableRoles.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition duration-150 flex-grow text-center text-sm font-medium hover:bg-white has-[:checked]:bg-green-100 has-[:checked]:text-green-800 border has-[:checked]:border-green-400"
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={onChange}
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your full name (as appears on your NID){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., Md. Abdur Rahman"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          {/* NID Uploads */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload NID Front (clear photo){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setNidFrontFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              />
              {nidFrontFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {nidFrontFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload NID Back (clear photo){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setNidBackFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              />
              {nidBackFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {nidBackFile.name}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="font-medium text-gray-700 mb-1">Tip for better approval:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure the text is readable</li>
                <li>Don’t crop the corners of the NID</li>
                <li>Avoid glare / reflections</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-200 ${
                loading || success
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {loading ? "Sending OTP..." : "Sign Up & Get Verification Code"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/login");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="font-medium text-green-600 hover:text-green-500 ml-1"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
