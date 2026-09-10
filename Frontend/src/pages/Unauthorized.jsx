import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5faf5] px-5">

            <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                    <ShieldAlert className="h-8 w-8 text-red-500" />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Access Denied
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    You don't have permission to access this section
                    of KrishiConnect.
                </p>

                <Link
                    to="/dashboard"
                    className="mt-7 inline-flex rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                    Go to My Dashboard
                </Link>

            </div>

        </main>
    );
};

export default Unauthorized;