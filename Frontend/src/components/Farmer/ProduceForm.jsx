// import { useEffect, useState } from "react";
// import {
//     ArrowLeft,
//     CalendarDays,
//     IndianRupee,
//     MapPin,
//     Package,
//     Save,
// } from "lucide-react";

// const defaultValues = {
//     crop: "",
//     quantity: "",
//     unit: "QUINTAL",
//     expectedPrice: "",
//     location: "",
//     quality: "STANDARD",
//     availableFrom: "",
//     description: "",
// };

// const ProduceForm = ({
//     initialValues = defaultValues,
//     onSubmit,
//     loading = false,
//     error = "",
//     title = "Add New Produce",
//     subtitle = "Create a listing for buyers to discover your produce.",
//     submitLabel = "Create Listing",
//     onCancel,
// }) => {
//     const [form, setForm] =
//         useState(initialValues);

//     const [validationError, setValidationError] =
//         useState("");

//     useEffect(() => {
//         setForm(initialValues);
//     }, [initialValues]);

//     const handleChange = (event) => {
//         const { name, value } =
//             event.target;

//         setForm((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         setValidationError("");

//         if (
//             !form.crop.trim() ||
//             form.quantity === "" ||
//             !form.unit ||
//             form.expectedPrice === "" ||
//             !form.location.trim() ||
//             !form.availableFrom
//         ) {
//             setValidationError(
//                 "Please fill all required fields."
//             );
//             return;
//         }

//         if (Number(form.quantity) <= 0) {
//             setValidationError(
//                 "Quantity must be greater than zero."
//             );
//             return;
//         }

//         if (Number(form.expectedPrice) < 0) {
//             setValidationError(
//                 "Expected price cannot be negative."
//             );
//             return;
//         }

//         await onSubmit({
//             ...form,
//             quantity: Number(form.quantity),
//             expectedPrice:
//                 Number(form.expectedPrice),
//         });
//     };

//     const inputClass =
//         "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100";

//     const labelClass =
//         "mb-2 block text-sm font-semibold text-gray-700";

//     return (
//         <div className="min-h-screen bg-[#f7faf7]">
//             <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

//                 <button
//                     type="button"
//                     onClick={onCancel}
//                     className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700"
//                 >
//                     <ArrowLeft size={17} />
//                     Back to My Produce
//                 </button>

//                 <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

//                     <div className="border-b border-gray-100 bg-green-50/70 px-6 py-6 sm:px-8">
//                         <div className="flex items-start gap-4">
//                             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
//                                 <Package size={23} />
//                             </div>

//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-900">
//                                     {title}
//                                 </h1>

//                                 <p className="mt-1 text-sm text-gray-500">
//                                     {subtitle}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <form
//                         onSubmit={handleSubmit}
//                         className="space-y-7 p-6 sm:p-8"
//                     >

//                         {(error || validationError) && (
//                             <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
//                                 {validationError || error}
//                             </div>
//                         )}

//                         <div>
//                             <h2 className="mb-4 text-base font-bold text-gray-900">
//                                 Produce Details
//                             </h2>

//                             <div className="grid gap-5 md:grid-cols-2">

//                                 <div>
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Crop Name *
//                                     </label>

//                                     <input
//                                         name="crop"
//                                         value={form.crop}
//                                         onChange={
//                                             handleChange
//                                         }
//                                         placeholder="e.g. Wheat"
//                                         className={
//                                             inputClass
//                                         }
//                                     />
//                                 </div>

//                                 <div>
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Quantity *
//                                     </label>

//                                     <input
//                                         type="number"
//                                         name="quantity"
//                                         min="0.1"
//                                         step="0.1"
//                                         value={
//                                             form.quantity
//                                         }
//                                         onChange={
//                                             handleChange
//                                         }
//                                         placeholder="e.g. 50"
//                                         className={
//                                             inputClass
//                                         }
//                                     />
//                                 </div>

//                                 <div>
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Unit *
//                                     </label>

//                                     <select
//                                         name="unit"
//                                         value={form.unit}
//                                         onChange={
//                                             handleChange
//                                         }
//                                         className={
//                                             inputClass
//                                         }
//                                     >
//                                         <option value="KG">
//                                             Kilogram
//                                         </option>

//                                         <option value="QUINTAL">
//                                             Quintal
//                                         </option>

//                                         <option value="TON">
//                                             Ton
//                                         </option>
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Expected Price *
//                                     </label>

//                                     <div className="relative">
//                                         <IndianRupee
//                                             size={17}
//                                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                                         />

//                                         <input
//                                             type="number"
//                                             name="expectedPrice"
//                                             min="0"
//                                             step="0.01"
//                                             value={
//                                                 form.expectedPrice
//                                             }
//                                             onChange={
//                                                 handleChange
//                                             }
//                                             placeholder="Price per unit"
//                                             className={`${inputClass} pl-11`}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Location *
//                                     </label>

//                                     <div className="relative">
//                                         <MapPin
//                                             size={17}
//                                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                                         />

//                                         <input
//                                             name="location"
//                                             value={
//                                                 form.location
//                                             }
//                                             onChange={
//                                                 handleChange
//                                             }
//                                             placeholder="Village / Market"
//                                             className={`${inputClass} pl-11`}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Quality
//                                     </label>

