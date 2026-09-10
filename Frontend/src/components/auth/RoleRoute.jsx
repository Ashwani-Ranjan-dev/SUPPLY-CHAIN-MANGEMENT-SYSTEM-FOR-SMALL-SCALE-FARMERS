import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                    <p className="text-sm font-medium text-gray-500">
                        Checking your access...
                    </p>
                </div>
            </div>
        );
    }

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User role is not allowed
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;