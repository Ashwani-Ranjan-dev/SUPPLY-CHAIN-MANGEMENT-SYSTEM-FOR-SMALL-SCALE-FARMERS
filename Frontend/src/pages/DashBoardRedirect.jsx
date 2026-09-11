import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
    const { user } = useAuth();

    const role = user.role?.toUpperCase();

    if (role === "FARMER") {
        return (
            <Navigate
                to="/farmer/dashboard"
                replace
            />
        );
    }

    if (role === "BUYER") {
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