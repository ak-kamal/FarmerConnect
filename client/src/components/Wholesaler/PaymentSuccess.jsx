import React from "react";
import { CheckCircle2 } from "lucide-react";

const PaymentSuccess = () => {
  const goTo = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="card bg-black/60 border border-emerald-500/30 shadow-xl max-w-md w-full">
        <div className="card-body text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />

          <h2 className="text-lg font-semibold text-white">
            Payment completed successfully
          </h2>

          <p className="text-sm text-gray-400">
            Your payment was received.
            <br />
            The farmer has been notified and your order is now confirmed.
          </p>

          <div className="pt-2 flex justify-center gap-2">
            <button
              className="btn btn-sm rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
              onClick={() => goTo("/")}
            >
              Back to dashboard
            </button>

            <button
              className="btn btn-sm rounded-full bg-black/40 border border-white/10 hover:bg-white/5"
              onClick={() => goTo("/?view=WHOLE_SEARCH")}
            >
              Search more produce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
