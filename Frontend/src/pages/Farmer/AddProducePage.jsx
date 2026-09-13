import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Package,
    IndianRupee,
    Sprout,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createProduce,
} from "../../services/produceservices";

const AddProduce = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        crop: "",
        quantity: "",
        unit: "QUINTAL",
        expectedPrice: "",
        location: "",
        quality: "STANDARD",
        availableFrom: "",
        description: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.crop.trim() ||
            !form.quantity ||
            !form.expectedPrice ||
            !form.location.trim() ||
            !form.availableFrom
        ) {
            setError(
                "Please fill all required fields."
            );
            return;
        }

        try {
            setLoading(true);

            await createProduce(form);

            setSuccess(
                "Your produce listing has been created successfully."
            );

            setTimeout(() => {
                navigate(
                    "/farmer/dashboard"
                );
            }, 1200);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to create listing."
            );
        } finally {
            setLoading(false);
        }
    };

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
                max-w-4xl
            ">
                {/* Header */}

                <div className="
                    mb-6
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
                            transition
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
                                size={20}
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
                            Add New Produce
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            Create a listing and connect
                            directly with buyers.
                        </p>
                    </div>
                </div>

                {/* Form Card */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        rounded-3xl
                        border
                        border-green-100
                        bg-white
                        p-5
                        shadow-sm
                        sm:p-8
                    "
                >
                    {/* Alerts */}

                    {error && (
                        <div className="
                            mb-6
                            rounded-xl
                            border
                            border-red-100
                            bg-red-50
                            px-4 py-3
                            text-sm
                            font-medium
                            text-red-600
                        ">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="
                            mb-6
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-green-100
                            bg-green-50
                            px-4 py-3
                            text-sm
                            font-medium
                            text-green-700
                        ">
                            <CheckCircle2 size={18} />
                            {success}
                        </div>
                    )}

                    {/* Basic Information */}

                    <div className="mb-8">
                        <div className="
                            mb-5
                            flex
                            items-center
                            gap-3
                        ">
                            <div className="
                                flex
                                h-10 w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                                text-green-600
                            ">
                                <Package size={20} />
                            </div>

                            <div>
                                <h2 className="
                                    font-bold
                                    text-gray-900
                                ">
                                    Produce Details
                                </h2>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Tell buyers about your produce.
                                </p>
                            </div>
                        </div>

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            sm:grid-cols-2
                        ">
                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    Crop Name *
                                </label>

                                <input
                                    type="text"
                                    name="crop"
                                    value={form.crop}
                                    onChange={handleChange}
                                    placeholder="e.g. Wheat"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-200
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-green-500
                                        focus:ring-4
                                        focus:ring-green-50
                                    "
                                />
                            </div>

                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="0.1"
                                    step="0.1"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="e.g. 50"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-200
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-green-500
                                        focus:ring-4
                                        focus:ring-green-50
                                    "
                                />
                            </div>

                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    Unit *
                                </label>

                                <select
                                    name="unit"
                                    value={form.unit}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-green-500
                                        focus:ring-4
                                        focus:ring-green-50
                                    "
                                >
                                    <option value="KG">
                                        Kilogram (KG)
                                    </option>

                                    <option value="QUINTAL">
                                        Quintal
                                    </option>

                                    <option value="TON">
                                        Ton
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-1
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    <IndianRupee size={15} />
                                    Expected Price *
                                </label>

                                <input
                                    type="number"
                                    name="expectedPrice"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.expectedPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 2450"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-200
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-green-500
                                        focus:ring-4
                                        focus:ring-green-50
                                    "
                                />

                                <p className="
                                    mt-1.5
                                    text-xs
                                    text-gray-400
                                ">
                                    Price per selected unit
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Availability */}

                    <div className="
                        mb-8
                        border-t
                        border-gray-100
                        pt-8
                    ">
                        <div className="
                            mb-5
                            flex
                            items-center
                            gap-3
                        ">
                            <div className="
                                flex
                                h-10 w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                                text-green-600
                            ">
                                <MapPin size={20} />
                            </div>

                            <div>
                                <h2 className="
                                    font-bold
                                    text-gray-900
                                ">
                                    Availability
                                </h2>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Help buyers understand where
                                    and when they can collect.
                                </p>
                            </div>
                        </div>

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            sm:grid-cols-2
                        ">
                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    Location *
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Village / Market location"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-200
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-green-500
                                        focus:ring-4
                                        focus:ring-green-50
                                    "
                                />
                            </div>

                            <div>
                                <label className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-1
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    <CalendarDays size={15} />
                                    Available From *
                                </label>

                                <input
                                    type="date"
                                    name="availableFrom"
                                    value={
                                        form.availableFrom
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-200
                                        px-4 py-3
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

                    {/* Quality */}

                    <div className="
                        mb-8
                        border-t
                        border-gray-100
                        pt-8
                    ">
                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Produce Quality
                        </label>

                        <div className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-3
                        ">
                            {[
                                {
                                    value: "STANDARD",
                                    label: "Standard",
                                },
                                {
                                    value: "GOOD",
                                    label: "Good",
                                },
                                {
                                    value: "PREMIUM",
                                    label: "Premium",
                                },
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() =>
                                        setForm(
                                            (previous) => ({
                                                ...previous,
                                                quality:
                                                    item.value,
                                            })
                                        )
                                    }
                                    className={`
                                        rounded-xl
                                        border
                                        px-4 py-3
                                        text-sm
                                        font-semibold
                                        transition
                                        ${
                                            form.quality ===
                                            item.value
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : "border-gray-200 text-gray-600 hover:border-green-200"
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}

                    <div className="
                        border-t
                        border-gray-100
                        pt-8
                    ">
                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Additional Information
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Add details about harvesting, quality, packaging, etc."
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-gray-200
                                px-4 py-3
                                text-sm
                                outline-none
                                focus:border-green-500
                                focus:ring-4
                                focus:ring-green-50
                            "
                        />
                    </div>

                    {/* Submit */}

                    <div className="
                        mt-8
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-gray-100
                        pt-6
                        sm:flex-row
                        sm:justify-end
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
                                px-6 py-3
                                text-sm
                                font-semibold
                                text-gray-600
                                hover:bg-gray-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-green-600
                                px-7 py-3
                                text-sm
                                font-bold
                                text-white
                                transition
                                hover:bg-green-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sprout size={18} />
                                    Create Listing
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduce;