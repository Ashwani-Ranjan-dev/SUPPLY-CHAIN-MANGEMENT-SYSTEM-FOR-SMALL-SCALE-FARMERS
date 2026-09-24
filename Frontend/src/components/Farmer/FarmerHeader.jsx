import {
    Menu,
    Bell,
} from "lucide-react";

import {useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
    getUnreadNotificationCount,
} from "../../services/notificationServices";

const FarmerHeader = ({
    setMobileOpen,
}) => {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);

    // Load unread notification count
    const loadUnreadCount = async () => {
        try {
            const data = await getUnreadNotificationCount();

            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error(
                "Error loading unread notification count:",
                error
            );
        }
    };

    // Load count when header mounts
    useEffect(() => {
        loadUnreadCount();
    }, []);

    return (
        <header
            className="
                flex h-20
                items-center
                justify-between
                border-b
                border-green-100
                bg-white
                px-4 sm:px-6 lg:px-8
            "
        >
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() =>
                        setMobileOpen(true)
                    }
                    className="
                        rounded-xl
                        p-2
                        text-gray-600
                        hover:bg-gray-100
                        lg:hidden
                    "
                >
                    <Menu size={22} />
                </button>

                <div>
                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        Farmer Dashboard
                    </p>

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-900
                        "
                    >
                        Welcome back
                    </h2>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                {/* Notification Button */}
                <button
                    onClick={() =>
                        navigate("/farmer/notifications")
                    }
                    className="
                        relative
                        rounded-xl
                        p-2.5
                        text-gray-600
                        hover:bg-gray-100
                    "
                >
                    <Bell size={20} />

                    {unreadCount > 0 && (
                        <span
                            className="
                                absolute
                                -right-1
                                -top-1
                                flex
                                h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-red-500
                                px-1
                                text-[10px]
                                font-bold
                                text-white
                            "
                        >
                            {unreadCount > 99
                                ? "99+"
                                : unreadCount}
                        </span>
                    )}
                </button>

                {/* Farmer Profile */}
                <div
                    className="
                        hidden
                        items-center
                        gap-3
                        sm:flex
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-green-100
                            font-bold
                            text-green-700
                        "
                    >
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <div>
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-gray-900
                            "
                        >
                            {user?.name}
                        </p>

                        <p
                            className="
                                text-xs
                                text-gray-500
                            "
                        >
                            {user?.village}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FarmerHeader;