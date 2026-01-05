import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import WholesalerProduceCard from "./WholesalerProduceCard.jsx";
import {
  Search,
  User,
  Leaf,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const WholesalerSearchProduce = () => {
  const { token } = useAuth();

  const [searchBy, setSearchBy] = useState("produce"); // "produce" | "farmer"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Produce-name search state
  const [produceOptions, setProduceOptions] = useState([]);
  const [selectedProduce, setSelectedProduce] = useState("");

  // Farmer search state
  const [farmerQuery, setFarmerQuery] = useState("");
  const [farmerSuggestions, setFarmerSuggestions] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Results
  const [results, setResults] = useState([]);

  // Load produce dropdown options when in produce mode
  useEffect(() => {
    const loadOptions = async () => {
      if (!token) return;
      try {
        setError(null);
        const res = await axios.get("/api/wholesaler/produce-options", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduceOptions(res.data?.data || []);
      } catch (e) {
        console.error("produce-options error:", e);
        setError(e.response?.data?.message || "Failed to load produce options.");
      }
    };

    if (searchBy === "produce") {
      loadOptions();
    }
  }, [searchBy, token]);

  // Farmer suggestions while typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!token) return;
      const q = farmerQuery.trim();
      if (searchBy !== "farmer" || q.length < 1) {
        setFarmerSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`/api/wholesaler/search/farmers?q=${encodeURIComponent(q)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmerSuggestions(res.data?.data || []);
      } catch (e) {
        console.error("farmer suggestions error:", e);
        // don’t hard error UI on suggestions
        setFarmerSuggestions([]);
      }
    };

    const t = setTimeout(fetchSuggestions, 200); // small debounce
    return () => clearTimeout(t);
  }, [farmerQuery, searchBy, token]);

  const doSearch = async () => {
    if (!token) {
      setError("You must be logged in as a wholesaler.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      if (searchBy === "produce") {
        if (!selectedProduce) {
          setError("Please select a produce item.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `/api/wholesaler/search/produce?name=${encodeURIComponent(selectedProduce)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data?.data || []);
        return;
      }

      // farmer search
      if (!selectedFarmer?._id) {
        setError("Please select a farmer from suggestions.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `/api/wholesaler/search/farmer-produce?farmerId=${encodeURIComponent(selectedFarmer._id)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data?.data || []);
    } catch (e) {
      console.error("search error:", e);
      setError(e.response?.data?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const headerIcon = useMemo(() => (searchBy === "produce" ? Leaf : User), [searchBy]);
  const HeaderIcon = headerIcon;

  return (
    <div className="space-y-4">
      <div className="card bg-black/60 border border-emerald-500/20">
        <div className="card-body gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300 mb-1">
                Search produce
              </p>
              <h2 className="text-lg font-semibold text-white">
                Find farmers & harvest lots
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Search by produce item or by farmer name. Only items marked <span className="text-emerald-200">Up for sale</span> are shown.
              </p>
            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 items-center justify-center">
              <HeaderIcon className="w-5 h-5 text-emerald-200" />
            </div>
          </div>

          {error && (
            <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Search by */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">Search by</label>
              <select
                value={searchBy}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchBy(v);
                  setResults([]);
                  setError(null);

                  // reset mode-specific state
                  setSelectedProduce("");
                  setFarmerQuery("");
                  setSelectedFarmer(null);
                  setFarmerSuggestions([]);
                }}
                className="select select-sm md:select-md select-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none text-sm"
              >
                <option value="produce">Produce item</option>
                <option value="farmer">Farmer name</option>
              </select>
            </div>

            {/* Produce item mode */}
            {searchBy === "produce" && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-200">Produce item</label>
                <select
                  value={selectedProduce}
                  onChange={(e) => setSelectedProduce(e.target.value)}
                  className="select select-sm md:select-md select-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none text-sm"
                >
                  <option value="">Select a produce</option>
                  {produceOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500">
                  Names are treated case-insensitively (Tomato/tomato = same).
                </p>
              </div>
            )}

            {/* Farmer name mode */}
            {searchBy === "farmer" && (
              <div className="space-y-1 md:col-span-2 relative">
                <label className="text-xs font-medium text-gray-200">Farmer name</label>
                <input
                  value={farmerQuery}
                  onChange={(e) => {
                    setFarmerQuery(e.target.value);
                    setSelectedFarmer(null);
                  }}
                  className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none text-sm"
                  placeholder="Type farmer name..."
                />

                {/* suggestions dropdown */}
                {farmerSuggestions.length > 0 && !selectedFarmer && (
                  <div className="absolute z-20 mt-2 w-full rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden">
                    {farmerSuggestions.map((f) => (
                      <button
                        key={f._id}
                        type="button"
                        onClick={() => {
                          setSelectedFarmer(f);
                          setFarmerQuery(`${f.name} (${f.farmerCode || "NO-CODE"})`);
                          setFarmerSuggestions([]);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center justify-between"
                      >
                        <span className="text-gray-100">{f.name}</span>
                        <span className="text-[11px] text-emerald-200/80">
                          {f.farmerCode || "NO-CODE"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedFarmer && (
                  <p className="text-[11px] text-emerald-200/80 flex items-center gap-2">
                    Selected: <span className="text-gray-100">{selectedFarmer.name}</span>
                    <span className="badge badge-outline border-emerald-400/60 text-emerald-200 text-[11px]">
                      {selectedFarmer.farmerCode || "NO-CODE"}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={doSearch}
              disabled={loading}
              className="btn btn-sm md:btn-md rounded-full bg-emerald-500 border-none text-black font-semibold hover:bg-emerald-400 disabled:bg-emerald-700 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setResults([]);
                setError(null);
                setSelectedProduce("");
                setFarmerQuery("");
                setSelectedFarmer(null);
                setFarmerSuggestions([]);
              }}
              className="btn btn-sm md:btn-md rounded-full bg-black/40 border border-white/10 hover:bg-white/5"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card bg-black/60 border border-white/10">
        <div className="card-body space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-200">Results</h3>
            <span className="text-[11px] text-gray-400">
              {results.length} item(s)
            </span>
          </div>

          {results.length === 0 ? (
            <p className="text-xs text-gray-400">
              No results yet. Run a search to see available produce.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((item) => (
  <WholesalerProduceCard key={item._id} item={item} />
))}


                    
                  </div>
              )}
            </div>
        </div>
      </div>
  );
};

export default WholesalerSearchProduce;