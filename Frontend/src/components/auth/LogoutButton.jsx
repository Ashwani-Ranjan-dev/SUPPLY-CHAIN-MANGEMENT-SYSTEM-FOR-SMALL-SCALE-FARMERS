import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
    const { logout } = useAuth();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();

            navigate("/login", {
                replace: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-100
                bg-red-50
                px-4
                py-2.5
                text-sm
                font-semibold
                text-red-600
                transition
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
        >
            {loading ? (
                <>
                    <Loader2
                        size={17}
                        className="animate-spin"
                    />
                    Logging out...
                </>
            ) : (
                <>
                    <LogOut size={17} />
                    Logout
                </>
            )}
        </button>
    );
};

export default LogoutButton;