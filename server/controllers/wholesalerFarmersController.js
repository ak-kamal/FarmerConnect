import User from "../models/User.js";

export const getTopFarmers = async (req, res) => {
  try {
    const sortType = req.query.sort || "sales";

    const sortStage =
      sortType === "rating"
        ? { rating: -1 }
        : { "stats.totalSales": -1 };

    const farmers = await User.aggregate([
      {
        $match: {
          role: "farmer",
          adminStatus: "approved",
        },
      },

      {
        $lookup: {
          from: "farmerstats",
          localField: "_id",
          foreignField: "farmerId",
          as: "stats",
        },
      },

      {
        $unwind: {
          path: "$stats",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ compute rating safely
      {
        $addFields: {
          rating: {
            $cond: [
              { $gt: ["$stats.ratingCount", 0] },
              { $divide: ["$stats.ratingSum", "$stats.ratingCount"] },
              0,
            ],
          },
          "stats.totalSales": { $ifNull: ["$stats.totalSales", 0] },
        },
      },

      {
        $sort: sortStage,
      },

      {
        $limit: 20,
      },

      {
        $project: {
          name: 1,
          email: 1,
          location: 1,
          farmerCode: 1,
          rating: 1,
          stats: {
            totalSales: 1,
          },
        },
      },
    ]);

    res.status(200).json(farmers);
  } catch (error) {
    console.error("❌ Top farmers error:", error);
    res.status(500).json({ message: "Failed to load top farmers" });
  }
};
