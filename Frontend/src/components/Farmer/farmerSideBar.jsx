// import {
//     LayoutDashboard,
//     Sprout,
//     TrendingUp,
//     Handshake,
//     Truck,
//     BookOpen,
//     Bell,
//     LogOut,
//     X,
//     CreditCard,
//     UserCircle,
//     ChevronRight,
//     Wheat,
//     Layers3,
// } from "lucide-react";

// import { useAuth } from "../../context/AuthContext";
// import { useLocation, useNavigate } from "react-router-dom";

// const FarmerSidebar = ({ mobileOpen, setMobileOpen }) => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const menuItems = [
//         {
//             label: "Dashboard",
//             path: "/farmer/dashboard",
//             icon: LayoutDashboard,
//             section: "OVERVIEW",
//         },
//         {
//             label: "My Produce",
//             path: "/farmer/produce",
//             icon: Sprout,
//             section: "OVERVIEW",
//         },
//         {
//             label: "Market Prices",
//             path: "/farmer/market-prices",
//             icon: TrendingUp,
//             section: "OVERVIEW",
//         },
//         {
//             label: "My Deals",
//             path: "/farmer/deals",
//             icon: Handshake,
//             section: "MANAGEMENT",
//         },
//         {
//             label: "My Pooled Deals",
//             path: "/farmer/pooled-deals",
//             icon: Layers3,
//             section: "MANAGEMENT",
//         },
//         {
//             label: "Payments",
//             path: "/farmer/payments",
//             icon: CreditCard,
//             section: "MANAGEMENT",
//         },
//         {
//             label: "Deliveries",
//             path: "/farmer/deliveries",
//             icon: Truck,
//             section: "MANAGEMENT",
//         },
//         {
//             label: "Ledger",
//             path: "/farmer/ledger",
//             icon: BookOpen,
//             section: "MANAGEMENT",
//         },
//         {
//             label: "Notifications",
//             path: "/farmer/notifications",
//             icon: Bell,
//             section: "ACCOUNT",
//         },
//         {
//             label: "My Profile",
//             path: "/farmer/profile",
//             icon: UserCircle,
//             section: "ACCOUNT",
//         },
//         {
//             label: "Pooled Deliveries",
//             path: "/farmer/pooled-deliveries",
//             icon: Truck,
//         }
//     ];

//     const handleLogout = async () => {
//         try {
//             await logout();
//             navigate("/login", { replace: true });
//         } catch (error) {
//             console.error("Logout failed:", error);
//         }
//     };

//     const handleNavigation = (path) => {
//         navigate(path);
//         setMobileOpen(false);
//     };

//     const isActive = (path) => {
//         if (path === "/farmer/dashboard") {
//             return location.pathname === path;
//         }

//         return (
//             location.pathname === path ||
//             location.pathname.startsWith(`${path}/`)
//         );
//     };

//     const sections = [...new Set(menuItems.map((item) => item.section))];

//     const displayName = user?.name || "Farmer";
//     const initials = displayName
//         .split(" ")
//         .filter(Boolean)
//         .slice(0, 2)
//         .map((part) => part[0].toUpperCase())
//         .join("");

//     return (
//         <>
//             {/* Mobile overlay */}
//             <div
//                 onClick={() => setMobileOpen(false)}
//                 className={`
//                     fixed inset-0 z-40
//                     bg-slate-950/40
//                     backdrop-blur-[2px]
//                     transition-opacity duration-300
//                     lg:hidden
//                     ${mobileOpen
//                         ? "visible opacity-100"
//                         : "invisible opacity-0"
//                     }
//                 `}
//                 aria-hidden="true"
//             />

