import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    logoutUser,
} from "../services/authServices.js";

const AuthContext =
    createContext(null);

export const AuthProvider = ({
    children,
}) => {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const checkAuth =
        async () => {
            try {
                const data =
                    await getCurrentUser();

                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async()=>{
            try{
                await logoutUser();
            }
            catch(error){
                console.error("Logout error: " , error);
            }
            finally{
                setUser(null);
            }
        }

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated:
            Boolean(user),
        checkAuth,
        logout,
    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};