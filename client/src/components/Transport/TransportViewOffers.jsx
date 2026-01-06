import React, { useEffect, useState } from "react";
import { Truck, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const TransportViewOffers = () => {
  const { token } = useAuth();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/transport/offers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok) {
        throw new Error(data.message || "Failed to load offers");
      }

      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptOffer = async (id) => {
    try {
      const res = await fetch(`/api/transport/accept/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to accept offer");
      }

      alert("✅ Offer accepted");
      fetchOffers(); // refresh list (accepted one disappears)
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return (
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body flex items-center gap-2 text-gray-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading transport offers…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body">
          <p className="text-sm text-gray-300">
            No transport requests available.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN VIEW
  ========================= */
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <Truck className="w-5 h-5 text-emerald-300" />
        Transport offers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {offers.map((o) => (
          <div
            key={o._id}
            className="card bg-black/70 border border-white/10"
          >
            <div className="card-body p-4 space-y-2">
              <div>
                <p className="text-sm font-semibold text-white">
                  Order ID:{" "}
                  <span className="font-mono text-emerald-300">
                    {o.orderCode}
                  </span>
                </p>

                <p className="text-xs text-gray-400">
                  Farmer district: {o.farmerDistrict}
                </p>

                <p className="text-xs text-gray-400">
                  Wholesaler district: {o.wholesalerDistrict}
                </p>

                <p className="text-xs text-gray-400">
                  Estimated fee:{" "}
                  <span className="text-emerald-300 font-semibold">
                    ৳{o.estimatedFeeBDT}
                  </span>
                </p>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => acceptOffer(o._id)}
                  className="btn btn-sm md:btn-md rounded-full bg-emerald-500 text-black hover:bg-emerald-400 flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportViewOffers;
