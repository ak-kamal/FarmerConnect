import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2
} from "lucide-react";

const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);

  const datePart = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
};

const statusLabel = (s) => {
  if (s === "SOLD") return "Sold";
  if (s === "UNAVAILABLE") return "Unavailable";
  return "Up for sale";
};

const FarmerProduceList = ({ refreshKey, onEdit, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const { token } = useAuth();
  //const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produce, setProduce] = useState([]);
  const [error, setError] = useState(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteProduce = async (id) => {
  if (!token) return;

  try {
    setDeleteLoading(true);
    await axios.delete(`/api/farmer/produce/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setConfirmDeleteId(null);
    // refresh list immediately
    await fetchProduce();
  } catch (err) {
    console.error("Delete produce error:", err);
    alert(
      err.response?.data?.message ||
        "Failed to delete produce. Please try again."
    );
  } finally {
    setDeleteLoading(false);
  }
};

  const fetchProduce = async () => {
    if (!token) {
      setError("You must be logged in to view your produce.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/farmer/produce", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduce(res.data?.data || []);
    } catch (err) {
      console.error("Fetch produce error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load your produce list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // When expanded OR refreshKey changes, refetch
  useEffect(() => {
    if (expanded) {
      fetchProduce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, refreshKey]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="mt-4">
      {!defaultExpanded && (
  <button
    type="button"
    onClick={toggleExpanded}
    className="btn btn-sm md:btn-md rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-100 hover:bg-emerald-500/40 flex items-center gap-2"
  >
    {expanded ? (
      <>
        <ChevronUp className="w-4 h-4" />
        <span>Hide my uploaded produce</span>
      </>
    ) : (
      <>
        <ChevronDown className="w-4 h-4" />
        <span>Show my uploaded produce</span>
      </>
    )}
  </button>
)}


      {expanded && (
        <div className="mt-4 card bg-black/60 border border-white/10 shadow-lg">
          <div className="card-body space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-200">
                  My recent uploads
                </h3>
                <p className="text-[11px] text-gray-400">
                  These are the lots you’ve added from this farmer account.
                </p>
              </div>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading your produce…</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && produce.length === 0 && (
              <p className="text-xs text-gray-400">
                You haven’t uploaded any produce yet. Once you add a harvest
                using the form above, it will appear here.
              </p>
            )}

            {!loading && !error && produce.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {produce.map((item) => (
                  <div
                    key={item._id}
                    className="card bg-black/70 border border-white/10"
                  >
                    {item.images && item.images[0] && (
                      <figure className="h-32 overflow-hidden rounded-t-2xl">
                        <img
                          src={item.images[0]}
                          alt={item.produceName}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    )}

                    {/* CARD BODY */}
                    <div className="card-body p-3 space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.produceName}
                        </h4>

                        <div className="flex items-center gap-2">
                          <span className="badge badge-sm bg-emerald-500/20 border border-emerald-400 text-[10px] text-emerald-200">
                            Grade {item.qualityGrade}
                          </span>

                          <span
                            className={`badge badge-sm text-[10px]
                              ${
                                item.status === "SOLD"
                                  ? "bg-red-500/15 border border-red-400 text-red-200"
                                  : item.status === "UNAVAILABLE"
                                  ? "bg-amber-500/15 border border-amber-400 text-amber-200"
                                  : "bg-emerald-500/15 border border-emerald-400 text-emerald-200"
                              }`}
                          >
                            {statusLabel(item.status)}
                          </span>

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => onEdit?.(item)}
                            className="btn btn-xs rounded-full bg-black/40 border border-white/10 hover:bg-white/5"
                            title="Edit produce"
                          >
                            <Pencil className="w-3 h-3 text-emerald-200" />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item._id)}
                            className="btn btn-xs rounded-full bg-black/40 border border-white/10 hover:bg-red-500/15"
                            title="Delete produce"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400">
                        {item.category} • {item.region}
                      </p>

                      <p className="text-[11px] text-gray-300">
                        {item.quantity} kg • {item.pricePerUnit} ৳/kg
                      </p>

                      <p className="text-[11px] text-gray-400 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[11px] text-gray-500">
                          Harvest:{" "}
                          <span className="text-gray-300">
                            {formatDateTime(item.harvestDate)}
                          </span>
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Uploaded:{" "}
                          <span className="text-gray-300">
                            {formatDateTime(item.createdAt)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* CONFIRM DELETE BOX */}
                    {confirmDeleteId === item._id && (
                      <div className="mx-3 mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 space-y-2">
                        <p className="text-xs text-red-100">
                          Are you sure you want to permanently delete this produce?
                        </p>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn btn-xs rounded-full bg-black/40 border border-white/10 hover:bg-white/5"
                            disabled={deleteLoading}
                          >
                            No
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduce(item._id)}
                            className="btn btn-xs rounded-full bg-red-500 border-none text-black hover:bg-red-400"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting…" : "Yes"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProduceList;
