import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext";

const ProtectedRoute = () => {
    const {
        user,
        loading,
    } = useAuth();

    const location =
        useLocation();

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[#f7faf7]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-4
                    "
                >
                    <div
                        className="
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-green-100
                            border-t-green-600
                        "
                    />

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >
                        Checking your session...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;