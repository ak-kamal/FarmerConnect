import React, { useEffect, useState } from "react";
import { Users, Star, ArrowDownUp, Mail, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const WholesalerTopFarmers = () => {
  const { token } = useAuth();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("sales"); // "sales" | "rating"

  useEffect(() => {
    fetchTopFarmers();
  }, [sortBy]);

  const fetchTopFarmers = async () => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(
      `/api/wholesaler/top-farmers?sort=${sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const raw = await res.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("Server returned invalid JSON");
    }

    if (!res.ok) {
      throw new Error(data.message || "Failed to load farmers");
    }

    setFarmers(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const sortedFarmers = [...farmers].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.stats?.rating || 0) - (a.stats?.rating || 0);
    }
    return (b.stats?.totalSales || 0) - (a.stats?.totalSales || 0);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-300" />
            Top Farmers
          </h2>
          <p className="text-xs text-gray-400">
            Ranked farmers based on performance & trust
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-emerald-300" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-sm bg-black/60 border border-emerald-400/30 text-gray-200"
          >
            <option value="sales">Sort by Total Sales</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="card bg-black/60 border border-white/10">
          <div className="card-body text-sm text-gray-300">
            Loading top farmers…
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && sortedFarmers.length === 0 && (
        <div className="card bg-black/60 border border-white/10">
          <div className="card-body text-sm text-gray-400">
            No farmer data available yet.
          </div>
        </div>
      )}

      {/* Farmer list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedFarmers.map((f) => (
          <div
            key={f._id}
            className="card bg-black/60 border border-emerald-500/20 shadow-lg"
          >
            <div className="card-body gap-3">
              {/* Name */}
              <div>
                <p className="text-sm font-semibold text-white">
                  {f.name}
                </p>
                <p className="text-xs text-emerald-300">
                  {f.farmerCode || "NO-CODE"}
                </p>
              </div>

              {/* Info */}
              <div className="space-y-1 text-xs text-gray-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-emerald-300" />
                  {f.email}
                </p>

                {f.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-emerald-300" />
                    {f.location}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-gray-400">
                  Total sales:{" "}
                  <span className="text-emerald-200 font-semibold">
                    {f.stats?.totalSales || 0}
                  </span>
                </span>

                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {f.rating > 0 ? f.rating.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WholesalerTopFarmers;
