// import { useEffect, useState } from "react";
// import {
//     ArrowLeft,
//     CalendarDays,
//     IndianRupee,
//     MapPin,
//     Package,
//     Save,
//     Image as ImageIcon,
//     Upload,
//     X,
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

// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// const ALLOWED_IMAGE_TYPES = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
// ];

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
//     const [form, setForm] = useState(initialValues);
//     const [validationError, setValidationError] = useState("");

//     const [selectedImage, setSelectedImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(
//         initialValues.imageUrl || ""
//     );
//     const [imageError, setImageError] = useState("");

//     useEffect(() => {
//         setForm(initialValues);
//         setSelectedImage(null);
//         setImagePreview(initialValues.imageUrl || "");
//         setImageError("");
//         setValidationError("");
//     }, [initialValues]);

//     // Release temporary browser image URLs when they change or the
//     // component unmounts. Cloudinary URLs are not revoked.
//     useEffect(() => {
//         return () => {
//             if (imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);

//     const handleChange = (event) => {
//         const { name, value } = event.target;

//         setForm((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };

//     const handleImageChange = (event) => {
//         const file = event.target.files?.[0];

//         setImageError("");

//         if (!file) return;

//         if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//             setImageError(
//                 "Please select a JPG, PNG, or WEBP image."
//             );
//             event.target.value = "";
//             return;
//         }

//         if (file.size > MAX_IMAGE_SIZE) {
//             setImageError(
//                 "Image size must not exceed 5 MB."
//             );
//             event.target.value = "";
//             return;
//         }

//         setSelectedImage(file);
//         setImagePreview(URL.createObjectURL(file));
//     };

//     const handleRemoveSelectedImage = () => {
//         setSelectedImage(null);
//         setImagePreview(form.imageUrl || "");
//         setImageError("");

//         const fileInput = document.getElementById(
//             "produce-image"
//         );

//         if (fileInput) {
//             fileInput.value = "";
//         }
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

//         if (imageError) {
//             setValidationError(
//                 "Please correct the image selection before saving."
//             );
//             return;
//         }

//         await onSubmit({
//             ...form,
//             quantity: Number(form.quantity),
//             expectedPrice: Number(form.expectedPrice),
//             image: selectedImage,
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
//                                     <label className={labelClass}>
//                                         Crop Name *
//                                     </label>

//                                     <input
//                                         name="crop"
//                                         value={form.crop}
//                                         onChange={handleChange}
//                                         placeholder="e.g. Wheat"
//                                         className={inputClass}
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className={labelClass}>
//                                         Quantity *
//                                     </label>

//                                     <input
//                                         type="number"
//                                         name="quantity"
//                                         min="0.1"
//                                         step="0.1"
//                                         value={form.quantity}
//                                         onChange={handleChange}
//                                         placeholder="e.g. 50"
//                                         className={inputClass}
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className={labelClass}>
//                                         Unit *
//                                     </label>

//                                     <select
//                                         name="unit"
//                                         value={form.unit}
//                                         onChange={handleChange}
//                                         className={inputClass}
//                                         required
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
//                                     <label className={labelClass}>
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
//                                             value={form.expectedPrice}
//                                             onChange={handleChange}
//                                             placeholder="Price per unit"
//                                             className={`${inputClass} pl-11`}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className={labelClass}>
//                                         Location *
//                                     </label>

//                                     <div className="relative">
//                                         <MapPin
//                                             size={17}
//                                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                                         />

//                                         <input
//                                             name="location"
//                                             value={form.location}
//                                             onChange={handleChange}
//                                             placeholder="Village / Market"
//                                             className={`${inputClass} pl-11`}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className={labelClass}>
//                                         Quality
//                                     </label>

//                                     <select
//                                         name="quality"
//                                         value={form.quality}
//                                         onChange={handleChange}
//                                         className={inputClass}
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
//                                     <label className={labelClass}>
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
//                                             value={form.availableFrom}
//                                             onChange={handleChange}
//                                             className={`${inputClass} pl-11`}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Produce image upload */}
//                                 <div className="md:col-span-2">
//                                     <label className={labelClass}>
//                                         Produce Image
//                                     </label>

