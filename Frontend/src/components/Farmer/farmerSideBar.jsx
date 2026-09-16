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
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FarmerSidebar = ({
    mobileOpen,
    setMobileOpen,
}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", {
            replace: true,
        });
    };

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            active: true,
        },
        {
            label: "My Produce",
            icon: Sprout,
        },
        {
            label: "Market Prices",
            icon: TrendingUp,
        },
        {
            label: "My Deals",
            icon: Handshake,
        },
        {
            label: "Deliveries",
            icon: Truck,
        },
        {
            label: "Ledger",
            icon: BookOpen,
        },
        {
            label: "Notifications",
            icon: Bell,
        },
    ];

    return (
        <>
            {mobileOpen && (
                <div
                    className="
                        fixed inset-0 z-40
                        bg-black/30
                        lg:hidden
                    "
                    onClick={() =>
                        setMobileOpen(false)
                    }
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-72
                    flex-col
                    border-r border-green-100
                    bg-white
                    transition-transform
                    duration-300
                    lg:static
                    lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div
                    className="
                        flex h-20
                        items-center
                        justify-between
                        border-b
                        border-green-100
                        px-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex h-10 w-10
                                items-center justify-center
                                rounded-xl
                                bg-green-600
                                text-white
                            "
                        >
                            <Sprout size={22} />
                        </div>

                        <div>
                            <h1
                                className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                "
                            >
                                KrishiConnect
                            </h1>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Farmer Panel
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        className="
                            rounded-lg
                            p-2
                            text-gray-500
                            hover:bg-gray-100
                            lg:hidden
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-4 py-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                onClick={()=>{
                                    if(item.label === "Dashboard"){
                                        navigate("/farmer/dashboard")
                                    }
                                    if(item.label === "My Produce"){
                                        navigate("/farmer/produce")
                                    }
                                    if(item.label === "Market Prices"){
                                        navigate("/farmer/market-prices")
                                    }

                                    setMobileOpen(false);
                                }}
                                className={`
                                    flex w-full
                                    items-center gap-3
                                    rounded-xl
                                    px-4 py-3
                                    text-sm font-medium
                                    transition
                                    ${
                                        item.active
                                            ? "bg-green-50 text-green-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                <Icon size={19} />

                                <span>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-100 p-4">
                    <button
                        onClick={handleLogout}
                        className="
                            flex w-full
                            items-center gap-3
                            rounded-xl
                            px-4 py-3
                            text-sm
                            font-medium
                            text-red-600
                            transition
                            hover:bg-red-50
                        "
                    >
                        <LogOut size={19} />

                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FarmerSidebar;