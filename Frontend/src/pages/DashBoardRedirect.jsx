import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
    const { user } = useAuth();

    if (user?.role === "FARMER") {
        return (
            <Navigate
                to="/farmer/dashboard"
                replace
            />
        );
    }

    if (user?.role === "BUYER") {
        return (
            <Navigate
                to="/buyer/dashboard"
                replace
            />
        );
    }

    return (
        <Navigate
            to="/unauthorized"
            replace
        />
    );
};

export default DashboardRedirect;