// import {
//     LayoutDashboard,
//     Search,
//     ShoppingCart,
//     CreditCard,
//     Truck,
//     Bell,
//     UserCircle,
//     X,
// } from "lucide-react";

// import { NavLink } from "react-router-dom";
// import BuyerProfile from "../../pages/Buyer/Buyerprofile";

// const BuyerSidebar = ({ isOpen, onClose }) => {
//     const navigation = [
//         {
//             name: "Dashboard",
//             path: "/buyer/dashboard",
//             icon: LayoutDashboard,
//         },
//         {
//             name: "Marketplace",
//             path: "/buyer/produce",
//             icon: Search,
//         },
//         {
//             name: "My Deals",
//             path: "/buyer/deals",
//             icon: ShoppingCart,
//         },
//         {
//             name: "Payments",
//             path: "/buyer/payments",
//             icon: CreditCard,
//         },
//         {
//             name: "Deliveries",
//             path: "/buyer/deliveries",
//             icon: Truck,
//         },
//         {
//             name: "Notifications",
//             path: "/buyer/notifications",
//             icon: Bell,
//         },
//         {
//             name: "Profile",
//             path: "/buyer/profile",
//             icon: UserCircle,
//         },
//     ];

//     return (
//         <>
//             {/* Mobile overlay */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//                     onClick={onClose}
//                 />
//             )}

//             <aside
//                 className={`
//                     fixed
//                     left-0
//                     top-0
//                     z-50
//                     flex
//                     h-screen
//                     w-72
//                     flex-col
//                     border-r
//                     border-gray-100
//                     bg-white
//                     shadow-sm
//                     transition-transform
//                     duration-300
//                     lg:translate-x-0
//                     ${isOpen ? "translate-x-0" : "-translate-x-full"}
//                 `}
//             >
//                 {/* Logo */}
//                 <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
//                     <div>
//                         <p className="text-xs font-bold tracking-[0.2em] text-green-600">
//                             KRISHICONNECT
//                         </p>

//                         <h2 className="mt-1 text-lg font-bold text-gray-900">
//                             Buyer Portal
//                         </h2>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
//                     >
//                         <X className="h-5 w-5" />
//                     </button>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
//                     {navigation.map((item) => {
//                         const Icon = item.icon;

//                         return (
//                             <NavLink
//                                 key={item.path}
//                                 to={item.path}
//                                 onClick={onClose}
//                                 className={({ isActive }) =>
//                                     `
//                                     flex
//                                     items-center
//                                     gap-3
//                                     rounded-xl
//                                     px-4
//                                     py-3
//                                     text-sm
//                                     font-semibold
//                                     transition
//                                     ${
//                                         isActive
//                                             ? "bg-green-50 text-green-700"
//                                             : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                                     }
//                                     `
//                                 }
//                             >
//                                 <Icon className="h-5 w-5 shrink-0" />

//                                 <span>{item.name}</span>
//                             </NavLink>
//                         );
//                     })}
//                 </nav>

//                 {/* Bottom information */}
//                 <div className="border-t border-gray-100 p-4">
//                     <div className="rounded-2xl bg-green-50 p-4">
//                         <p className="text-xs font-semibold text-green-700">
//                             BUYER
//                         </p>

//                         <p className="mt-1 text-sm leading-5 text-gray-600">
//                             Discover produce directly from farmers.
//                         </p>
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default BuyerSidebar;



import {
    LayoutDashboard,
    Search,
    ShoppingCart,
    CreditCard,
    Truck,
    Bell,
    UserCircle,
    X,
    Leaf,
    Sprout,
    ArrowUpRight,
    ChevronRight,
    Package,
    Handshake
} from "lucide-react";

import { NavLink } from "react-router-dom";

