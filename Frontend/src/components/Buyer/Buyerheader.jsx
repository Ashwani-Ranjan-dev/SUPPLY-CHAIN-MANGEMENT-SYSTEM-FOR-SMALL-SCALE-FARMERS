import { Menu, Bell } from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const BuyerHeader = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
            <div className="flex h-20 items-center justify-between px-5 sm:px-8">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Buyer Portal
                        </p>

                        <h1 className="text-lg font-bold text-gray-900">
                            Welcome back, {user?.name || "Buyer"}
                        </h1>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/buyer/notifications"
                        className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <Bell className="h-5 w-5" />
                    </Link>

                    <Link
                        to="/buyer/profile"
                        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                            {user?.name?.charAt(0)?.toUpperCase() || "B"}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-gray-900">
                                {user?.name || "Buyer"}
                            </p>

                            <p className="text-xs text-gray-500">
                                Buyer
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default BuyerHeader;