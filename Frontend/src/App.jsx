import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import BuyerDashboard from "./pages/Buyer/buyerDashboard";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard";
import Unauthorized from "./pages/Unauthorized";
import DashboardRedirect from "./pages/DashBoardRedirect"; 
import AddProduce from "./pages/Farmer/AddProducePage";
import MyProduce from "./pages/Farmer/MyProduce";

const App = () => {
    return (
        <AuthProvider> {/* Wrap the router or entire app tree here */}
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardRedirect />} />

                        <Route element={<RoleRoute allowedRoles={["FARMER"]} />}>
                            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                            <Route path="/farmer/produce/new" element={<AddProduce/>}/>
                            <Route path="/farmer/produce" element={<MyProduce/>}/>
                        </Route>

                        <Route element={<RoleRoute allowedRoles={["BUYER"]} />}>
                            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;