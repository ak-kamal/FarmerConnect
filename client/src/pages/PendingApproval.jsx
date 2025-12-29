
import React from "react";
import { Leaf, Clock3, LogIn, Home } from "lucide-react";

const go = (to) => {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const PendingApproval = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Leaf className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">Farmer Connect</p>
            <p className="text-xs text-emerald-100/70">Verification workflow</p>
          </div>
        </div>

        {/* Card */}
        <div className="card bg-black/60 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div className="card-body space-y-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">
                  Admin verification pending
                </p>
                <h2 className="text-2xl font-bold text-white">
                  Kindly wait for approval
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  Your account has been created and your NID is under review. You’ll
                  receive an approval email once the admin verifies your details.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
              <p className="font-medium text-emerald-200 mb-1">What you can do now</p>
              <ul className="list-disc ml-5 space-y-1 text-gray-400">
                <li>Check your inbox/spam for the approval email</li>
                <li>Try logging in later after approval</li>
                <li>If rejected, follow the email instructions to sign up again</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => go("/")}
                className="btn rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/15"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>

              <button
                type="button"
                onClick={() => go("/login")}
                className="btn rounded-full bg-emerald-500 border-none text-black font-semibold hover:bg-emerald-400"
              >
                <LogIn className="w-4 h-4" />
                Go to Login
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              If you believe this is taking too long, contact your admin team.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PendingApproval;
