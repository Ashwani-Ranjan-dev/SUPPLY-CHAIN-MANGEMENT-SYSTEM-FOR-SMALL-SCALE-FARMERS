import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    IndianRupee,
    MapPin,
    Package,
    Save,
} from "lucide-react";

const defaultValues = {
    crop: "",
    quantity: "",
    unit: "QUINTAL",
    expectedPrice: "",
    location: "",
    quality: "STANDARD",
    availableFrom: "",
    description: "",
};

const ProduceForm = ({
    initialValues = defaultValues,
    onSubmit,
    loading = false,
    error = "",
    title = "Add New Produce",
    subtitle = "Create a listing for buyers to discover your produce.",
    submitLabel = "Create Listing",
    onCancel,
}) => {
    const [form, setForm] =
        useState(initialValues);

    const [validationError, setValidationError] =
        useState("");

    useEffect(() => {
        setForm(initialValues);
    }, [initialValues]);

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

        setValidationError("");

        if (
            !form.crop.trim() ||
            form.quantity === "" ||
            !form.unit ||
            form.expectedPrice === "" ||
            !form.location.trim() ||
            !form.availableFrom
        ) {
            setValidationError(
                "Please fill all required fields."
            );
            return;
        }

        if (Number(form.quantity) <= 0) {
            setValidationError(
                "Quantity must be greater than zero."
            );
            return;
        }

        if (Number(form.expectedPrice) < 0) {
            setValidationError(
                "Expected price cannot be negative."
            );
            return;
        }

        await onSubmit({
            ...form,
            quantity: Number(form.quantity),
            expectedPrice:
                Number(form.expectedPrice),
        });
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    return (
        <div className="min-h-screen bg-[#f7faf7]">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                <button
                    type="button"
                    onClick={onCancel}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700"
                >
                    <ArrowLeft size={17} />
                    Back to My Produce
                </button>

                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

                    <div className="border-b border-gray-100 bg-green-50/70 px-6 py-6 sm:px-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <Package size={23} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {title}
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-7 p-6 sm:p-8"
                    >

                        {(error || validationError) && (
                            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {validationError || error}
                            </div>
                        )}

                        <div>
                            <h2 className="mb-4 text-base font-bold text-gray-900">
                                Produce Details
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label
                                        className={labelClass}
                                    >
                                        Crop Name *
                                    </label>

                                    <input
                                        name="crop"
                                        value={form.crop}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Wheat"
                                        className={
                                            inputClass
                                        }
                                    />
                                </div>

                                <div>
                                    <label
                                        className={labelClass}
                                    >
                                        Quantity *
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0.1"
                                        step="0.1"
                                        value={
                                            form.quantity
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 50"
                                        className={
                                            inputClass
                                        }
                                    />
                                </div>

                                <div>
                                    <label
                                        className={labelClass}
                                    >
                                        Unit *
                                    </label>

                                    <select
                                        name="unit"
                                        value={form.unit}
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option value="KG">
                                            Kilogram
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
                                    <label
                                        className={labelClass}
                                    >
                                        Expected Price *
                                    </label>

                                    <div className="relative">
                                        <IndianRupee
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

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
                                            placeholder="Price per unit"
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className={labelClass}
                                    >
                                        Location *
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            name="location"
                                            value={
                                                form.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Village / Market"
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className={labelClass}
                                    >
                                        Quality
                                    </label>

                                    <select
                                        name="quality"
                                        value={
                                            form.quality
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option value="STANDARD">
                                            Standard
                                        </option>

                                        <option value="GOOD">
                                            Good
                                        </option>

                                        <option value="PREMIUM">
                                            Premium
                                        </option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        className={labelClass}
                                    >
                                        Available From *
                                    </label>

                                    <div className="relative">
                                        <CalendarDays
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="date"
                                            name="availableFrom"
                                            value={
                                                form.availableFrom
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        className={labelClass}
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        placeholder="Add details about your produce, quality, harvesting, etc."
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={17} />

                                {loading
                                    ? "Saving..."
                                    : submitLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProduceForm;