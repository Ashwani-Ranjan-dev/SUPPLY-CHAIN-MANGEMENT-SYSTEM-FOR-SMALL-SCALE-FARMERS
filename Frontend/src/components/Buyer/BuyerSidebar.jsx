import {
    LayoutDashboard,
    Search,
    ShoppingCart,
    CreditCard,
    Truck,
    Bell,
    UserCircle,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import BuyerProfile from "../../pages/Buyer/Buyerprofile";

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
            name: "Profile",
            path: "/buyer/profile",
            icon: UserCircle,
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-72
                    flex-col
                    border-r
                    border-gray-100
                    bg-white
                    shadow-sm
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-green-600">
                            KRISHICONNECT
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-gray-900">
                            Buyer Portal
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition
                                    ${
                                        isActive
                                            ? "bg-green-50 text-green-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                    `
                                }
                            >
                                <Icon className="h-5 w-5 shrink-0" />

                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom information */}
                <div className="border-t border-gray-100 p-4">
                    <div className="rounded-2xl bg-green-50 p-4">
                        <p className="text-xs font-semibold text-green-700">
                            BUYER
                        </p>

                        <p className="mt-1 text-sm leading-5 text-gray-600">
                            Discover produce directly from farmers.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default BuyerSidebar;