//             {/* Sidebar */}
//             <aside
//                 className={`
//                     fixed inset-y-0 left-0 z-50
//                     flex h-dvh w-[272px] shrink-0
//                     flex-col
//                     border-r border-emerald-100/80
//                     bg-white
//                     shadow-xl shadow-slate-900/5
//                     transition-transform duration-300 ease-in-out
//                     lg:sticky lg:top-0 lg:z-30
//                     lg:h-screen lg:translate-x-0
//                     lg:shadow-none
//                     ${mobileOpen
//                         ? "translate-x-0"
//                         : "-translate-x-full"
//                     }
//                 `}
//             >
//                 {/* Brand */}
//                 <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
//                     <button
//                         type="button"
//                         onClick={() => handleNavigation("/farmer/dashboard")}
//                         className="flex items-center gap-3 text-left"
//                         aria-label="Go to farmer dashboard"
//                     >
//                         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-green-700/20">
//                             <Sprout size={25} strokeWidth={2.2} />
//                         </div>

//                         <div>
//                             <h1 className="text-[17px] font-extrabold tracking-tight text-slate-900">
//                                 Krishi<span className="text-emerald-600">Connect</span>
//                             </h1>

//                             <div className="mt-0.5 flex items-center gap-1.5">
//                                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                                 <p className="text-[11px] font-medium tracking-wide text-slate-500">
//                                     FARMER WORKSPACE
//                                 </p>
//                             </div>
//                         </div>
//                     </button>

//                     <button
//                         type="button"
//                         onClick={() => setMobileOpen(false)}
//                         className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
//                         aria-label="Close navigation"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Farmer welcome panel */}
//                 <div className="mx-4 mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-3.5">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
//                             <Wheat size={21} />
//                         </div>

//                         <div className="min-w-0 flex-1">
//                             <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-emerald-700">
//                                 Welcome back
//                             </p>
//                             <p className="mt-1 truncate text-sm font-bold text-slate-800">
//                                 {displayName}
//                             </p>
//                         </div>
//                     </div>

//                     <p className="mt-3 text-xs leading-5 text-slate-500">
//                         Manage your produce, connect with buyers, and track your farm business.
//                     </p>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="mt-5 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
//                     {sections.map((section) => (
//                         <div key={section}>
//                             <p className="mb-2 px-3 text-[10px] font-bold tracking-[1.6px] text-slate-400">
//                                 {section}
//                             </p>

//                             <div className="space-y-1">
//                                 {menuItems
//                                     .filter((item) => item.section === section)
//                                     .map((item) => {
//                                         const Icon = item.icon;
//                                         const active = isActive(item.path);

//                                         return (
//                                             <button
//                                                 key={item.path}
//                                                 type="button"
//                                                 onClick={() =>
//                                                     handleNavigation(item.path)
//                                                 }
//                                                 aria-current={
//                                                     active ? "page" : undefined
//                                                 }
//                                                 className={`
//                                                     group relative flex w-full
//                                                     items-center gap-3
//                                                     rounded-xl px-3 py-3
//                                                     text-left text-[13px]
//                                                     font-semibold
//                                                     transition-all duration-200
//                                                     ${active
//                                                         ? "bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-900/[0.03]"
//                                                         : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                                                     }
//                                                 `}
//                                             >
//                                                 {active && (
//                                                     <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-emerald-600" />
//                                                 )}

//                                                 <span
//                                                     className={`
//                                                         flex h-9 w-9 shrink-0
//                                                         items-center justify-center
//                                                         rounded-xl transition-all duration-200
//                                                         ${active
//                                                             ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
//                                                             : "bg-slate-100/80 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700"
//                                                         }
//                                                     `}
//                                                 >
//                                                     <Icon size={18} strokeWidth={2} />
//                                                 </span>

//                                                 <span className="min-w-0 flex-1">
//                                                     {item.label}
//                                                 </span>

//                                                 <ChevronRight
//                                                     size={15}
//                                                     className={`
//                                                         shrink-0 transition-all duration-200
//                                                         ${active
//                                                             ? "translate-x-0 text-emerald-600 opacity-100"
//                                                             : "-translate-x-1 text-slate-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
//                                                         }
//                                                     `}
//                                                 />
//                                             </button>
//                                         );
//                                     })}
//                             </div>
//                         </div>
//                     ))}
//                 </nav>

