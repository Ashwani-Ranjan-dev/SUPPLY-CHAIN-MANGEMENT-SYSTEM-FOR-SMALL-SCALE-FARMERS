import {
    ArrowLeft,
    Plus,
    Sprout,
    MapPin,
    CalendarDays,
    IndianRupee,
    Package,
    Loader2,
    Search,
    Pencil,
    Trash2
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMyProduce,
    deleteProduce
} from "../../services/produceservices.js";

const MyProduce = () => {
    const navigate = useNavigate();

    const [produce, setProduce] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");

    const [search, setSearch] =
        useState("");

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const [actionError, setActionError] =
        useState("");


    useEffect(() => {
        const loadProduce = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getMyProduce();

                setProduce(
                    data.produce || []
                );
            } catch (error) {
                console.error(
                    "My produce loading error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load your produce."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduce();
    }, []);

    const filteredProduce =
        useMemo(() => {
            return produce.filter((item) => {
                const matchesFilter =
                    filter === "ALL" ||
                    item.status === filter;

                const matchesSearch =
                    item.crop
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                return (
                    matchesFilter &&
                    matchesSearch
                );
            });
        }, [
            produce,
            filter,
            search,
        ]);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            setActionError("");

            await deleteProduce(
                deleteTarget._id
            );

            setProduce((previous) =>
                previous.map((item) =>
                    item._id ===
                        deleteTarget._id
                        ? {
                            ...item,
                            status: "INACTIVE",
                        }
                        : item
                )
            );

            setDeleteTarget(null);
        } catch (error) {
            setActionError(
                error.message ||
                "Unable to remove listing."
            );
        } finally {
            setDeleting(false);
        }
    };


    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getStatusStyle = (status) => {
        if (status === "ACTIVE") {
            return "bg-green-50 text-green-700";
        }

        if (status === "SOLD") {
            return "bg-blue-50 text-blue-700";
        }

        return "bg-gray-100 text-gray-600";
    };

    if (loading) {
        return (
            <div className="
                flex min-h-screen
                items-center justify-center
                bg-[#f7faf7]
            ">
                <div className="text-center">
                    <Loader2
                        size={38}
                        className="
                            mx-auto
                            animate-spin
                            text-green-600
                        "
                    />

                    <p className="
                        mt-4
                        text-sm
                        font-medium
                        text-gray-500
                    ">
                        Loading your produce...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="
                flex min-h-screen
                items-center justify-center
                bg-[#f7faf7]
                p-6
            ">
                <div className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-red-100
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">
                    <h2 className="
                        text-lg
                        font-bold
                        text-gray-900
                    ">
                        Unable to load produce
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                        className="
                            mt-5
                            rounded-xl
                            bg-green-600
                            px-5 py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-green-700
                        "
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="
            min-h-screen
            bg-[#f7faf7]
            px-4 py-6
            sm:px-6
            lg:px-8
        ">
            <div className="
                mx-auto
                max-w-7xl
            ">
                {/* Header */}

                <div className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                    <div className="
                        flex
                        items-center
                        gap-4
                    ">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/farmer/dashboard"
                                )
                            }
                            className="
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                p-2.5
                                text-gray-600
                                shadow-sm
                                hover:bg-gray-50
                            "
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <div className="
                                flex
                                items-center
                                gap-2
                            ">
                                <Sprout
                                    size={19}
                                    className="text-green-600"
                                />

                                <p className="
                                    text-sm
                                    font-medium
                                    text-green-600
                                ">
                                    Farmer Marketplace
                                </p>
                            </div>

                            <h1 className="
                                mt-1
                                text-2xl
                                font-bold
                                text-gray-900
                            ">
                                My Produce
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                Manage your produce listings
                                and track their status.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/farmer/produce/new"
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-green-600
                            px-5 py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-green-700
                        "
                    >
                        <Plus size={18} />
                        Add Produce
                    </button>
                </div>

                {/* Summary */}

                <div className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-3
                ">
                    <div className="
                        rounded-2xl
                        border
                        border-green-100
                        bg-white
                        p-5
                        shadow-sm
                    ">
                        <p className="
                            text-sm
                            text-gray-500
                        ">
                            Total Listings
                        </p>

                        <p className="
                            mt-2
                            text-2xl
                            font-bold
                            text-gray-900
                        ">
                            {produce.length}
                        </p>
                    </div>

                    <div className="
                        rounded-2xl
                        border
                        border-green-100
                        bg-white
                        p-5
                        shadow-sm
                    ">
                        <p className="
                            text-sm
                            text-gray-500
                        ">
                            Active Listings
                        </p>

                        <p className="
                            mt-2
                            text-2xl
                            font-bold
                            text-green-600
                        ">
                            {
                                produce.filter(
                                    (item) =>
                                        item.status ===
                                        "ACTIVE"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="
                        rounded-2xl
                        border
                        border-green-100
                        bg-white
                        p-5
                        shadow-sm
                    ">
                        <p className="
                            text-sm
                            text-gray-500
                        ">
                            Sold
                        </p>

                        <p className="
                            mt-2
                            text-2xl
                            font-bold
                            text-blue-600
                        ">
                            {
                                produce.filter(
                                    (item) =>
                                        item.status ===
                                        "SOLD"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Filters */}

                <div className="
                    mb-6
                    rounded-2xl
                    border
                    border-green-100
                    bg-white
                    p-4
                    shadow-sm
                ">
                    <div className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    ">
                        <div className="
                            flex
                            flex-wrap
                            gap-2
                        ">
                            {[
                                "ALL",
                                "ACTIVE",
                                "SOLD",
                                "INACTIVE",
                            ].map((item) => (
                                <button
                                    key={item}
                                    onClick={() =>
                                        setFilter(item)
                                    }
                                    className={`
                                        rounded-lg
                                        px-4 py-2
                                        text-xs
                                        font-bold
                                        transition
                                        ${filter ===
                                            item
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="
                            relative
                            w-full
                            lg:max-w-xs
                        ">
                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search crop..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    py-2.5
                                    pl-10
                                    pr-4
                                    text-sm
                                    outline-none
                                    focus:border-green-500
                                    focus:ring-4
                                    focus:ring-green-50
                                "
                            />
                        </div>
                    </div>
                </div>

                {/* Listings */}

                {filteredProduce.length === 0 ? (
                    <div className="
                        rounded-3xl
                        border
                        border-dashed
                        border-green-200
                        bg-white
                        px-6 py-16
                        text-center
                    ">
                        <div className="
                            mx-auto
                            flex
                            h-16 w-16
                            items-center
                            justify-center
                            rounded-full
                            bg-green-50
                            text-green-600
                        ">
                            <Package size={28} />
                        </div>

                        <h2 className="
                            mt-5
                            text-lg
                            font-bold
                            text-gray-900
                        ">
                            No produce found
                        </h2>

                        <p className="
                            mx-auto
                            mt-2
                            max-w-md
                            text-sm
                            text-gray-500
                        ">
                            {produce.length === 0
                                ? "You haven't added any produce yet. Create your first listing to connect with buyers."
                                : "No listing matches your current filter or search."}
                        </p>

                        {produce.length === 0 && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/farmer/produce/new"
                                    )
                                }
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-green-600
                                    px-5 py-3
                                    text-sm
                                    font-bold
                                    text-white
                                    hover:bg-green-700
                                "
                            >
                                <Plus size={18} />
                                Add Your First Produce
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                        xl:grid-cols-3
                    ">
                        {filteredProduce.map(
                            (item) => (
                                <div
                                    key={item._id}
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-green-100
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:-translate-y-1
                                        hover:shadow-md
                                    "
                                >
                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        border-b
                                        border-gray-100
                                        p-5
                                    ">
                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                        ">
                                            <div className="
                                                flex
                                                h-11 w-11
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-green-50
                                                text-green-600
                                            ">
                                                <Sprout
                                                    size={21}
                                                />
                                            </div>

                                            <div>
                                                <h2 className="
                                                    font-bold
                                                    text-gray-900
                                                ">
                                                    {item.crop}
                                                </h2>

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    {item.quality}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`
                                                rounded-full
                                                px-3 py-1
                                                text-[11px]
                                                font-bold
                                                ${getStatusStyle(
                                                item.status
                                            )}
                                            `}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4 p-5">
                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                        ">
                                            <div>
                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    Quantity
                                                </p>

                                                <p className="
                                                    mt-1
                                                    font-bold
                                                    text-gray-900
                                                ">
                                                    {
                                                        item.quantity
                                                    }{" "}
                                                    {
                                                        item.unit
                                                    }
                                                </p>
                                            </div>

                                            <div className="
                                                text-right
                                            ">
                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    Expected Price
                                                </p>

                                                <p className="
                                                    mt-1
                                                    flex
                                                    items-center
                                                    justify-end
                                                    font-bold
                                                    text-gray-900
                                                ">
                                                    <IndianRupee
                                                        size={15}
                                                    />
                                                    {
                                                        item.expectedPrice
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-600
                                        ">
                                            <MapPin
                                                size={16}
                                                className="text-green-600"
                                            />

                                            <span>
                                                {
                                                    item.location
                                                }
                                            </span>
                                        </div>

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-600
                                        ">
                                            <CalendarDays
                                                size={16}
                                                className="text-green-600"
                                            />

                                            <span>
                                                Available from{" "}
                                                {formatDate(
                                                    item.availableFrom
                                                )}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">

                                            <button
                                                type="button"
                                                disabled={
                                                    item.status !== "ACTIVE"
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/farmer/produce/${item._id}/edit`
                                                    )
                                                }
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    item.status !== "ACTIVE"
                                                }
                                                onClick={() =>
                                                    setDeleteTarget(item)
                                                }
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <Trash2 size={22} />
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-gray-900">
                                Remove this listing?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Your listing for{" "}
                                <span className="font-semibold text-gray-700">
                                    {deleteTarget.crop}
                                </span>{" "}
                                will be moved to inactive listings.
                            </p>

                            {actionError && (
                                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {actionError}
                                </div>
                            )}

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={handleDelete}
                                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleting ? "Removing..." : "Remove Listing"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProduce;