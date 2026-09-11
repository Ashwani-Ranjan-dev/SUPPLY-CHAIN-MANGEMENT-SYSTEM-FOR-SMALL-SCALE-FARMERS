import {
    Menu,
    Bell,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const FarmerHeader = ({
    setMobileOpen,
}) => {
    const { user } = useAuth();

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

            <div className="flex items-center gap-4">
                <button
                    className="
                        relative
                        rounded-xl
                        p-2.5
                        text-gray-600
                        hover:bg-gray-100
                    "
                >
                    <Bell size={20} />

                    <span
                        className="
                            absolute right-2 top-2
                            h-2 w-2
                            rounded-full
                            bg-red-500
                        "
                    />
                </button>

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
                            flex h-10 w-10
                            items-center justify-center
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