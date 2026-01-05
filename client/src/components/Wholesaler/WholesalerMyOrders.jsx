import React, { useEffect, useState } from "react";
import { Package, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const WholesalerMyOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wholesaler/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(raw || "Unreadable response from server.");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return (
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body flex items-center gap-2 text-gray-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading your orders…
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

  if (orders.length === 0) {
    return (
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body">
          <p className="text-sm text-gray-300">
            You haven’t completed any orders yet.
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
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-300" />
          My orders
        </h2>
        <p className="text-xs text-gray-400">
          Showing all paid orders awaiting delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div
  key={order._id}
  className="card bg-black/60 border border-emerald-500/20 shadow-lg"
>
  <div className="card-body gap-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-white">
          {order.produceId?.name || "Produce"}
        </p>
        <p className="text-xs text-gray-400">
          Farmer: {order.produceId?.farmerId?.name || "Unknown"}
        </p>
      </div>

      <span className="badge badge-outline border-amber-400 text-amber-300 text-[11px]">
        {order.deliveryStatus === "AWAITING_DELIVERY"
          ? "Awaiting delivery"
          : order.deliveryStatus}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
      <p>
        <span className="text-gray-400">Quantity:</span>{" "}
        {order.quantityOrdered} kg
      </p>

      <p>
        <span className="text-gray-400">Amount:</span>{" "}
        ৳{order.totalBDT}
      </p>

      <p>
        <span className="text-gray-400">Payment:</span>{" "}
        {order.status}
      </p>

      <p>
        <span className="text-gray-400">Order date:</span>{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
</div>

        ))}
      </div>
    </div>
  );
};

export default WholesalerMyOrders;