const BuyerSidebar = ({ isOpen, onClose }) => {
    const navigation = [
        {
            name: "Dashboard",
            path: "/buyer/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Marketplace",
            path: "/buyer/produce",
            icon: Search,
        },
        {
            name: "My Deals",
            path: "/buyer/deals",
            icon: ShoppingCart,
        },
        {
            name: "Payments",
            path: "/buyer/payments",
            icon: CreditCard,
        },
        {
            name: "Deliveries",
            path: "/buyer/deliveries",
            icon: Truck,
        },
        {
            name: "Notifications",
            path: "/buyer/notifications",
            icon: Bell,
        },
        {
            name: "Pooled Produce",
            path: "/buyer/pooled-lots",
            icon: Package,
        },
        {
            name : "My Pooled Deals",
            path : "/buyer/pooled-deals",
            icon : Handshake,
        },
         {
            name: "Profile",
            path: "/buyer/profile",
            icon: UserCircle,
        },
    ];

    return (
        <>
            <style>{`
                @keyframes sidebarFadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes sidebarLogoFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-3px);
                    }
                }

                @keyframes sidebarGlow {
                    0%, 100% {
                        opacity: 0.35;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }

                .buyer-sidebar-link {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    animation: sidebarFadeIn 0.4s ease-out both;
                    transition:
                        background-color 0.25s ease,
                        color 0.25s ease,
                        transform 0.25s ease,
                        box-shadow 0.25s ease;
                }

                .buyer-sidebar-link:hover {
                    transform: translateX(3px);
                }

                .buyer-sidebar-link::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    background: linear-gradient(
                        100deg,
                        rgba(22, 163, 74, 0.09),
                        rgba(22, 163, 74, 0.015)
                    );
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }

                .buyer-sidebar-link:hover::before {
                    opacity: 1;
                }

                .buyer-sidebar-link[aria-current="page"] {
                    background: linear-gradient(
                        110deg,
                        #eaf8ed,
                        #f2faf3
                    );
                    color: #15803d;
                    box-shadow: inset 0 0 0 1px rgba(22, 163, 74, 0.09);
                }

                .buyer-sidebar-link[aria-current="page"]::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 25%;
                    height: 50%;
                    width: 3px;
                    border-radius: 0 5px 5px 0;
                    background: #16a34a;
                }

                .buyer-sidebar-link[aria-current="page"] .buyer-nav-icon {
                    background: #16a34a;
                    color: white;
                    box-shadow: 0 4px 10px rgba(22, 163, 74, 0.2);
                }

                .buyer-nav-icon {
                    transition:
                        background-color 0.25s ease,
                        color 0.25s ease,
                        transform 0.25s ease;
                }

                .buyer-sidebar-link:hover .buyer-nav-icon {
                    transform: scale(1.08);
                }

                .buyer-sidebar-link[aria-current="page"]:hover .buyer-nav-icon {
                    transform: scale(1.08) rotate(-4deg);
                }

                .buyer-sidebar-brand {
                    animation: sidebarLogoFloat 4s ease-in-out infinite;
                }

                .buyer-sidebar-glow {
                    animation: sidebarGlow 4s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .buyer-sidebar-link,
                    .buyer-sidebar-brand,
                    .buyer-sidebar-glow {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            {/* MOBILE OVERLAY */}

            <div
                className={`
                    fixed inset-0 z-40 bg-gray-950/45 backdrop-blur-[3px]
                    transition-opacity duration-300 lg:hidden
                    ${isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
                onClick={onClose}
                aria-hidden="true"
            />


            {/* SIDEBAR */}

            <aside
                id="buyer-sidebar"
                aria-label="Buyer navigation"
                className={`
                    fixed left-0 top-0 z-50 flex h-[100dvh] w-72
                    flex-col overflow-hidden border-r border-green-100/80
                    bg-white shadow-[8px_0_35px_rgba(20,83,45,0.06)]
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* DECORATIVE BACKGROUND */}

                <div className="pointer-events-none absolute -right-16 top-24 h-40 w-40 rounded-full bg-green-100/40 blur-3xl" />


                {/* BRAND HEADER */}

                <div className="relative flex min-h-[104px] items-center justify-between border-b border-gray-100/90 px-5">

                    <div className="flex items-center gap-3">

                        <div className="buyer-sidebar-brand relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-800 text-white shadow-lg shadow-green-200/70">

                            <Sprout size={27} strokeWidth={1.8} />

                            <span className="buyer-sidebar-glow absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-lime-400" />

                        </div>

                        <div>
                            <p className="text-[10px] font-extrabold tracking-[0.22em] text-green-700">
                                KRISHICONNECT
                            </p>

                            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-gray-900">
                                Buyer Portal
                            </h2>

                            <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                                Your farm-to-market hub
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                        className="rounded-xl border border-gray-100 p-2 text-gray-500 transition-all duration-200 hover:rotate-90 hover:border-red-100 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 lg:hidden"
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* NAVIGATION LABEL */}

                <div className="relative px-5 pb-2 pt-6">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-400">
                        Workspace
                    </p>
                </div>


                {/* NAVIGATION ITEMS */}

                <nav
                    className="relative flex-1 space-y-1 overflow-y-auto px-3 pb-5 pt-2"
                    aria-label="Main navigation"
                >
                    {navigation.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/buyer/dashboard"}
                                onClick={onClose}
                                style={{
                                    animationDelay: `${index * 55}ms`,
                                }}
                                className={({ isActive }) => `
                                    buyer-sidebar-link group flex items-center
                                    gap-3 rounded-xl px-3 py-2.5
                                    text-[13px] font-semibold
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-inset
                                    focus-visible:ring-green-500
                                    ${isActive
                                        ? "text-green-800"
                                        : "text-gray-500 hover:text-gray-900"
                                    }
                                `}
                            >

                                <span className="buyer-nav-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 group-hover:bg-green-50 group-hover:text-green-700">

                                    <Icon
                                        size={18}
                                        strokeWidth={1.8}
                                    />

                                </span>

                                <span className="flex-1">
                                    {item.name}
                                </span>

                                <ChevronRight
                                    size={15}
                                    className="shrink-0 text-green-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-70 group-[.active]:opacity-100"
                                />

                            </NavLink>
                        );
                    })}
                </nav>


                {/* BOTTOM INFORMATION */}

                <div className="relative border-t border-gray-100 bg-gradient-to-b from-white to-green-50/50 p-4">

                    <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">

                        <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-green-100/70 blur-xl" />

                        <div className="relative flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-600 text-white shadow-md shadow-green-200">
                                <Leaf size={16} />
                            </div>

                            <div>
                                <p className="text-[10px] font-extrabold tracking-[0.15em] text-green-700">
                                    BUYER COMMUNITY
                                </p>
                                <p className="mt-0.5 text-xs font-bold text-gray-800">
                                    Growing together
                                </p>
                            </div>

                        </div>

                        <p className="relative mt-3 text-xs leading-5 text-gray-500">
                            Discover quality produce directly from farmers
                            and make every purchase count.
                        </p>

                        <div className="relative mt-3 flex items-center justify-between border-t border-green-100 pt-3">

                            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Farm to market
                            </span>

                            <ArrowUpRight
                                size={15}
                                className="text-green-600"
                            />

                        </div>

                    </div>

                    <p className="mt-3 text-center text-[10px] font-medium text-gray-400">
                        KrishiConnect © Agricultural marketplace
                    </p>

                </div>

            </aside>
        </>
    );
};

export default BuyerSidebar;
