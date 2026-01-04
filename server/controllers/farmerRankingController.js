import User from "../models/User.js";

export const getMyFarmerRanking = async (req, res) => {
  if (!req.user || req.user.role !== "farmer") {
    return res.status(403).json({ message: "Farmer access only." });
  }

  // Fetch all farmers
  const farmers = await User.find({ role: "farmer" }).select(
    "_id farmerStats"
  );

  const totalFarmers = farmers.length;

  // Helper to calculate rank
  const calculateRank = (key) => {
    const sorted = [...farmers].sort(
      (a, b) =>
        (b.farmerStats?.[key] || 0) - (a.farmerStats?.[key] || 0)
    );

    const index = sorted.findIndex(
      (f) => String(f._id) === String(req.user._id)
    );

    return index === -1 ? null : index + 1;
  };

  const quantityRank = calculateRank("totalQuantitySold");
  const salesRank = calculateRank("totalSalesCount");
  const earningsRank = calculateRank("totalEarnings");

  const me = farmers.find(
    (f) => String(f._id) === String(req.user._id)
  );

  res.json({
    totalFarmers,
    quantity: {
      rank: quantityRank,
      value: me?.farmerStats?.totalQuantitySold || 0,
    },
    sales: {
      rank: salesRank,
      value: me?.farmerStats?.totalSalesCount || 0,
    },
    earnings: {
      rank: earningsRank,
      value: me?.farmerStats?.totalEarnings || 0,
    },
  });
};
