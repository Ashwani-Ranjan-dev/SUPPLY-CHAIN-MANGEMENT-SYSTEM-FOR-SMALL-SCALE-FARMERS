import { useState } from "react";

import BuyerSidebar from "../components/Buyer/BuyerSidebar";
import BuyerHeader from "../components/Buyer/Buyerheader";

const BuyerLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f5faf5]">
            <BuyerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-72">
                <BuyerHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="min-h-[calc(100vh-5rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default BuyerLayout;