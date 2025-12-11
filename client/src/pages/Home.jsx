// client/src/pages/Home.jsx
import React from "react";
import {
  Leaf,
  Tractor,
  Store,
  ShieldCheck,
  BarChart3,
  PhoneCall,
  Star,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const handleNavigate = (path) => {
    // Simple SPA-style navigation using the existing history approach
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1510] via-[#050908] to-black text-gray-100">
      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="font-semibold text-lg tracking-tight">
                Farmer Connect
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                Smarter markets for every harvest
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate("/login")}
              className="btn btn-ghost btn-sm text-gray-200"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigate("/signup")}
              className="btn btn-sm rounded-full bg-emerald-500 hover:bg-emerald-400 border-none text-black font-semibold flex items-center gap-1"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16 grid md:grid-cols-2 gap-10 items-center">

        {/* Left content */}
        <div className="space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/5 text-xs uppercase tracking-[0.18em] text-emerald-300">
            Built for Farmers, Buyers & Transport
          </span>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Turn{" "}
            <span className="text-emerald-400">
              every harvest
            </span>{" "}
            into a fair, trusted deal.
          </h1>

          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Farmer Connect links farmers, wholesalers, and transport companies
            on a single platform. Upload produce, compare market prices, and
            confirm secure deliveries without middlemen and guesswork.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleNavigate("/signup")}
              className="btn rounded-full bg-emerald-500 hover:bg-emerald-400 border-none text-black font-semibold"
            >
              Join as Farmer
            </button>
            <button
              onClick={() => handleNavigate("/login")}
              className="btn btn-ghost rounded-full border border-white/10 text-gray-100"
            >
              I already have an account
            </button>
          </div>

          {/* Stats / Social proof */}
          <div className="flex flex-wrap gap-6 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-black bg-emerald-500/80"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">4.8/5</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Farmer satisfaction rating
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold">+1,200</p>
              <p className="text-[11px] text-gray-400">
                Successful village–city shipments (prototype data)
              </p>
            </div>
          </div>
        </div>

        {/* Right cards / Feature highlights */}
        <div className="space-y-4">
          {/* Big card */}
          <div className="card bg-base-200/10 border border-white/10 shadow-xl backdrop-blur">
            <div className="card-body gap-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold">
                    Today&apos;s Farm Overview
                  </span>
                </div>
                <span className="badge badge-ghost badge-sm">
                  Live demo
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
                  <p className="text-[11px] text-gray-400">Available stock</p>
                  <p className="text-lg font-semibold text-emerald-300">
                    2.4t
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    Vegetables &amp; grains
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
                  <p className="text-[11px] text-gray-400">Best offer</p>
                  <p className="text-lg font-semibold text-emerald-300">
                    +18%
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    Over local market
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
                  <p className="text-[11px] text-gray-400">Trips booked</p>
                  <p className="text-lg font-semibold text-emerald-300">
                    6
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    Trucks on the way
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-gray-400">
                <span>End-to-end visibility for every bag of produce.</span>
                <BarChart3 className="w-4 h-4 text-emerald-300" />
              </div>
            </div>
          </div>

          {/* Smaller cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-base-200/10 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-semibold">
                  Fair marketplace
                </span>
              </div>
              <p className="text-[12px] text-gray-300">
                Compare buyer offers transparently instead of relying on one
                middleman price.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/10 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-semibold">
                  Verified partners
                </span>
              </div>
              <p className="text-[12px] text-gray-300">
                OTP-verified accounts reduce fraud and build trust between
                farmers, buyers, and transport.
              </p>
            </div>
          </div>

          {/* Help / support strip */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 text-[12px]">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <div>
                <p className="font-medium text-gray-100">
                  Need help setting up?
                </p>
                <p className="text-[11px] text-gray-300">
                  Local co-op staff can assist farmers in creating accounts in
                  under 5 minutes.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate("/signup")}
              className="btn btn-xs rounded-full bg-emerald-500 border-none text-black hover:bg-emerald-400"
            >
              Get started
            </button>
          </div>
        </div>
      </section>

      {/* Simple Testimonials / Footer */}
      <section className="border-t border-white/5 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 grid md:grid-cols-3 gap-6 text-xs md:text-sm">
          <div>
            <p className="font-semibold mb-2 text-gray-100">
              &quot;I finally see who offers the best rate.&quot;
            </p>
            <p className="text-gray-400">
              A small vegetable farmer who uploads weekly harvests and receives
              offers from multiple town buyers.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2 text-gray-100">
              &quot;Planning transport is no longer a headache.&quot;
            </p>
            <p className="text-gray-400">
              Transport owners can see confirmed loads and routes instead of
              waiting at the market stand.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2 text-gray-100">
              &quot;We prototype this to serve rural networks.&quot;
            </p>
            <p className="text-gray-400">
              Farmer Connect is a student-built system focused on fair, digital
              access to markets and logistics.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
            <span>© {new Date().getFullYear()} Farmer Connect. Prototype for academic use.</span>
            <span>Made with care for fields, markets, and roads 🌾</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;