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
import EditProduce from "./pages/Farmer/EditProduce";
import MarketPrices from "./pages/Farmer/MarketPrice";
import FarmerDeals from "./pages/Farmer/FarmerDeal";
import FarmerPayments from "./pages/Farmer/FarmerPayments";
import FarmerDeliveries from "./pages/Farmer/FarmerDeliveries";
import FarmerLedger from "./pages/Farmer/Farmerledger";
import Notifications from "./pages/Farmer/Notifications"
import FarmerProfile from "./pages/Farmer/FarmerProfile";
import BuyerDeals from "./pages/Buyer/BuyerDeal";
import BuyerLayout from "./layouts/Buyerlayout";
import BuyerProfile from "./pages/Buyer/Buyerprofile";
import BuyerMarketplace from "./pages/Buyer/BuyerMarketPlace";
import BuyerProduceDetails from "./pages/Buyer/BuyerProduceDetail";
import CreateDeal from "./pages/Buyer/CreateDeal";
import BuyerPayments from "./pages/Buyer/BuyerPayment";
import BuyerDeliveries from "./pages/Buyer/BuyerDeliveries";
import BuyerNotifications from "./pages/Buyer/BuyerNotifications";

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

                    {/* Farmer Routes */}
                        <Route element={<RoleRoute allowedRoles={["FARMER"]} />}>
                            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                            <Route path="/farmer/produce/new" element={<AddProduce />} />
                            <Route path="/farmer/produce" element={<MyProduce />} />
                            <Route path="/farmer/produce/:id/edit" element={<EditProduce />} />
                            <Route path="/farmer/market-prices" element={<MarketPrices />} />
                            <Route path="/farmer/deals" element={<FarmerDeals />} />
                            <Route path="/farmer/deliveries" element={<FarmerDeliveries />} />
                            <Route path="/farmer/payments" element={<FarmerPayments />} />
                            <Route path="/farmer/ledger" element={<FarmerLedger />} />
                            <Route path="/farmer/notifications" element={<Notifications />} />
                            <Route path="/farmer/profile" element={<FarmerProfile />} />
                        </Route>

                        {/* Buyer Routes */}
                        <Route element={<RoleRoute allowedRoles={["BUYER"]} />}>
                            <Route path="/buyer/dashboard" element={<BuyerLayout><BuyerDashboard /></BuyerLayout>}/>
                            <Route path="/buyer/deals" element={<BuyerLayout><BuyerDeals /></BuyerLayout>}/>
                            <Route path="/buyer/profile" element={<BuyerLayout><BuyerProfile/></BuyerLayout>}/>
                            <Route path="/buyer/produce" element={<BuyerLayout><BuyerMarketplace/></BuyerLayout>}/>
                            <Route path="/buyer/produce/:id" element={<BuyerLayout><BuyerProduceDetails/></BuyerLayout>}/>
                            <Route path="/buyer/produce/:id/deal" element={<BuyerLayout><CreateDeal/></BuyerLayout>}/>
                            <Route path="/buyer/payments" element={<BuyerLayout><BuyerPayments/></BuyerLayout>}/>
                            <Route path="/buyer/deliveries" element={<BuyerLayout><BuyerDeliveries/></BuyerLayout>}/>
                            <Route path="/buyer/notifications" element={<BuyerLayout><BuyerNotifications/></BuyerLayout>}/>
                        </Route>

                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;