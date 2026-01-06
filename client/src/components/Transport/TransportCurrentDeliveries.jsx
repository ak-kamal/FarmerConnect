import React, { useEffect, useState } from "react";
import { Package, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const TransportCurrentDeliveries = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transport/current-deliveries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/transport/update-delivery/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  if (loading) return <p className="text-gray-300">Loading…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-lg font-semibold text-white">
        Current deliveries
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((o) => (
          <div key={o._id} className="card bg-black/70 border border-white/10">
            <div className="card-body space-y-2 text-sm">
              <p><b>Order ID:</b> {o.orderCode}</p>

              <p><b>Farmer:</b> {o.farmerId.name} ({o.farmerId.district})</p>
              <p><b>Wholesaler:</b> {o.wholesalerId.name} ({o.wholesalerId.district})</p>

              <p className="text-emerald-300">
                Status: {o.deliveryStatus}
              </p>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  className="btn btn-xs rounded-full bg-amber-500 text-black"
                  onClick={() => updateStatus(o._id, "ON_THE_WAY")}
                >
                  On the way
                </button>

                <button
                  className="btn btn-xs rounded-full bg-emerald-500 text-black"
                  onClick={() => updateStatus(o._id, "REACHED")}
                >
                  Reached
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportCurrentDeliveries;
