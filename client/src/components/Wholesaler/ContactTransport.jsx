import React, { useEffect, useState } from "react";
import { Truck, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const BASE_RATE = 500;
const PER_HOP_RATE = 300;

const calculateFee = (from, to, via) => {
  let hops = 0;
  if (from !== via) hops++;
  if (via !== to) hops++;
  return BASE_RATE + hops * PER_HOP_RATE;
};

const ContactTransport = () => {
  const { token, user } = useAuth();

  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTransport, setSelectedTransport] = useState(null);
  const [orderCode, setOrderCode] = useState("");
  const [fee, setFee] = useState(null);

  /* =========================
     FETCH TRANSPORT COMPANIES
  ========================= */
  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const res = await fetch("/api/wholesaler/transports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load transports");
        }

        setTransports(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransports();
  }, [token]);

  /* =========================
     SUBMIT TRANSPORT REQUEST
  ========================= */
  const submitRequest = async () => {
    try {
      const res = await fetch("/api/transport/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderCode: orderCode.trim(),
          transportId: selectedTransport._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send transport request");
      }

      alert("✅ Transport request sent");

      setSelectedTransport(null);
      setOrderCode("");
      setFee(null);
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
          Loading transport companies…
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

  if (transports.length === 0) {
    return (
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body">
          <p className="text-sm text-gray-300">
            No transport companies available.
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
        Find transport
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {transports.map((t) => {
          const showForm = selectedTransport?._id === t._id;

          return (
            <div
              key={t._id}
              className="card bg-black/70 border border-white/10"
            >
              <div className="card-body p-4 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">
                    District: {t.location?.district || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">Email: {t.email}</p>
                  <p className="text-xs">
                    Rating:{" "}
                    <span className="text-emerald-300">
                      {t.ratingCount > 0
                        ? (t.ratingSum / t.ratingCount).toFixed(1) + " ★"
                        : "New"}
                    </span>
                  </p>
                </div>

                {!showForm && (
                  <div className="flex justify-end pt-3">
                    <button
                      className="btn btn-sm md:btn-md rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
                      onClick={() => {
                        setSelectedTransport(t);
                        setOrderCode("");
                        setFee(null);
                      }}
                    >
                      Approach for transport
                    </button>
                  </div>
                )}

                {showForm && (
                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <input
                      type="text"
                      placeholder="Enter Order ID (e.g. FC-ORD-2026-000123)"
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value)}
                      className="input input-bordered w-full bg-black/60 border-white/10"
                      onBlur={() => {
                        setFee(
                          calculateFee(
                            t.location?.district,
                            user?.district,
                            "FARMER_DISTRICT"
                          )
                        );
                      }}
                    />

                    {fee && (
                      <p className="text-xs text-emerald-300">
                        Estimated transport fee: ৳{fee}
                      </p>
                    )}

                    <div className="flex justify-end pt-3">
                      <button
                        disabled={!orderCode}
                        onClick={submitRequest}
                        className="btn btn-sm md:btn-md rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
                      >
                        Submit request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactTransport;
