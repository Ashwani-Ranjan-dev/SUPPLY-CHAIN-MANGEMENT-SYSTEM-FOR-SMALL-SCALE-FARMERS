import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Menu,
  X,
  ArrowRight,
  ShoppingBasket,
  TrendingUp,
  Handshake,
  Sprout,
} from "lucide-react";

const farmerImage =
  "https://images.pexels.com/photos/29039798/pexels-photo-29039798.jpeg?auto=compress&cs=tinysrgb&w=1600";

const womenFarmersImage =
  "https://images.pexels.com/photos/35894304/pexels-photo-35894304.jpeg?auto=compress&cs=tinysrgb&w=900";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: ShoppingBasket,
      title: "Direct Marketplace",
      description:
        "Help farmers and buyers connect through one convenient platform.",
    },
    {
      icon: TrendingUp,
      title: "Transparent Pricing",
      description:
        "Make informed trading decisions with accessible market prices.",
    },
    {
      icon: Handshake,
      title: "Easy Deal Management",
      description:
        "Keep track of agricultural deals, payments, and deliveries.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-green-900/10 bg-white/95 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white shadow-md transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
              <Leaf size={27} strokeWidth={2.5} />
            </span>

            <span className="text-2xl font-black tracking-tight text-green-900 md:text-3xl">
              Krishi<span className="text-green-600">Connect</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="font-bold text-gray-700 transition hover:text-green-700"
            >
              Home
            </a>
            <a
              href="#about"
              className="font-bold text-gray-700 transition hover:text-green-700"
            >
              About
            </a>
            <a
              href="#benefits"
              className="font-bold text-gray-700 transition hover:text-green-700"
            >
              Benefits
            </a>

            <Link
              to="/login"
              className="rounded-xl px-5 py-3 font-extrabold text-green-800 transition hover:bg-green-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-extrabold text-white shadow-lg shadow-green-700/20 transition duration-300 hover:-translate-y-1 hover:bg-green-800"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-gray-200 p-2 text-green-800 md:hidden"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          className={`grid transition-all duration-300 md:hidden ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-1 border-t border-gray-100 bg-white px-5 py-4">
              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-4 py-3 font-bold hover:bg-green-50"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-4 py-3 font-bold hover:bg-green-50"
              >
                About
              </a>
              <a
                href="#benefits"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-4 py-3 font-bold hover:bg-green-50"
              >
                Benefits
              </a>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-4 py-3 font-bold text-green-800 hover:bg-green-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-green-700 px-4 py-3 text-center font-extrabold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative isolate">
          <div className="absolute inset-0 -z-20 bg-green-950" />

          <img
            src={farmerImage}
            alt="Indian farmer working in a green paddy field"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
            fetchPriority="high"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-950/95 via-green-950/80 to-green-950/25" />

          <div className="mx-auto grid min-h-[620px] max-w-7xl items-center px-6 py-20 md:min-h-[690px] md:px-8">
            <div className="max-w-3xl animate-[heroEnter_0.9s_ease-out_both]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                <Sprout size={17} />
                Growing together, trading smarter
              </span>

              <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Empowering Farmers.
                <span className="mt-2 block text-lime-300">
                  Connecting Markets.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
                A smarter agricultural marketplace that brings farmers and
                buyers together for transparent and efficient trade.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register?role=FARMER"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 font-black text-green-950 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-lime-300"
                >
                  Join as Farmer
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/register?role=BUYER"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/10 px-6 py-4 font-black text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-900"
                >
                  Join as Buyer
                  <ArrowRight size={19} />
                </Link>
              </div>

              <p className="mt-7 text-sm font-medium text-white/75">
                From the field to the marketplace — one connected platform.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-lime-300 via-green-500 to-emerald-700" />
        </section>

        {/* Introduction */}
        <section
          id="about"
          className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-8 md:py-28"
        >
          <div className="reveal relative">
            <div className="absolute -left-3 -top-3 h-28 w-28 rounded-tl-3xl border-l-4 border-t-4 border-green-500" />

            <img
              src={womenFarmersImage}
              alt="Farmers working together in an agricultural field"
              loading="lazy"
              className="relative h-[320px] w-full rounded-3xl object-cover shadow-2xl transition duration-700 hover:scale-[1.02] md:h-[410px]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <div className="absolute -bottom-5 right-4 rounded-2xl bg-green-700 px-5 py-4 text-white shadow-xl sm:right-8">
              <p className="text-lg font-black">Better Connections</p>
              <p className="mt-1 text-sm text-green-100">
                Stronger agricultural trade
              </p>
            </div>
          </div>

          <div className="reveal pt-5 md:pt-0">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-green-700">
              About KrishiConnect
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-gray-900 md:text-5xl">
              Agriculture deserves a
              <span className="text-green-700"> better connection.</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              KrishiConnect helps simplify the agricultural supply chain by
              bringing produce discovery, deal management, payments, and
              deliveries into one platform.
            </p>

            <Link
              to="/register"
              className="group mt-7 inline-flex items-center gap-2 font-black text-green-800 transition hover:text-green-600"
            >
              Become part of KrishiConnect
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="bg-green-50/80 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="reveal mx-auto mb-12 max-w-2xl text-center">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-green-700">
                Why KrishiConnect
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                Trade with confidence.
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Essential tools designed to make agricultural trade simpler.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  className="reveal group rounded-2xl border border-green-100 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-800 transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-green-700 group-hover:text-white">
                    <Icon size={27} strokeWidth={2.2} />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-3 leading-7 text-gray-600">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 md:py-24">
          <div className="reveal mx-auto max-w-5xl overflow-hidden rounded-3xl bg-green-800 px-6 py-12 text-center shadow-2xl sm:px-12 md:py-16">
            <Leaf className="mx-auto h-10 w-10 text-lime-300" />
            <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
              Let's grow together.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-green-100">
              Join a connected agricultural marketplace built for farmers
              and buyers.
            </p>

            <Link
              to="/register"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-7 py-4 font-black text-green-950 transition duration-300 hover:-translate-y-1 hover:bg-lime-300"
            >
              Get Started Today
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-7 text-center sm:flex-row sm:text-left md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-700" />
            <span className="text-lg font-black text-green-900">
              KrishiConnect
            </span>
          </Link>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} KrishiConnect. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes heroEnter {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }

          .reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;