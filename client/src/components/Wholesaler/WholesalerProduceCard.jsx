import React, { useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { Loader2 } from "lucide-react";

const USD_RATE = 122; // 1 USD = 122 BDT (hardcoded as agreed)

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const WholesalerProduceCard = ({ item }) => {
  const { token } = useAuth();

  const [buying, setBuying] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxQty = Number(item.quantity || 0);

  const totalBDT = useMemo(() => {
    const q = Number(quantity);
    if (!q || q <= 0) return 0;
    return q * Number(item.pricePerUnit);
  }, [quantity, item.pricePerUnit]);

  const totalUSD = useMemo(() => {
    return totalBDT > 0 ? (totalBDT / USD_RATE).toFixed(2) : "0.00";
  }, [totalBDT]);

  const handleProceed = async () => {
    if (!token) {
      setError("You must be logged in as a wholesaler.");
      return;
    }

    const q = Number(quantity);
    if (!q || q <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (q > maxQty) {
      setError("Quantity exceeds available stock.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "/api/orders/create-checkout",
        {
          produceId: item._id,
          quantity: q,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.url) {
        window.location.href = res.data.url; // Stripe redirect
      } else {
        throw new Error("Invalid checkout session response.");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      setError(
        e.response?.data?.message ||
          "Failed to start checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-black/70 border border-white/10">
      {item.images?.[0] && (
        <figure className="h-32 overflow-hidden rounded-t-2xl">
          <img
            src={item.images[0]}
            alt={item.produceName}
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      <div className="card-body p-3 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">
              {item.produceName}
            </h4>
            <p className="text-[11px] text-gray-400">
              {item.category} • {item.region}
            </p>
          </div>

          <span className="badge badge-sm bg-emerald-500/20 border border-emerald-400 text-[10px] text-emerald-200">
            Grade {item.qualityGrade}
          </span>
        </div>

        <p className="text-[11px] text-gray-300">
          {item.quantity} kg • {item.pricePerUnit} ৳/kg
        </p>

        <p className="text-[11px] text-gray-400 line-clamp-2">
          {item.description}
        </p>

        <p className="text-[11px] text-gray-500">
          Harvest:{" "}
          <span className="text-gray-300">
            {formatDate(item.harvestDate)}
          </span>
        </p>

        {item.farmerId && (
          <p className="text-[11px] text-gray-500">
            Farmer:{" "}
            <span className="text-gray-200">{item.farmerId.name}</span>{" "}
            <span className="text-emerald-200/80">
              ({item.farmerId.farmerCode || "NO-CODE"})
            </span>
          </p>
        )}

        {!buying ? (
          <div className="pt-2 flex justify-end">
            <button
              className="btn btn-sm bg-emerald-500 text-black hover:bg-emerald-400"
              onClick={() => {
                setBuying(true);
                setQuantity("");
                setError(null);
              }}
            >
              Approach to buy
            </button>
          </div>
        ) : (
          <div className="pt-2 space-y-2">
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={maxQty}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input input-sm input-bordered w-full bg-black/60 border-white/10 text-sm"
                placeholder={`Max ${maxQty} kg`}
              />
              <button
                type="button"
                onClick={() => setBuying(false)}
                className="btn btn-sm bg-black/40 border border-white/10 hover:bg-white/5"
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            <p className="text-[11px] text-gray-300">
              Total:{" "}
              <span className="text-emerald-200 font-semibold">
                ৳{totalBDT}
              </span>{" "}
              (~ ${totalUSD})
            </p>

            <button
              type="button"
              onClick={handleProceed}
              disabled={loading}
              className="btn btn-sm bg-emerald-500 text-black hover:bg-emerald-400 w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting…
                </>
              ) : (
                "Proceed to pay"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesalerProduceCard;