//                 {/* Bottom farmer profile and logout */}
//                 <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-4">
//                     <button
//                         type="button"
//                         onClick={() => handleNavigation("/farmer/profile")}
//                         className="mb-3 flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white"
//                     >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-sm font-bold text-emerald-800 shadow-sm">
//                             {initials || "F"}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                             <p className="truncate text-sm font-bold text-slate-800">
//                                 {displayName}
//                             </p>
//                             <p className="mt-0.5 text-xs text-slate-500">
//                                 Farmer account
//                             </p>
//                         </div>

//                         <UserCircle
//                             size={17}
//                             className="shrink-0 text-slate-400"
//                         />
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleLogout}
//                         className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:border-rose-100 hover:bg-rose-50"
//                     >
//                         <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition group-hover:bg-rose-100">
//                             <LogOut size={17} />
//                         </span>

//                         <span className="flex-1 text-left">Sign out</span>
//                         <ChevronRight
//                             size={15}
//                             className="text-rose-300 transition group-hover:translate-x-0.5 group-hover:text-rose-500"
//                         />
//                     </button>

//                     <p className="mt-4 text-center text-[10px] font-medium tracking-wide text-slate-400">
//                         KRISHICONNECT · FARMER PANEL
//                     </p>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default FarmerSidebar;



import { useState } from "react";
import {
    LayoutDashboard,
    Sprout,
    TrendingUp,
    Handshake,
    Truck,
    BookOpen,
    Bell,
    LogOut,
    X,
    CreditCard,
    UserCircle,
    ChevronRight,
    Wheat,
    Layers3,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        path: "/farmer/dashboard",
        icon: LayoutDashboard,
        section: "OVERVIEW",
    },
    {
        label: "My Produce",
        path: "/farmer/produce",
        icon: Sprout,
        section: "OVERVIEW",
    },
    {
        label: "Market Prices",
        path: "/farmer/market-prices",
        icon: TrendingUp,
        section: "OVERVIEW",
    },
    {
        label: "My Deals",
        path: "/farmer/deals",
        icon: Handshake,
        section: "MANAGEMENT",
    },
    {
        label: "My Pooled Deals",
        path: "/farmer/pooled-deals",
        icon: Layers3,
        section: "MANAGEMENT",
    },
    {
        label: "Payments",
        path: "/farmer/payments",
        icon: CreditCard,
        section: "MANAGEMENT",
    },
    {
        label: "Deliveries",
        path: "/farmer/deliveries",
        icon: Truck,
        section: "MANAGEMENT",
    },
    {
        label: "Pooled Deliveries",
        path: "/farmer/pooled-deliveries",
        icon: Truck,
        section: "MANAGEMENT",
    },
    {
        label: "Ledger",
        path: "/farmer/ledger",
        icon: BookOpen,
        section: "MANAGEMENT",
    },
    {
        label: "Notifications",
        path: "/farmer/notifications",
        icon: Bell,
        section: "ACCOUNT",
    },
    {
        label: "My Profile",
        path: "/farmer/profile",
        icon: UserCircle,
        section: "ACCOUNT",
    },
];

const sections = ["OVERVIEW", "MANAGEMENT", "ACCOUNT"];