//                                     <p className="mb-3 text-sm text-gray-500">
//                                         Upload a clear photo of your crop.
//                                         JPG, PNG, or WEBP, up to 5 MB.
//                                     </p>

//                                     {imagePreview ? (
//                                         <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-gray-50">
//                                             <img
//                                                 src={imagePreview}
//                                                 alt={`${form.crop || "Produce"} preview`}
//                                                 className="h-64 w-full object-cover sm:h-80"
//                                             />

//                                             <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
//                                                 Image preview
//                                             </div>

//                                             <button
//                                                 type="button"
//                                                 onClick={handleRemoveSelectedImage}
//                                                 disabled={loading}
//                                                 className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-gray-700 shadow hover:bg-white disabled:opacity-50"
//                                             >
//                                                 <X size={15} />
//                                                 {selectedImage
//                                                     ? "Undo selection"
//                                                     : "Keep current image"}
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <label
//                                             htmlFor="produce-image"
//                                             className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-10 text-center transition hover:border-green-400 hover:bg-green-50"
//                                         >
//                                             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
//                                                 <ImageIcon size={26} />
//                                             </div>

//                                             <span className="mt-4 font-semibold text-gray-800">
//                                                 Choose a produce image
//                                             </span>

//                                             <span className="mt-1 text-sm text-gray-500">
//                                                 Browse images from your device
//                                             </span>

//                                             <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white">
//                                                 <Upload size={16} />
//                                                 Select Image
//                                             </span>
//                                         </label>
//                                     )}

//                                     <input
//                                         id="produce-image"
//                                         type="file"
//                                         accept="image/jpeg,image/png,image/webp"
//                                         onChange={handleImageChange}
//                                         className="sr-only"
//                                     />

//                                     {imagePreview && (
//                                         <label
//                                             htmlFor="produce-image"
//                                             className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
//                                         >
//                                             <Upload size={16} />
//                                             {selectedImage
//                                                 ? "Choose another image"
//                                                 : "Replace image"}
//                                         </label>
//                                     )}

//                                     {imageError && (
//                                         <p className="mt-2 text-sm font-medium text-red-600">
//                                             {imageError}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label className={labelClass}>
//                                         Description
//                                     </label>

//                                     <textarea
//                                         name="description"
//                                         value={form.description}
//                                         onChange={handleChange}
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
//                                 disabled={loading}
//                                 className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//                             >
//                                 <Save size={17} />
//                                 {loading ? "Saving..." : submitLabel}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProduceForm;





import { useEffect, useRef, useState } from "react";
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
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Languages,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
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

const VOICE_LANGUAGES = [
    { label: "English", value: "en-IN" },
    { label: "हिन्दी (Hindi)", value: "hi-IN" },
    { label: "தமிழ் (Tamil)", value: "ta-IN" },
    { label: "తెలుగు (Telugu)", value: "te-IN" },
    { label: "বাংলা (Bengali)", value: "bn-IN" },
    { label: "मराठी (Marathi)", value: "mr-IN" },
    { label: "ગુજરાતી (Gujarati)", value: "gu-IN" },
    { label: "ಕನ್ನಡ (Kannada)", value: "kn-IN" },
    { label: "മലയാളം (Malayalam)", value: "ml-IN" },
    { label: "ਪੰਜਾਬੀ (Punjabi)", value: "pa-IN" },
];

const MAX_RECORDING_MS = 60000;

const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    return SpeechRecognition || null;
};

