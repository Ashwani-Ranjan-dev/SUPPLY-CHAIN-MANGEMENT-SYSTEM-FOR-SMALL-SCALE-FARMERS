// import { Menu, Bell } from "lucide-react";

// import { Link } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";

// const BuyerHeader = ({ onMenuClick }) => {
//     const { user } = useAuth();

//     return (
//         <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
//             <div className="flex h-20 items-center justify-between px-5 sm:px-8">
//                 {/* Left */}
//                 <div className="flex items-center gap-4">
//                     <button
//                         type="button"
//                         onClick={onMenuClick}
//                         className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
//                     >
//                         <Menu className="h-6 w-6" />
//                     </button>

//                     <div>
//                         <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                             Buyer Portal
//                         </p>

//                         <h1 className="text-lg font-bold text-gray-900">
//                             Welcome back, {user?.name || "Buyer"}
//                         </h1>
//                     </div>
//                 </div>

//                 {/* Right */}
//                 <div className="flex items-center gap-3">
//                     <Link
//                         to="/buyer/notifications"
//                         className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
//                     >
//                         <Bell className="h-5 w-5" />
//                     </Link>

//                     <Link
//                         to="/buyer/profile"
//                         className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
//                     >
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
//                             {user?.name?.charAt(0)?.toUpperCase() || "B"}
//                         </div>

//                         <div className="hidden text-left sm:block">
//                             <p className="text-sm font-semibold text-gray-900">
//                                 {user?.name || "Buyer"}
//                             </p>

//                             <p className="text-xs text-gray-500">
//                                 Buyer
//                             </p>
//                         </div>
//                     </Link>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default BuyerHeader;


import { Menu, Bell, Leaf, ChevronRight, Sprout } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const BuyerHeader = ({ onMenuClick }) => {
    const { user } = useAuth();
    const location = useLocation();

    const currentPage = {
        "/buyer/dashboard": "Dashboard",
        "/buyer/produce": "Marketplace",
        "/buyer/deals": "My Deals",
        "/buyer/payments": "Payments",
        "/buyer/deliveries": "Deliveries",
        "/buyer/notifications": "Notifications",
        "/buyer/profile": "My Profile",
    };

    const pageTitle =
        currentPage[location.pathname] || "Buyer Portal";

    const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "B";

    return (
        <>
            <style>{`
                @keyframes buyerHeaderEnter {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes buyerBellRing {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    15%, 45% {
                        transform: rotate(12deg);
                    }
                    30%, 60% {
                        transform: rotate(-12deg);
                    }
                }

                @keyframes buyerOnlinePulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
                    }
                }

                .buyer-header-enter {
                    animation: buyerHeaderEnter 0.45s ease-out both;
                }

                .buyer-header-icon {
                    transition:
                        background-color 0.25s ease,
                        color 0.25s ease,
                        transform 0.25s ease,
                        box-shadow 0.25s ease;
                }

                .buyer-header-icon:hover {
                    transform: translateY(-2px);
                }

                .buyer-header-bell:hover svg {
                    animation: buyerBellRing 0.6s ease-in-out;
                    transform-origin: top center;
                }

                .buyer-header-avatar {
                    transition:
                        transform 0.25s ease,
                        box-shadow 0.25s ease;
                }

                .buyer-header-profile:hover .buyer-header-avatar {
                    transform: scale(1.06);
                    box-shadow: 0 5px 15px rgba(22, 163, 74, 0.2);
                }

                .buyer-header-online {
                    animation: buyerOnlinePulse 2.5s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .buyer-header-enter,
                    .buyer-header-online {
                        animation: none !important;
                    }

                    .buyer-header-icon,
                    .buyer-header-avatar {
                        transition: none !important;
                    }
                }
            `}</style>

            <header className="buyer-header-enter sticky top-0 z-30 border-b border-green-100/70 bg-white/90 shadow-[0_4px_20px_rgba(20,83,45,0.035)] backdrop-blur-xl">

                <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">

                    {/* LEFT: MENU AND PAGE TITLE */}

                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label="Open navigation menu"
                            aria-controls="buyer-sidebar"
                            className="buyer-header-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-600 shadow-sm hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 lg:hidden"
                        >
                            <Menu size={21} strokeWidth={2} />
                        </button>

                        <div className="min-w-0">

                            {/* BREADCRUMB */}

                            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px]">

                                <span className="flex items-center gap-1.5 text-green-700">
                                    <Leaf size={12} />
                                    Buyer Portal
                                </span>

                                <ChevronRight
                                    size={12}
                                    className="text-gray-300"
                                />

                                <span className="truncate text-gray-400">
                                    {pageTitle}
                                </span>

                            </div>

                            <h1 className="truncate text-base font-extrabold tracking-tight text-gray-900 sm:text-xl">
                                Welcome back,{" "}
                                <span className="text-green-700">
                                    {user?.name || "Buyer"}
                                </span>
                                <span className="ml-1 inline-block origin-bottom animate-[buyerHeaderEnter_0.5s_ease-out]">
                                    👋
                                </span>
                            </h1>

                        </div>

                    </div>


                    {/* RIGHT: NOTIFICATIONS AND PROFILE */}

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                        {/* NOTIFICATIONS */}

                        <Link
                            to="/buyer/notifications"
                            aria-label="View notifications"
                            aria-current={
                                location.pathname === "/buyer/notifications"
                                    ? "page"
                                    : undefined
                            }
                            className={`buyer-header-icon buyer-header-bell relative flex h-10 w-10 items-center justify-center rounded-xl border ${
                                location.pathname === "/buyer/notifications"
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-gray-100 bg-white text-gray-500 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                            }`}
                        >
                            <Bell size={19} strokeWidth={1.9} />

                            {/* Decorative indicator; no unread count is assumed */}

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-green-500" />

                        </Link>


                        {/* DIVIDER */}

                        <div className="hidden h-9 w-px bg-gray-200 sm:block" />


                        {/* PROFILE */}

                        <Link
                            to="/buyer/profile"
                            aria-label="Open buyer profile"
                            className="buyer-header-profile group flex items-center gap-2 rounded-2xl border border-transparent py-1.5 pl-1.5 pr-1 transition-all duration-300 hover:border-green-100 hover:bg-green-50/70 sm:gap-3 sm:pl-2 sm:pr-3"
                        >

                            <div className="relative shrink-0">

                                <div className="buyer-header-avatar flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-800 text-base font-extrabold text-white shadow-md shadow-green-200/60 sm:h-11 sm:w-11 sm:rounded-2xl">

                                    {initial}

                                </div>

                                <span className="buyer-header-online absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

                            </div>


                            <div className="hidden min-w-0 text-left sm:block">

                                <p className="max-w-32 truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-green-700">
                                    {user?.name || "Buyer"}
                                </p>

                                <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-gray-400">
                                    <Sprout
                                        size={12}
                                        className="text-green-600"
                                    />
                                    Buyer Account
                                </p>

                            </div>

                            <ChevronRight
                                size={15}
                                className="hidden text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-green-600 sm:block"
                            />

                        </Link>

                    </div>

                </div>

                {/* SUBTLE BOTTOM ACCENT */}

                <div className="h-[2px] bg-gradient-to-r from-transparent via-green-200/70 to-transparent" />

            </header>
        </>
    );
};

export default BuyerHeader;