//                                     <select
//                                         name="quality"
//                                         value={
//                                             form.quality
//                                         }
//                                         onChange={
//                                             handleChange
//                                         }
//                                         className={
//                                             inputClass
//                                         }
//                                     >
//                                         <option value="STANDARD">
//                                             Standard
//                                         </option>

//                                         <option value="GOOD">
//                                             Good
//                                         </option>

//                                         <option value="PREMIUM">
//                                             Premium
//                                         </option>
//                                     </select>
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Available From *
//                                     </label>

//                                     <div className="relative">
//                                         <CalendarDays
//                                             size={17}
//                                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                                         />

//                                         <input
//                                             type="date"
//                                             name="availableFrom"
//                                             value={
//                                                 form.availableFrom
//                                             }
//                                             onChange={
//                                                 handleChange
//                                             }
//                                             className={`${inputClass} pl-11`}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label
//                                         className={labelClass}
//                                     >
//                                         Description
//                                     </label>

//                                     <textarea
//                                         name="description"
//                                         value={
//                                             form.description
//                                         }
//                                         onChange={
//                                             handleChange
//                                         }
//                                         rows="4"
//                                         placeholder="Add details about your produce, quality, harvesting, etc."
//                                         className={`${inputClass} resize-none`}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

//                             <button
//                                 type="button"
//                                 onClick={onCancel}
//                                 className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//                             >
//                                 <Save size={17} />

//                                 {loading
//                                     ? "Saving..."
//                                     : submitLabel}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProduceForm;


import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    IndianRupee,
    MapPin,
    Package,
    Save,
    Image as ImageIcon,
    Upload,
    X,
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

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
    const [form, setForm] = useState(initialValues);
    const [validationError, setValidationError] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        initialValues.imageUrl || ""
    );
    const [imageError, setImageError] = useState("");

    useEffect(() => {
        setForm(initialValues);
        setSelectedImage(null);
        setImagePreview(initialValues.imageUrl || "");
        setImageError("");
        setValidationError("");
    }, [initialValues]);

    // Release temporary browser image URLs when they change or the
    // component unmounts. Cloudinary URLs are not revoked.
    useEffect(() => {
        return () => {
            if (imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        setImageError("");

        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setImageError(
                "Please select a JPG, PNG, or WEBP image."
            );
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setImageError(
                "Image size must not exceed 5 MB."
            );
            event.target.value = "";
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(form.imageUrl || "");
        setImageError("");

        const fileInput = document.getElementById(
            "produce-image"
        );

        if (fileInput) {
            fileInput.value = "";
        }
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

        if (imageError) {
            setValidationError(
                "Please correct the image selection before saving."
            );
            return;
        }

        await onSubmit({
            ...form,
            quantity: Number(form.quantity),
            expectedPrice: Number(form.expectedPrice),
            image: selectedImage,
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
                                    <label className={labelClass}>
                                        Crop Name *
                                    </label>

                                    <input
                                        name="crop"
                                        value={form.crop}
                                        onChange={handleChange}
                                        placeholder="e.g. Wheat"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
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
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Unit *
                                    </label>

                                    <select
                                        name="unit"
                                        value={form.unit}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
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
                                    <label className={labelClass}>
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
                                            value={form.expectedPrice}
                                            onChange={handleChange}
                                            placeholder="Price per unit"
                                            className={`${inputClass} pl-11`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Location *
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="Village / Market"
                                            className={`${inputClass} pl-11`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Quality
                                    </label>

                                    <select
                                        name="quality"
                                        value={form.quality}
                                        onChange={handleChange}
                                        className={inputClass}
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
                                    <label className={labelClass}>
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
                                            value={form.availableFrom}
                                            onChange={handleChange}
                                            className={`${inputClass} pl-11`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Produce image upload */}
                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Produce Image
                                    </label>

                                    <p className="mb-3 text-sm text-gray-500">
                                        Upload a clear photo of your crop.
                                        JPG, PNG, or WEBP, up to 5 MB.
                                    </p>

                                    {imagePreview ? (
                                        <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-gray-50">
                                            <img
                                                src={imagePreview}
                                                alt={`${form.crop || "Produce"} preview`}
                                                className="h-64 w-full object-cover sm:h-80"
                                            />

                                            <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
                                                Image preview
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleRemoveSelectedImage}
                                                disabled={loading}
                                                className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-gray-700 shadow hover:bg-white disabled:opacity-50"
                                            >
                                                <X size={15} />
                                                {selectedImage
                                                    ? "Undo selection"
                                                    : "Keep current image"}
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="produce-image"
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-10 text-center transition hover:border-green-400 hover:bg-green-50"
                                        >
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                <ImageIcon size={26} />
                                            </div>

                                            <span className="mt-4 font-semibold text-gray-800">
                                                Choose a produce image
                                            </span>

                                            <span className="mt-1 text-sm text-gray-500">
                                                Browse images from your device
                                            </span>

                                            <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white">
                                                <Upload size={16} />
                                                Select Image
                                            </span>
                                        </label>
                                    )}

                                    <input
                                        id="produce-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />

                                    {imagePreview && (
                                        <label
                                            htmlFor="produce-image"
                                            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                                        >
                                            <Upload size={16} />
                                            {selectedImage
                                                ? "Choose another image"
                                                : "Replace image"}
                                        </label>
                                    )}

                                    {imageError && (
                                        <p className="mt-2 text-sm font-medium text-red-600">
                                            {imageError}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
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
                                disabled={loading}
                                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={17} />
                                {loading ? "Saving..." : submitLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProduceForm;