// Extract only clearly labelled values.
// The complete transcript is always preserved in Description.
const extractProduceDetails = (transcript) => {
    const result = {};

    const quantityMatch = transcript.match(
        /(?:quantity|मात्रा|क्वांटिटी|वजन)\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*(kg|kgs|kilograms?|किलो|किलोग्राम|quintals?|क्विंटल|tons?|टन)?/i
    );

    if (quantityMatch) {
        const quantity = Number(quantityMatch[1]);
        const unitText = (quantityMatch[2] || "").toLowerCase();

        if (Number.isFinite(quantity) && quantity > 0) {
            result.quantity = String(quantity);

            if (
                ["kg", "kgs", "kilogram", "kilograms", "किलो", "किलोग्राम"].includes(unitText)
            ) {
                result.unit = "KG";
            } else if (
                ["ton", "tons", "टन"].includes(unitText)
            ) {
                result.unit = "TON";
            } else if (
                ["quintal", "quintals", "क्विंटल"].includes(unitText)
            ) {
                result.unit = "QUINTAL";
            }
        }
    }

    const priceMatch = transcript.match(
        /(?:expected price|price|कीमत|दाम|भाव|मूल्य)\s*[:=-]?\s*(?:₹|rs\.?|रुपये|रुपया)?\s*(\d+(?:\.\d+)?)/i
    );

    if (priceMatch) {
        const price = Number(priceMatch[1]);

        if (Number.isFinite(price) && price >= 0) {
            result.expectedPrice = String(price);
        }
    }

    const cropMatch = transcript.match(
        /(?:crop|फसल)\s*[:=-]?\s*([^,;\n.]+)/i
    );

    if (cropMatch) {
        const crop = cropMatch[1].trim();

        if (crop) result.crop = crop;
    }

    const locationMatch = transcript.match(
        /(?:location|village|market|गाँव|गांव|स्थान|बाजार|बाज़ार)\s*[:=-]?\s*([^,;\n.]+)/i
    );

    if (locationMatch) {
        const location = locationMatch[1].trim();

        if (location) result.location = location;
    }

    return result;
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
    const [form, setForm] = useState(initialValues);
    const [validationError, setValidationError] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        initialValues.imageUrl || ""
    );
    const [imageError, setImageError] = useState("");

    // Voice assistance state
    const [language, setLanguage] = useState("en-IN");
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(true);
    const [voiceError, setVoiceError] = useState("");
    const [voiceMessage, setVoiceMessage] = useState("");
    const [transcript, setTranscript] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceDetailsFound, setVoiceDetailsFound] = useState(false);

    const recognitionRef = useRef(null);
    const transcriptRef = useRef("");
    const speakingRef = useRef(false);
    const recordingTimeoutRef = useRef(null);

    useEffect(() => {
        setForm(initialValues);
        setSelectedImage(null);
        setImagePreview(initialValues.imageUrl || "");
        setImageError("");
        setValidationError("");
    }, [initialValues]);

    useEffect(() => {
        setVoiceSupported(Boolean(getSpeechRecognition()));
    }, []);

    // Stop speech services when the component unmounts.
    useEffect(() => {
        return () => {
            if (recordingTimeoutRef.current) {
                clearTimeout(recordingTimeoutRef.current);
            }

            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.onend = null;

                try {
                    recognitionRef.current.abort();
                } catch {
                    // The recognition service may already be stopped.
                }
            }

            if (
                typeof window !== "undefined" &&
                window.speechSynthesis
            ) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Release temporary browser image URLs when they change.
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

    const stopSpeaking = () => {
        if (
            typeof window !== "undefined" &&
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
        }

        speakingRef.current = false;
        setIsSpeaking(false);
    };

    const stopListening = () => {
        if (recordingTimeoutRef.current) {
            clearTimeout(recordingTimeoutRef.current);
            recordingTimeoutRef.current = null;
        }

        try {
            recognitionRef.current?.stop();
        } catch {
            // It may already have stopped.
        }

        setIsListening(false);
    };

    const handleStartListening = () => {
        setVoiceError("");
        setVoiceMessage("");
        setValidationError("");
        setVoiceDetailsFound(false);

        const Recognition = getSpeechRecognition();

        if (!Recognition) {
            setVoiceSupported(false);
            setVoiceError(
                "Voice recognition is not available in this browser. Please use a supported browser or type your details manually."
            );
            return;
        }

        stopSpeaking();

        // Close any previous recognition session.
        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort();
            } catch {
                // Ignore an already-closed session.
            }
        }

        const recognition = new Recognition();

        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        transcriptRef.current = transcript;
        let sessionFinalTranscript = "";

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceMessage(
                "Listening... Speak clearly, then press Stop."
            );
        };

        recognition.onresult = (event) => {
            let interimTranscript = "";

            for (
                let index = event.resultIndex;
                index < event.results.length;
                index += 1
            ) {
                const result = event.results[index];
                const spokenText = result[0]?.transcript || "";

                if (result.isFinal) {
                    sessionFinalTranscript += `${spokenText} `;
                } else {
                    interimTranscript += `${spokenText} `;
                }
            }

            const combinedTranscript = [
                transcriptRef.current,
                sessionFinalTranscript.trim(),
                interimTranscript.trim(),
            ]
                .filter(Boolean)
                .join(" ")
                .trim();

            setTranscript(combinedTranscript);
        };

        recognition.onerror = (event) => {
            if (event.error === "aborted") return;

            const messages = {
                "not-allowed":
                    "Microphone access was denied. Allow microphone permission in your browser settings.",
                "service-not-allowed":
                    "The browser speech service is blocked. Please try another supported browser.",
                "no-speech":
                    "No speech was detected. Try speaking closer to your microphone.",
                "audio-capture":
                    "No microphone was found. Connect or enable a microphone.",
                network:
                    "Speech recognition encountered a network problem. Check your connection and try again.",
            };

            setVoiceError(
                messages[event.error] ||
                    "Voice recognition failed. Please try again or type your details."
            );
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;

            if (recordingTimeoutRef.current) {
                clearTimeout(recordingTimeoutRef.current);
                recordingTimeoutRef.current = null;
            }

            const finalText = [
                transcriptRef.current,
                sessionFinalTranscript.trim(),
            ]
                .filter(Boolean)
                .join(" ")
                .trim();

            if (finalText) {
                setTranscript(finalText);
                setVoiceMessage(
                    "Speech captured. Review the transcript before applying it."
                );
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();

            recordingTimeoutRef.current = setTimeout(() => {
                try {
                    recognition.stop();
                } catch {
                    // The recognition session may already have stopped.
                }
            }, MAX_RECORDING_MS);
        } catch {
            recognitionRef.current = null;
            setIsListening(false);
            setVoiceError(
                "Unable to start the microphone. Please try again."
            );
        }
    };

    const handleApplyTranscript = () => {
        const spokenText = transcript.trim();

        if (!spokenText) {
            setVoiceError(
                "Please record or enter some text before applying it."
            );
            return;
        }

        const extracted = extractProduceDetails(spokenText);

        setForm((previous) => ({
            ...previous,
            ...extracted,
            description: [
                previous.description.trim(),
                spokenText,
            ]
                .filter(Boolean)
                .join("\n"),
        }));

        setVoiceDetailsFound(
            Object.keys(extracted).length > 0
        );

        setVoiceMessage(
            Object.keys(extracted).length > 0
                ? "Recognized details have been added. Please review every field."
                : "Transcript added to Description. Fill in any missing fields manually."
        );

        setVoiceError("");
    };

    const handleReadAloud = () => {
        if (
            typeof window === "undefined" ||
            !window.speechSynthesis ||
            typeof SpeechSynthesisUtterance === "undefined"
        ) {
            setVoiceError(
                "Text-to-speech is not available in this browser."
            );
            return;
        }

        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        const textToRead = [
            form.crop && `Crop: ${form.crop}.`,
            form.quantity &&
                `Quantity: ${form.quantity} ${form.unit}.`,
            form.expectedPrice &&
                `Expected price: ${form.expectedPrice} rupees per ${form.unit}.`,
            form.location && `Location: ${form.location}.`,
            form.quality && `Quality: ${form.quality}.`,
            form.description && `Description: ${form.description}.`,
        ]
            .filter(Boolean)
            .join(" ");

        if (!textToRead.trim()) {
            setVoiceError(
                "Enter some produce details before using Read Aloud."
            );
            return;
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language;
        utterance.rate = 0.9;

        utterance.onstart = () => {
            speakingRef.current = true;
            setIsSpeaking(true);
            setVoiceError("");
        };

        utterance.onend = () => {
            speakingRef.current = false;
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            speakingRef.current = false;
            setIsSpeaking(false);
            setVoiceError(
                "Unable to read the details aloud. Try another available language."
            );
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const handleClearTranscript = () => {
        stopListening();
        setTranscript("");
        transcriptRef.current = "";
        setVoiceMessage("");
        setVoiceError("");
        setVoiceDetailsFound(false);
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
            setImageError("Image size must not exceed 5 MB.");
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

        const fileInput = document.getElementById("produce-image");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");

        if (isListening) {
            setValidationError(
                "Please stop voice recording before saving."
            );
            return;
        }

        if (
            !form.crop.trim() ||
            form.quantity === "" ||
            !form.unit ||
            form.expectedPrice === "" ||
            !form.location.trim() ||
            !form.availableFrom
        ) {
            setValidationError("Please fill all required fields.");
            return;
        }

        if (
            !Number.isFinite(Number(form.quantity)) ||
            Number(form.quantity) <= 0
        ) {
            setValidationError(
                "Quantity must be greater than zero."
            );
            return;
        }

        if (
            !Number.isFinite(Number(form.expectedPrice)) ||
            Number(form.expectedPrice) < 0
        ) {
            setValidationError(
                "Expected price must be a valid non-negative number."
            );
            return;
        }

        if (imageError) {
            setValidationError(
                "Please correct the image selection before saving."
            );
            return;
        }

        stopSpeaking();

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
                            <div
                                role="alert"
                                className="flex gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                            >
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                                {validationError || error}
                            </div>
                        )}

                        {/* Multilingual voice assistance */}
                        <section className="overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                                        <Mic size={21} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Voice Listing Assistant
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Speak naturally. Review before publishing.
                                        </p>
                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-white px-3 py-1.5 text-xs font-semibold text-green-700">
                                    <Sparkles size={13} />
                                    Multilingual
                                </span>
                            </div>

                            <div className="space-y-4 p-5">
                                <div>
                                    <label
                                        className={labelClass}
                                        htmlFor="voice-language"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Languages size={16} />
                                            Choose your language
                                        </span>
                                    </label>

                                    <select
                                        id="voice-language"
                                        value={language}
                                        disabled={isListening || loading}
                                        onChange={(event) => {
                                            setLanguage(event.target.value);
                                            setVoiceError("");
                                            setVoiceMessage("");
                                        }}
                                        className={inputClass}
                                    >
                                        {VOICE_LANGUAGES.map((item) => (
                                            <option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={
                                            isListening
                                                ? stopListening
                                                : handleStartListening
                                        }
                                        disabled={loading}
                                        className={`relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                                            isListening
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {isListening ? (
                                            <>
                                                <span className="absolute inset-0 animate-pulse bg-white/10" />
                                                <MicOff
                                                    size={18}
                                                    className="relative"
                                                />
                                                <span className="relative">
                                                    Stop Recording
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Mic size={18} />
                                                Start Speaking
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReadAloud}
                                        disabled={loading || isListening}
                                        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSpeaking ? (
                                            <VolumeX size={18} />
                                        ) : (
                                            <Volume2 size={18} />
                                        )}
                                        {isSpeaking
                                            ? "Stop Read Aloud"
                                            : "Read Listing Aloud"}
                                    </button>
                                </div>

                                <div className="rounded-xl border border-green-100 bg-white/90 p-4">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <label
                                            htmlFor="voice-transcript"
                                            className="text-sm font-bold text-gray-800"
                                        >
                                            Speech transcript
                                        </label>

                                        {isListening && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                                                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                                                Recording
                                            </span>
                                        )}
                                    </div>

                                    <textarea
                                        id="voice-transcript"
                                        value={transcript}
                                        onChange={(event) =>
                                            setTranscript(event.target.value)
                                        }
                                        rows={4}
                                        placeholder="Your recognized speech will appear here. You can also type or correct the transcript."
                                        className={`${inputClass} resize-y`}
                                    />

                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Tip: Say labelled details where possible, for example:
                                        “Crop: Tomato. Quantity: 100 KG. Price: 20.
                                        Location: My village.”
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={handleApplyTranscript}
                                            disabled={
                                                loading ||
                                                isListening ||
                                                !transcript.trim()
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={16} />
                                            Apply to Form
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleClearTranscript}
                                            disabled={
                                                loading ||
                                                (!transcript &&
                                                    !isListening)
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <RotateCcw size={15} />
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {voiceMessage && (
                                    <div
                                        role="status"
                                        className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-100/60 px-3 py-3 text-sm text-green-800"
                                    >
                                        <CheckCircle2
                                            size={17}
                                            className="mt-0.5 shrink-0"
                                        />
                                        <div>
                                            <p>{voiceMessage}</p>

                                            {voiceDetailsFound && (
                                                <p className="mt-1 text-xs">
                                                    Check all extracted fields, especially
                                                    price, quantity, and unit.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {voiceError && (
                                    <div
                                        role="alert"
                                        className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800"
                                    >
                                        <AlertCircle
                                            size={17}
                                            className="mt-0.5 shrink-0"
                                        />
                                        <p>{voiceError}</p>
                                    </div>
                                )}

                                {!voiceSupported && (
                                    <p className="text-xs leading-5 text-gray-500">
                                        Your browser does not currently expose speech
                                        recognition. You can still type in the transcript
                                        box, apply it, and use the normal form.
                                    </p>
                                )}
                            </div>
                        </section>

                        <div>
                            <h2 className="mb-4 text-base font-bold text-gray-900">
                                Produce Details
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        className={labelClass}
                                        htmlFor="crop"
                                    >
                                        Crop Name *
                                    </label>
                                    <input
                                        id="crop"
                                        name="crop"
                                        value={form.crop}
                                        onChange={handleChange}
                                        placeholder="e.g. Wheat"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        className={labelClass}
                                        htmlFor="quantity"
                                    >
                                        Quantity *
                                    </label>
                                    <input
                                        id="quantity"
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
                                    <label
                                        className={labelClass}
                                        htmlFor="unit"
                                    >
                                        Unit *
                                    </label>
                                    <select
                                        id="unit"
                                        name="unit"
                                        value={form.unit}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="KG">Kilogram</option>
                                        <option value="QUINTAL">Quintal</option>
                                        <option value="TON">Ton</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        className={labelClass}
                                        htmlFor="expectedPrice"
                                    >
                                        Expected Price *
                                    </label>
                                    <div className="relative">
                                        <IndianRupee
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            id="expectedPrice"
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
                                    <label
                                        className={labelClass}
                                        htmlFor="location"
                                    >
                                        Location *
                                    </label>
                                    <div className="relative">
                                        <MapPin
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            id="location"
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
                                    <label
                                        className={labelClass}
                                        htmlFor="quality"
                                    >
                                        Quality
                                    </label>
                                    <select
                                        id="quality"
                                        name="quality"
                                        value={form.quality}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="STANDARD">Standard</option>
                                        <option value="GOOD">Good</option>
                                        <option value="PREMIUM">Premium</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        className={labelClass}
                                        htmlFor="availableFrom"
                                    >
                                        Available From *
                                    </label>
                                    <div className="relative">
                                        <CalendarDays
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            id="availableFrom"
                                            type="date"
                                            name="availableFrom"
                                            value={form.availableFrom}
                                            onChange={handleChange}
                                            className={`${inputClass} pl-11`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Existing produce image upload */}
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
                                    <label
                                        className={labelClass}
                                        htmlFor="description"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Add details about your produce, quality, harvesting, etc."
                                        className={`${inputClass} resize-y`}
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
                                disabled={loading || isListening}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={17} />
                                {loading
                                    ? "Saving..."
                                    : isListening
                                        ? "Stop recording first"
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