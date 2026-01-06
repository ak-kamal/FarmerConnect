import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Loader2, BadgeDollarSign } from "lucide-react";

const WholesalerTransportPayments = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PAYABLE ORDERS
  ========================= */
  useEffect(() => {
    const fetchPayable = async () => {
      try {
        const res = await fetch("/api/wholesaler/transport-payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // ✅ Ensure array
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayable();
  }, [token]);

  /* =========================
     PAY TRANSPORT
  ========================= */
  const payNow = async (orderId) => {
    try {
      const res = await fetch(
        `/api/wholesaler/pay-transport/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Stripe redirect
      window.location.href = data.url;
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
          Loading transport payments…
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body">
          <p className="text-sm text-gray-300">
            No transport payments pending ✅
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
        <BadgeDollarSign className="w-5 h-5 text-emerald-300" />
        Transport payments
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {orders.map((o) => (
          <div
            key={o._id}
            className="card bg-black/70 border border-white/10"
          >
            <div className="card-body p-4 space-y-2">
              <p className="text-sm font-semibold text-white">
                Order ID: {o.orderCode}
              </p>

              <p className="text-xs text-gray-400">
                Transport fee: ৳{o.transportFee ?? "—"}
              </p>

              <p className="text-xs text-gray-500">
                Delivery status: {o.deliveryStatus}
              </p>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => payNow(o._id)}
                  className="btn btn-sm md:btn-md rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
                >
                  Proceed to payment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WholesalerTransportPayments;
