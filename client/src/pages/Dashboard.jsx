import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Leaf,
  Tractor,
  Store,
  Truck,
  BarChart3,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Users,
  LogOut,
  Loader2,
  Bell,
  Menu,
  ChevronDown,
  User as UserIcon,
  Pencil,
  Package,
  Search,
  BadgeDollarSign,
  ClipboardCheck,
  MessageSquareWarning,
} from "lucide-react";

import ProduceForm from "../components/Produce/ProduceForm.jsx";
import FarmerProduceList from "../components/Produce/FarmerProduceList.jsx";

// ------------------------------------------------------------
// Small helper: close dropdown when clicking outside
// ------------------------------------------------------------
const useOutsideClose = (isOpen, onClose) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    };

    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return ref;
};

// ------------------------------------------------------------
// Role-specific "middle" sections (your existing content)
// ------------------------------------------------------------
const FarmerSection = ({ activeView }) => {
  const [produceRefreshKey, setProduceRefreshKey] = useState(0);

  const handleProduceUploaded = () => {
    setProduceRefreshKey((prev) => prev + 1);
  };

  const showUpload = activeView === "FARMER_UPLOAD";
  const showList = activeView === "FARMER_LIST";

  return (
    <div className="space-y-6">
      {/* Row of cards (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
                Harvest summary
              </p>
              <Tractor className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-2xl font-bold text-emerald-200">2.4 t</p>
            <p className="text-xs text-gray-400">
              Vegetables & grains ready to list this week.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
                Best offer
              </p>
              <BarChart3 className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-2xl font-bold text-emerald-200">+18%</p>
            <p className="text-xs text-gray-400">
              Better than local market in last confirmed deal.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
                Trips booked
              </p>
              <Truck className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-2xl font-bold text-emerald-200">6</p>
            <p className="text-xs text-gray-400">
              Confirmed transport trips carrying your produce.
            </p>
          </div>
        </div>
      </div>

      {/* Actions / upcoming section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main area */}
        <div className="lg:col-span-2">
          {/* ONLY show these when selected from dropdown */}
          {showUpload && (
            <>
              <ProduceForm onUploaded={handleProduceUploaded} />
              <FarmerProduceList refreshKey={produceRefreshKey} />
            </>
          )}

          {showList && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Your uploaded produce
              </h2>
              <FarmerProduceList refreshKey={produceRefreshKey} />
            </div>
          )}

          {/* Overview (default) shows nothing extra here (keeps dashboard clean) */}
        </div>

        <div className="card bg-emerald-900/40 border border-emerald-500/40">
          <div className="card-body gap-3">
            <h3 className="text-sm font-semibold text-emerald-100 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Region overview
            </h3>
            <p className="text-xs text-emerald-50/80">
              See which buyers are active for your district and which transport
              companies are available on your main routes.
            </p>
            <p className="text-[11px] text-emerald-200/80">
              Later this can show real offers & demand per region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WholesalerSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
                Active listings
              </p>
              <Store className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-2xl font-bold text-emerald-200">34</p>
            <p className="text-xs text-gray-400">
              Farmer lots currently visible to your account.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Confirmed purchases
            </p>
            <p className="text-2xl font-bold text-emerald-200">12</p>
            <p className="text-xs text-gray-400">
              Deals completed this month through Farmer Connect.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Quality alerts
            </p>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-200">2 lots flagged</span>
            </div>
            <p className="text-xs text-gray-400">
              Items marked with issues during past inspections.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card bg-black/60 border border-white/10">
          <div className="card-body gap-3">
            <h3 className="text-sm font-semibold text-emerald-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Buying pipeline
            </h3>
            <p className="text-xs text-gray-300">
              Track which farmer offers you have viewed, pending negotiations,
              and confirmed purchases. This will later link to detailed order
              views and invoices.
            </p>
          </div>
        </div>

        <div className="card bg-emerald-900/40 border border-emerald-500/40">
          <div className="card-body gap-3">
            <h3 className="text-sm font-semibold text-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Trusted sources
            </h3>
            <p className="text-xs text-emerald-50/80">
              See which farmers are verified and how often they delivered on
              time and in the expected quality grade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransportSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Trips today
            </p>
            <p className="text-2xl font-bold text-emerald-200">4</p>
            <p className="text-xs text-gray-400">
              Confirmed routes picking up from different farms.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Capacity in use
            </p>
            <p className="text-2xl font-bold text-emerald-200">72%</p>
            <p className="text-xs text-gray-400">
              Of available truck volume booked for today.
            </p>
          </div>
        </div>

        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Pending pickups
            </p>
            <p className="text-2xl font-bold text-emerald-200">3</p>
            <p className="text-xs text-gray-400">
              Farms waiting to be assigned to a truck.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card bg-black/60 border border-white/10">
          <div className="card-body gap-3">
            <h3 className="text-sm font-semibold text-emerald-200 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Route planning
            </h3>
            <p className="text-xs text-gray-300">
              Plan efficient routes that minimize empty returns and match farmer
              harvest times with buyer delivery windows. Later this will show a
              list of concrete trips from the database.
            </p>
          </div>
        </div>

        <div className="card bg-emerald-900/40 border border-emerald-500/40">
          <div className="card-body gap-3">
            <h3 className="text-sm font-semibold text-emerald-100 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Partner network
            </h3>
            <p className="text-xs text-emerald-50/80">
              Keep track of which farmers and buyers you frequently serve and
              where your vehicles move most often.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin section placeholder (middle content will swap)
const AdminSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Farmers
            </p>
            <p className="text-2xl font-bold text-emerald-200">120</p>
            <p className="text-xs text-gray-400">Active farmer accounts.</p>
          </div>
        </div>
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Wholesalers
            </p>
            <p className="text-2xl font-bold text-emerald-200">32</p>
            <p className="text-xs text-gray-400">Verified wholesale buyers.</p>
          </div>
        </div>
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Transporters
            </p>
            <p className="text-2xl font-bold text-emerald-200">18</p>
            <p className="text-xs text-gray-400">
              Registered transport companies.
            </p>
          </div>
        </div>
        <div className="card bg-black/60 border border-emerald-500/30 shadow-lg">
          <div className="card-body gap-3">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
              Issues reported
            </p>
            <p className="text-2xl font-bold text-amber-300">5</p>
            <p className="text-xs text-gray-400">
              Accounts flagged for manual review.
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-black/60 border border-white/10">
        <div className="card-body gap-3">
          <h3 className="text-sm font-semibold text-emerald-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Platform health
          </h3>
          <p className="text-xs text-gray-300">
            As an admin you can oversee sign-ups, verification status, and role
            assignments. This section will later connect directly to your user
            management tables and system logs.
          </p>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// NEW: placeholder panels for middle-content swapping
// ------------------------------------------------------------
const PlaceholderPanel = ({ title, icon: Icon, desc }) => (
  <div className="card bg-black/60 border border-white/10">
    <div className="card-body gap-3">
      <h3 className="text-sm font-semibold text-emerald-200 flex items-center gap-2">
        {Icon ? <Icon className="w-4 h-4" /> : null}
        {title}
      </h3>
      <p className="text-xs text-gray-300">{desc}</p>
    </div>
  </div>
);

// ------------------------------------------------------------
// Main Dashboard wrapper (with shared UI shell + dropdowns)
// ------------------------------------------------------------
const Dashboard = () => {
  const { user, logout } = useAuth();
  const role = user?.role || "farmer";

  // IMPORTANT: set correct defaults (Farmer should NOT start at upload)
  const defaultView = useMemo(() => {
    if (role === "admin") return "ADMIN_VERIFY_USERS";
    if (role === "farmer") return "FARMER_OVERVIEW";
    return "ROLE_HOME";
  }, [role]);

  const [activeView, setActiveView] = useState(defaultView);

  useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);

  // dropdown open states
  const [leftOpen, setLeftOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const leftRef = useOutsideClose(leftOpen, () => setLeftOpen(false));
  const profileRef = useOutsideClose(profileOpen, () => setProfileOpen(false));

  const getRoleLabel = () => {
    switch (role) {
      case "farmer":
        return "Farmer";
      case "wholesaler":
        return "Wholesaler";
      case "transport":
        return "Transport Company";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  // Small icon wrapper for admin "verify users" menu item
  function ShieldAdminIcon(props) {
    return <ClipboardCheck {...props} />;
  }

  // Build left services menu based on role
  const services = useMemo(() => {
    if (role === "farmer") {
      return [
        { id: "FARMER_OVERVIEW", label: "Dashboard overview", icon: BarChart3 },
        { id: "FARMER_UPLOAD", label: "Upload new produce", icon: Package },
        { id: "FARMER_LIST", label: "View uploaded produce", icon: ClipboardCheck },
        { id: "FARMER_MARKET", label: "Market price (soon)", icon: BadgeDollarSign },
      ];
    }

    if (role === "wholesaler") {
      return [
        { id: "ROLE_HOME", label: "Dashboard overview", icon: BarChart3 },
        { id: "WHOLE_SEARCH", label: "Search produce (soon)", icon: Search },
        { id: "WHOLE_TOP", label: "Top farmers (soon)", icon: Users },
        { id: "WHOLE_PAY", label: "Payments (soon)", icon: BadgeDollarSign },
        { id: "WHOLE_TRANSPORT", label: "Find transport (soon)", icon: Truck },
      ];
    }

    if (role === "transport") {
      return [
        { id: "ROLE_HOME", label: "Dashboard overview", icon: BarChart3 },
        { id: "TRANS_ORDERS", label: "Orders awaiting delivery (soon)", icon: Truck },
        { id: "TRANS_ROUTES", label: "Route planning (soon)", icon: MapPin },
      ];
    }

    if (role === "admin") {
      return [
        { id: "ADMIN_VERIFY_USERS", label: "Verify users", icon: ShieldAdminIcon },
        { id: "ADMIN_COMPLAINTS", label: "View complaints (soon)", icon: MessageSquareWarning },
      ];
    }

    return [{ id: "ROLE_HOME", label: "Dashboard", icon: BarChart3 }];
  }, [role]);

  const openView = (viewId) => {
    setActiveView(viewId);
    setLeftOpen(false);
  };

  // Middle content switching logic
  const renderMiddle = () => {
    if (role === "farmer") {
      if (activeView === "FARMER_MARKET") {
        return (
          <PlaceholderPanel
            title="Market price"
            icon={BadgeDollarSign}
            desc="Later we’ll connect this to a real data source so farmers can check live market prices by crop/region."
          />
        );
      }

      // Overview / Upload / List are handled inside FarmerSection now
      return <FarmerSection activeView={activeView} />;
    }

    if (role === "wholesaler") {
      return <WholesalerSection />;
    }

    if (role === "transport") {
      return <TransportSection />;
    }

    if (role === "admin") {
      if (activeView === "ADMIN_VERIFY_USERS") return <AdminVerifyUsersPanel />;
      if (activeView === "ADMIN_COMPLAINTS") {
        return (
          <PlaceholderPanel
            title="Complaints"
            icon={MessageSquareWarning}
            desc="Placeholder. Later we’ll add complaints reporting and admin review tools."
          />
        );
      }
      return <AdminSection />;
    }

    return <FarmerSection activeView={activeView} />;
  };

  const firstName = user?.name?.split(" ")?.[0] || "User";
  const profileUrl = user?.profileImageUrl || "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left: menu + brand */}
          <div className="flex items-center gap-3">
            {/* Hamburger + dropdown panel */}
            <div className="relative" ref={leftRef}>
              <button
                type="button"
                onClick={() => setLeftOpen((v) => !v)}
                className="btn btn-sm rounded-full bg-black/50 border border-white/10 hover:border-emerald-400/60"
                title="Menu"
              >
                <Menu className="w-4 h-4 text-emerald-200" />
              </button>

              {leftOpen && (
                // ✅ OPAQUE dropdown (no transparency mess)
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-emerald-500/30 bg-black shadow-2xl p-2 overflow-hidden">
                  <div className="px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                      Services
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Available for {getRoleLabel()} role
                    </p>
                  </div>

                  <div className="divider my-1 opacity-30" />

                  <div className="space-y-1 px-1">
                    {services.map((s) => {
                      const Icon = s.icon;
                      const isActive = activeView === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => openView(s.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition
                            ${
                              isActive
                                ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-100"
                                : "hover:bg-white/5 border border-transparent text-gray-200"
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 text-emerald-300" />
                          <span className="flex-1 text-left">{s.label}</span>
                          <ChevronDown className="w-4 h-4 opacity-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-md shadow-emerald-500/40">
                <Leaf className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-200">
                  Farmer Connect
                </p>
                <p className="text-[11px] text-emerald-100/70">
                  {getRoleLabel()} dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-2">
            {/* Notifications (0 for now) */}
            <button
              type="button"
              className="btn btn-sm rounded-full bg-black/50 border border-white/10 hover:border-emerald-400/60 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-emerald-200" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="btn btn-sm rounded-full bg-black/50 border border-white/10 hover:border-emerald-400/60 flex items-center gap-2"
                title="Profile"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  {profileUrl ? (
                    <img
                      src={profileUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-emerald-200/90" />
                  )}
                </div>
                <span className="hidden sm:block text-xs text-gray-200">
                  {firstName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                // ✅ OPAQUE dropdown (no transparency mess)
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-emerald-500/30 bg-black shadow-2xl p-2  overflow-hidden">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-gray-100">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[11px] text-gray-400">{user?.email}</p>
                    <span className="mt-2 inline-flex badge badge-outline border-emerald-400/70 text-emerald-200 text-[11px]">
                      {getRoleLabel()}
                    </span>
                  </div>

                  <div className="divider my-1 opacity-30" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Edit Profile page will be added next.");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-white/5"
                  >
                    <Pencil className="w-4 h-4 text-emerald-300" />
                    Edit profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-white/5"
                  >
                    <LogOut className="w-4 h-4 text-emerald-300" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good to see you,{" "}
            <span className="text-emerald-300">{firstName}</span>.
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            Prototype dashboard
          </p>
        </div>

        {renderMiddle()}
      </section>
    </main>
  );
};

const AdminVerifyUsersPanel = () => {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rejectingId, setRejectingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pending-users", {
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

      if (!res.ok) throw new Error(data.message || "Failed to load users.");

      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/approve/${id}`, {
        method: "POST",
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

      if (!res.ok) throw new Error(data.message || "Approve failed.");

      await fetchPending();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async (id) => {
    if (!feedback || feedback.trim().length < 5) {
      alert("Please provide at least 5 characters feedback.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback }),
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(raw || "Unreadable response from server.");
      }

      if (!res.ok) throw new Error(data.message || "Reject failed.");

      setRejectingId(null);
      setFeedback("");
      await fetchPending();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Users awaiting verification
          </h2>
          <p className="text-xs text-gray-400">
            Verify NID images and approve/reject access.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPending}
          className="btn btn-sm rounded-full bg-emerald-500 border-none text-black hover:bg-emerald-400"
          disabled={loading || actionLoading}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="card bg-black/60 border border-white/10">
          <div className="card-body">
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading pending users…
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="card bg-black/60 border border-white/10">
          <div className="card-body">
            <p className="text-sm text-gray-300">
              No pending users right now ✅
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((u) => (
            <div
              key={u._id}
              className="card bg-black/60 border border-emerald-500/20 shadow-lg"
            >
              <div className="card-body gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                    <span className="mt-2 inline-flex badge badge-outline border-emerald-400/70 text-emerald-200 text-[11px]">
                      {u.role}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-xs rounded-full bg-emerald-500 border-none text-black hover:bg-emerald-400"
                      onClick={() => approve(u._id)}
                      disabled={actionLoading}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-xs rounded-full bg-amber-500 border-none text-black hover:bg-amber-400"
                      onClick={() => {
                        setRejectingId(u._id);
                        setFeedback("");
                      }}
                      disabled={actionLoading}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* NID images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs text-gray-300">NID Front</p>
                    </div>
                    {u.nidFrontUrl ? (
                      <img
                        src={u.nidFrontUrl}
                        alt="NID Front"
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs text-gray-300">NID Back</p>
                    </div>
                    {u.nidBackUrl ? (
                      <img
                        src={u.nidBackUrl}
                        alt="NID Back"
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                {/* Reject feedback panel */}
                {rejectingId === u._id && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-2">
                    <p className="text-xs text-amber-100">
                      Provide rejection feedback (required)
                    </p>
                    <textarea
                      className="textarea textarea-bordered w-full bg-black/60 border-white/10 focus:border-amber-400 focus:outline-none text-sm"
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="e.g., NID is blurry / mismatch with name / missing back side..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-xs rounded-full bg-black/40 border border-white/10 hover:bg-white/5"
                        onClick={() => {
                          setRejectingId(null);
                          setFeedback("");
                        }}
                        disabled={actionLoading}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-xs rounded-full bg-amber-500 border-none text-black hover:bg-amber-400"
                        onClick={() => reject(u._id)}
                        disabled={actionLoading}
                      >
                        Confirm reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
