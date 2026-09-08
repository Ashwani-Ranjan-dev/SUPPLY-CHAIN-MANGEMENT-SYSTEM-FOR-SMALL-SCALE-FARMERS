import {
    useAuth,
} from "../context/Authcontext";

const Dashboard = () => {
    const { user } =
        useAuth();

    return (
        <main
            className="
                min-h-screen
                bg-[#f7faf7]
                p-6
            "
        >
            <div
                className="
                    mx-auto
                    max-w-6xl
                "
            >
                <div
                    className="
                        rounded-3xl
                        bg-white
                        p-8
                        shadow-sm
                    "
                >
                    <p
                        className="
                            text-sm
                            font-semibold
                            text-green-600
                        "
                    >
                        KRISHICONNECT
                    </p>

                    <h1
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Welcome,{" "}
                        {user?.name}
                    </h1>

                    <p
                        className="
                            mt-3
                            text-gray-500
                        "
                    >
                        You are logged in as{" "}
                        <span
                            className="
                                font-semibold
                                text-gray-800
                            "
                        >
                            {user?.role}
                        </span>
                        .
                    </p>

                    <div
                        className="
                            mt-8
                            rounded-2xl
                            bg-green-50
                            p-5
                        "
                    >
                        <p
                            className="
                                text-sm
                                text-green-800
                            "
                        >
                            Authentication is
                            working successfully.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;