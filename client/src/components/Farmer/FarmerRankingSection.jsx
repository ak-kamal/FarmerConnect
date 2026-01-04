import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, BarChart3, BadgeDollarSign, Trophy } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const RankingCard = ({ title, rank, value, total, icon: Icon }) => (
  <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
    <div className="card-body gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-emerald-300">
          {title}
        </p>
        <Icon className="w-5 h-5 text-emerald-300" />
      </div>

      <p className="text-2xl font-bold text-white">
        #{rank ?? "—"}
        <span className="text-sm text-gray-400 ml-1">
          / {total}
        </span>
      </p>

      <p className="text-xs text-gray-400">{value}</p>
    </div>
  </div>
);

const FarmerRankingSection = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      const res = await axios.get("/api/farmer/rankings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };

    fetchRanking();
  }, [token]);

  if (!data) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">
          Your farmer ranking
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RankingCard
          title="Quantity sold"
          rank={data.quantity.rank}
          total={data.totalFarmers}
          value={`${data.quantity.value} kg sold`}
          icon={Package}
        />

        <RankingCard
          title="Number of sales"
          rank={data.sales.rank}
          total={data.totalFarmers}
          value={`${data.sales.value} sales`}
          icon={BarChart3}
        />

        <RankingCard
          title="Total earnings"
          rank={data.earnings.rank}
          total={data.totalFarmers}
          value={`৳ ${data.earnings.value}`}
          icon={BadgeDollarSign}
        />
      </div>
    </div>
  );
};

export default FarmerRankingSection;
