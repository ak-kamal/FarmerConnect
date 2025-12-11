import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Leaf,
  Tractor,
  Store,
  Truck,
  BarChart3,
  Package,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Users,
  LogOut,
} from "lucide-react";
import ProduceForm from "../components/Produce/ProduceForm.jsx";
import FarmerProduceList from "../components/Produce/FarmerProduceList.jsx";

// ---------- Role-specific sections ----------

const FarmerSection = ({ user }) => {
  const [produceRefreshKey, setProduceRefreshKey] = useState(0);

  const handleProduceUploaded = () => {
    setProduceRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Row of cards */}
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
        {/* FR-5 form in main area */}
        <div className="lg:col-span-2">
          <ProduceForm onUploaded={handleProduceUploaded} />
          <FarmerProduceList refreshKey={produceRefreshKey} />
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

// ---------- Main Dashboard wrapper ----------

const Dashboard = () => {
  const { user, logout } = useAuth();
  const role = user?.role || "farmer";

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

  const renderSection = () => {
    switch (role) {
      case "farmer":
        return <FarmerSection />;
      case "wholesaler":
        return <WholesalerSection />;
      case "transport":
        return <TransportSection />;
      case "admin":
        return <AdminSection />;
      default:
        return <FarmerSection />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02130b] via-[#020a07] to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
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

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <p className="font-medium text-gray-100">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-gray-400">{user?.email}</p>
            </div>
            <span className="badge badge-outline border-emerald-400/70 text-emerald-200 text-[11px]">
              {getRoleLabel()}
            </span>
            <button
              type="button"
              onClick={logout}
              className="btn btn-xs rounded-full bg-emerald-500 border-none text-black hover:bg-emerald-400 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good to see you,{" "}
            <span className="text-emerald-300">
              {user?.name?.split(" ")[0] || "farmer"}
            </span>
            .
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            Prototype dashboard
          </p>
        </div>

        {renderSection()}
      </section>
    </main>
  );
};

export default Dashboard;