const FarmerSidebar = ({ mobileOpen, setMobileOpen }) => {
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [loggingOut, setLoggingOut] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Dynamic user information
    const displayName = user?.name?.trim() || "Farmer";

    const initials =
        displayName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "F";

    const userEmail = user?.email || "";
    const userRole = user?.role || "";

    // Active route detection
    const isActive = (path) => {
        if (path === "/farmer/dashboard") {
            return location.pathname === path;
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    // Navigation
    const handleNavigation = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    // Logout
    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);

            await logout();

            setMobileOpen(false);

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    // Toggle desktop sidebar
    const toggleCollapse = () => {
        setCollapsed((previous) => !previous);
    };

    return (
        <>
            <style>
                {`
                    @keyframes sidebarFadeIn {
                        from {
                            opacity: 0;
                            transform: translateX(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes sidebarItemIn {
                        from {
                            opacity: 0;
                            transform: translateY(6px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .sidebar-fade {
                        animation: sidebarFadeIn 0.3s ease-out both;
                    }

                    .sidebar-item {
                        animation: sidebarItemIn 0.3s ease-out both;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .sidebar-fade,
                        .sidebar-item {
                            animation: none !important;
                        }
                    }
                `}
            </style>

            {/* Mobile overlay */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`
                    fixed inset-0 z-40
                    bg-slate-950/50
                    backdrop-blur-sm
                    transition-all duration-300
                    lg:hidden
                    ${
                        mobileOpen
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                    }
                `}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                id="farmer-sidebar"
                aria-label="Farmer navigation"
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex h-dvh shrink-0
                    flex-col overflow-hidden
                    border-r border-emerald-100
                    bg-white
                    shadow-2xl shadow-slate-900/10
                    transition-all duration-300 ease-in-out

                    w-[min(280px,85vw)]

                    lg:sticky lg:top-0 lg:z-30
                    lg:h-screen lg:translate-x-0
                    lg:shadow-none

                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    ${
                        collapsed
                            ? "lg:w-[84px]"
                            : "lg:w-[272px]"
                    }
                `}
            >
                {/* Brand */}
                <div
                    className={`
                        flex h-[78px] shrink-0
                        items-center
                        border-b border-slate-100
                        ${
                            collapsed
                                ? "justify-center px-3"
                                : "justify-between px-5"
                        }
                    `}
                >
                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation("/farmer/dashboard")
                        }
                        className="group flex min-w-0 items-center gap-3"
                        aria-label="Go to dashboard"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-700/20 transition-transform duration-300 group-hover:scale-105">
                            <Sprout size={25} strokeWidth={2.2} />
                        </div>

                        {!collapsed && (
                            <div className="min-w-0 text-left">
                                <h1 className="whitespace-nowrap text-[17px] font-extrabold tracking-tight text-slate-900">
                                    Krishi
                                    <span className="text-emerald-600">
                                        Connect
                                    </span>
                                </h1>

                                <p className="mt-0.5 text-[10px] font-semibold tracking-[1.2px] text-slate-400">
                                    FARMER WORKSPACE
                                </p>
                            </div>
                        )}
                    </button>

                    {/* Mobile close */}
                    {!collapsed && (
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Desktop collapse control */}
                <div
                    className={`
                        hidden shrink-0 px-4 pt-4 lg:flex
                        ${
                            collapsed
                                ? "justify-center"
                                : "justify-end"
                        }
                    `}
                >
                    <button
                        type="button"
                        onClick={toggleCollapse}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                        aria-label={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        title={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {collapsed ? (
                            <PanelLeftOpen size={19} />
                        ) : (
                            <PanelLeftClose size={19} />
                        )}
                    </button>
                </div>

                {/* Dynamic user panel */}
                <div
                    className={`
                        sidebar-fade mx-4 mt-5
                        rounded-2xl border border-emerald-100
                        bg-gradient-to-br from-emerald-50 to-white
                        ${
                            collapsed
                                ? "flex justify-center p-2 lg:mx-3"
                                : "p-3.5"
                        }
                    `}
                >
                    <div
                        className={`
                            flex items-center
                            ${
                                collapsed
                                    ? "justify-center"
                                    : "gap-3"
                            }
                        `}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-800">
                            {initials}
                        </div>

                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-800">
                                    {displayName}
                                </p>

                                {userEmail && (
                                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                        {userEmail}
                                    </p>
                                )}

                                {userRole && (
                                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                        {userRole}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav
                    aria-label="Main navigation"
                    className="mt-6 flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 pb-5"
                >
                    {sections.map((section, sectionIndex) => {
                        const sectionItems = menuItems.filter(
                            (item) => item.section === section
                        );

                        return (
                            <div
                                key={section}
                                className="sidebar-fade"
                                style={{
                                    animationDelay: `${sectionIndex * 60}ms`,
                                }}
                            >
                                {!collapsed && (
                                    <p className="mb-2.5 px-3 text-[10px] font-extrabold tracking-[1.5px] text-slate-400">
                                        {section}
                                    </p>
                                )}

                                {collapsed && (
                                    <div className="mx-auto mb-3 h-px w-8 bg-slate-200" />
                                )}

                                <div className="space-y-1">
                                    {sectionItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);

                                        return (
                                            <button
                                                key={item.path}
                                                type="button"
                                                onClick={() =>
                                                    handleNavigation(item.path)
                                                }
                                                aria-current={
                                                    active
                                                        ? "page"
                                                        : undefined
                                                }
                                                title={
                                                    collapsed
                                                        ? item.label
                                                        : undefined
                                                }
                                                className={`
                                                    sidebar-item group
                                                    relative flex w-full
                                                    items-center
                                                    rounded-xl
                                                    py-2.5
                                                    text-[13px]
                                                    font-semibold
                                                    transition-all duration-200
                                                    active:scale-[0.98]

                                                    ${
                                                        collapsed
                                                            ? "justify-center px-2"
                                                            : "gap-3 px-3"
                                                    }

                                                    ${
                                                        active
                                                            ? "bg-emerald-50 text-emerald-800"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                    }
                                                `}
                                                style={{
                                                    animationDelay: `${index * 25}ms`,
                                                }}
                                            >
                                                {active && (
                                                    <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-emerald-600" />
                                                )}

                                                <span
                                                    className={`
                                                        flex h-9 w-9 shrink-0
                                                        items-center justify-center
                                                        rounded-xl
                                                        transition-all duration-200
                                                        ${
                                                            active
                                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                                                : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                                                        }
                                                    `}
                                                >
                                                    <Icon
                                                        size={18}
                                                        strokeWidth={2}
                                                    />
                                                </span>

                                                {!collapsed && (
                                                    <>
                                                        <span className="min-w-0 flex-1 truncate text-left">
                                                            {item.label}
                                                        </span>

                                                        <ChevronRight
                                                            size={15}
                                                            className={`
                                                                shrink-0
                                                                transition-all duration-200
                                                                ${
                                                                    active
                                                                        ? "text-emerald-600"
                                                                        : "text-slate-300 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                                                                }
                                                            `}
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-3">
                    {/* Profile */}
                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation("/farmer/profile")
                        }
                        title={collapsed ? displayName : undefined}
                        className={`
                            group mb-2 flex w-full items-center
                            rounded-xl p-2
                            transition-all duration-200
                            hover:bg-white hover:shadow-sm
                            ${
                                collapsed
                                    ? "justify-center"
                                    : "gap-3"
                            }
                        `}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-100 to-green-200 text-sm font-extrabold text-emerald-800 shadow-sm">
                            {initials}
                        </div>

                        {!collapsed && (
                            <>
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-sm font-bold text-slate-800">
                                        {displayName}
                                    </p>

                                    <p className="truncate text-[11px] text-slate-500">
                                        {userEmail || userRole || "Profile"}
                                    </p>
                                </div>

                                <UserCircle
                                    size={17}
                                    className="shrink-0 text-slate-400 group-hover:text-emerald-600"
                                />
                            </>
                        )}
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        title={collapsed ? "Sign out" : undefined}
                        className={`
                            group flex w-full items-center
                            rounded-xl border border-transparent
                            py-2.5 text-sm font-semibold
                            text-rose-600
                            transition-all duration-200
                            hover:border-rose-100 hover:bg-rose-50
                            disabled:cursor-not-allowed disabled:opacity-60
                            ${
                                collapsed
                                    ? "justify-center px-2"
                                    : "gap-3 px-3"
                            }
                        `}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100">
                            {loggingOut ? (
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <LogOut size={17} />
                            )}
                        </span>

                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left">
                                    {loggingOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                </span>

                                <ChevronRight
                                    size={15}
                                    className="text-rose-300 transition group-hover:translate-x-0.5 group-hover:text-rose-500"
                                />
                            </>
                        )}
                    </button>

                    {!collapsed && (
                        <p className="mt-3 text-center text-[9px] font-medium tracking-wide text-slate-400">
                            KRISHICONNECT
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
};

export default FarmerSidebar;
