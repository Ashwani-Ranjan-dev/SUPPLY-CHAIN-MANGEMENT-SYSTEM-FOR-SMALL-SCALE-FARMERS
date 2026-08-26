import {
    Leaf,
    Sprout,
    ShoppingBasket,
} from "lucide-react";

const AuthBrandPanel = () => {
    return (
        <section className="
            relative
            hidden
            overflow-hidden
            bg-gradient-to-br
            from-green-700
            via-green-600
            to-emerald-500
            lg:flex
            lg:w-[48%]
            xl:w-1/2
        ">
            {/* Decorative circles */}
            <div className="
                absolute
                -left-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-white/10
            " />

            <div className="
                absolute
                -bottom-32
                -right-20
                h-96
                w-96
                rounded-full
                bg-white/10
            " />

            {/* Decorative leaf */}
            <Leaf
                className="
                    absolute
                    right-12
                    top-12
                    h-16
                    w-16
                    rotate-12
                    text-white/20
                "
            />

            <div className="
                relative
                z-10
                flex
                w-full
                flex-col
                justify-between
                p-12
                xl:p-16
            ">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        shadow-lg
                    ">
                        <Sprout className="h-6 w-6 text-green-600" />
                    </div>

                    <span className="
                        text-xl
                        font-bold
                        tracking-tight
                        text-white
                    ">
                        KrishiConnect
                    </span>
                </div>

                {/* Main content */}
                <div className="max-w-lg">
                    <div className="
                        mb-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/20
                        bg-white/10
                        px-4
                        py-2
                        text-sm
                        text-white
                        backdrop-blur-sm
                    ">
                        <Sprout className="h-4 w-4" />
                        Smart Agriculture Marketplace
                    </div>

                    <h1 className="
                        text-4xl
                        font-bold
                        leading-tight
                        text-white
                        xl:text-5xl
                    ">
                        From the farm,
                        <br />
                        directly to the market.
                    </h1>

                    <p className="
                        mt-6
                        max-w-md
                        text-base
                        leading-7
                        text-green-50/90
                    ">
                        KrishiConnect brings farmers and buyers
                        together through a transparent and
                        technology-driven agricultural marketplace.
                    </p>

                    <div className="
                        mt-8
                        grid
                        grid-cols-2
                        gap-4
                    ">
                        <div className="
                            rounded-2xl
                            border
                            border-white/15
                            bg-white/10
                            p-4
                            backdrop-blur-sm
                        ">
                            <Sprout className="mb-3 h-6 w-6 text-white" />

                            <p className="text-sm font-semibold text-white">
                                Empower Farmers
                            </p>

                            <p className="mt-1 text-xs leading-5 text-green-50/70">
                                Better access to buyers and markets.
                            </p>
                        </div>

                        <div className="
                            rounded-2xl
                            border
                            border-white/15
                            bg-white/10
                            p-4
                            backdrop-blur-sm
                        ">
                            <ShoppingBasket className="mb-3 h-6 w-6 text-white" />

                            <p className="text-sm font-semibold text-white">
                                Connect Buyers
                            </p>

                            <p className="mt-1 text-xs leading-5 text-green-50/70">
                                Discover quality agricultural produce.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-sm text-green-50/60">
                    Building a more connected agricultural ecosystem.
                </p>
            </div>
        </section>
    );
};

export default AuthBrandPanel;