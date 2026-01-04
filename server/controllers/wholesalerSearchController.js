import Produce from "../models/Produce.js";
import User from "../models/User.js";

// helper: role guard
const requireWholesaler = (req, res) => {
  if (!req.user || req.user.role !== "wholesaler") {
    res.status(403).json({ message: "Access denied. Wholesalers only." });
    return false;
  }
  return true;
};

// ✅ 1) Dropdown: unique produce names (case-insensitive) that are UP_FOR_SALE
export const getProduceNameOptions = async (req, res) => {
  if (!requireWholesaler(req, res)) return;

  try {
    const items = await Produce.aggregate([
      { $match: { status: "UP_FOR_SALE" } },
      {
        $group: {
          _id: "$produceNameNormalized",
          displayName: { $first: "$produceName" },
        },
      },
      { $sort: { displayName: 1 } },
    ]);

    return res.json({
      success: true,
      data: items.map((i) => ({
        value: i._id, // normalized value
        label: i.displayName, // nice display
      })),
    });
  } catch (err) {
    console.error("getProduceNameOptions error:", err);
    return res.status(500).json({ message: "Failed to load produce options." });
  }
};

// ✅ 2) Search: by produce normalized name
export const searchByProduceName = async (req, res) => {
  if (!requireWholesaler(req, res)) return;

  const name = String(req.query.name || "").trim().toLowerCase();
  if (!name) return res.status(400).json({ message: "Missing name query." });

  try {
    const results = await Produce.find({
      produceNameNormalized: name,
      status: "UP_FOR_SALE",
    })
      .sort({ createdAt: -1 })
      .populate("farmerId", "name farmerCode");

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("searchByProduceName error:", err);
    return res.status(500).json({ message: "Search failed." });
  }
};

// ✅ 3) Farmer suggestions (typeahead), case-insensitive, show name + farmerCode
export const farmerSuggestions = async (req, res) => {
  if (!requireWholesaler(req, res)) return;

  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ success: true, data: [] });

  try {
    const farmers = await User.find({
      role: "farmer",
      name: { $regex: q, $options: "i" }, // case-insensitive
    })
      .select("name farmerCode")
      .limit(10);

    return res.json({ success: true, data: farmers });
  } catch (err) {
    console.error("farmerSuggestions error:", err);
    return res.status(500).json({ message: "Failed to load suggestions." });
  }
};

// ✅ 4) Search: by farmerId → show farmer's UP_FOR_SALE produce
export const searchByFarmer = async (req, res) => {
  if (!requireWholesaler(req, res)) return;

  const farmerId = String(req.query.farmerId || "").trim();
  if (!farmerId) return res.status(400).json({ message: "Missing farmerId." });

  try {
    const results = await Produce.find({
      farmerId,
      status: "UP_FOR_SALE",
    })
      .sort({ createdAt: -1 })
      .populate("farmerId", "name farmerCode");

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("searchByFarmer error:", err);
    return res.status(500).json({ message: "Search failed." });
  }
};
