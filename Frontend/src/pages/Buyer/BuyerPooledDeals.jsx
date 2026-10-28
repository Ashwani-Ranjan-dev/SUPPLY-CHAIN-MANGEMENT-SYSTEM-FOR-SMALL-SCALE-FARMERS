
// import { useCallback, useEffect, useState } from "react";
// import {
//     RefreshCw,
//     Package,
//     MapPin,
//     Users,
//     IndianRupee,
//     Clock,
//     CheckCircle2,
//     AlertCircle,
//     CreditCard,
//     LoaderCircle,
//     Truck,
//     CalendarDays,
//     Navigation,
// } from "lucide-react";

// import { getBuyerPooledDeals } from "../../services/pooledDealServices";
// import {
//     createPooledPaymentOrder,
//     verifyPooledPayment,
// } from "../../services/pooledPaymentServices";
// import {
//     createPooledDelivery,
//     getBuyerPooledDeliveries,
// } from "../../services/pooledDeliveryServices";

// import DocumentDownloadButtons from "../../components/common/DocumentDownloadButton";

// const statusStyles = {
//     PENDING: "bg-amber-50 text-amber-700 border-amber-200",
//     ACCEPTED: "bg-green-50 text-green-700 border-green-200",
//     REJECTED: "bg-red-50 text-red-700 border-red-200",
//     CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
//     COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
// };

// const responseStyles = {
//     PENDING: "text-amber-700 bg-amber-50",
//     ACCEPTED: "text-green-700 bg-green-50",
//     REJECTED: "text-red-700 bg-red-50",
// };

// const deliveryStatusStyles = {
//     NOT_ASSIGNED: "bg-gray-100 text-gray-700",
//     ASSIGNED: "bg-purple-50 text-purple-700",
//     PICKED_UP: "bg-amber-50 text-amber-700",
//     IN_TRANSIT: "bg-blue-50 text-blue-700",
//     DELIVERED: "bg-green-50 text-green-700",
//     CANCELLED: "bg-red-50 text-red-700",
// };

// const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-IN", {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 2,
//     }).format(Number(amount) || 0);

// const BuyerPooledDeals = () => {
//     const [deals, setDeals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState("");

//     // Payment state
//     const [payingDealId, setPayingDealId] = useState(null);
//     const [paymentSuccess, setPaymentSuccess] = useState({});
//     const [paymentError, setPaymentError] = useState("");
//     const [paymentErrorDealId, setPaymentErrorDealId] = useState(null);

//     // Pooled delivery state
//     const [deliveries, setDeliveries] = useState([]);
//     const [deliveryLocations, setDeliveryLocations] = useState({});
//     const [deliveryNotes, setDeliveryNotes] = useState({});
//     const [creatingDeliveryId, setCreatingDeliveryId] = useState(null);
//     const [deliveryError, setDeliveryError] = useState("");
//     const [deliverySuccess, setDeliverySuccess] = useState("");
//     const [loadingDeliveries, setLoadingDeliveries] = useState(false);

//     // Load buyer's pooled deals
//     const loadDeals = useCallback(async (isRefresh = false) => {
//         if (isRefresh) {
//             setRefreshing(true);
//         } else {
//             setLoading(true);
//         }

//         setError("");

//         try {
//             const result = await getBuyerPooledDeals();
//             const data = result?.data ?? result;

//             setDeals(Array.isArray(data) ? data : []);
//         } catch (err) {
//             setError(err.message || "Unable to load pooled deals.");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, []);

//     // Load buyer's pooled deliveries
//     const loadDeliveries = useCallback(async () => {
//         setLoadingDeliveries(true);

//         try {
//             const result = await getBuyerPooledDeliveries();
//             const data = result?.data ?? result;

//             const deliveryList = Array.isArray(data)
//                 ? data
//                 : Array.isArray(data?.deliveries)
//                   ? data.deliveries
//                   : [];

//             setDeliveries(deliveryList);
//             setDeliveryError("");

//             return deliveryList;
//         } catch (err) {
//             setDeliveryError(
//                 err.message || "Unable to load pooled deliveries."
//             );

//             throw err;
//         } finally {
//             setLoadingDeliveries(false);
//         }
//     }, []);

//     // Load deals and deliveries on mount
//     useEffect(() => {
//         loadDeals();
//         loadDeliveries().catch(() => {});
//     }, [loadDeals, loadDeliveries]);

//     // Refresh both lists
//     const refreshPooledData = async () => {
//         setDeliveryError("");
//         setDeliverySuccess("");

//         const results = await Promise.allSettled([
//             loadDeals(true),
//             loadDeliveries(),
//         ]);

//         if (results.some((result) => result.status === "rejected")) {
//             setDeliveryError(
//                 "Some pooled deal or delivery data could not be refreshed."
//             );
//         }
//     };

//     // Dashboard statistics
//     const totalOffers = deals.length;

//     const acceptedOffers = deals.filter(
//         (deal) => deal.status === "ACCEPTED"
//     ).length;

//     const pendingOffers = deals.filter(
//         (deal) => deal.status === "PENDING"
//     ).length;

//     // Handle Razorpay pooled-deal payment
//     const handlePooledPayment = async (deal) => {
//         if (deal.status !== "ACCEPTED") {
//             setPaymentError(
//                 "Payment is available only for accepted pooled deals."
//             );
//             setPaymentErrorDealId(deal._id);
//             return;
//         }

//         if (payingDealId !== null) {
//             return;
//         }

//         setPayingDealId(deal._id);
//         setPaymentError("");
//         setPaymentErrorDealId(null);
//         setDeliveryError("");
//         setDeliverySuccess("");

//         try {
//             // Step 1: Create an order on the backend
//             const orderResult = await createPooledPaymentOrder(deal._id);
//             const order = orderResult?.data ?? orderResult;

//             if (!order?.orderId || !order?.paymentId || !order?.key) {
//                 throw new Error(
//                     "The server returned incomplete payment details."
//                 );
//             }

//             // Step 2: Load Razorpay Checkout if needed
//             if (!window.Razorpay) {
//                 await new Promise((resolve, reject) => {
//                     const existingScript = document.querySelector(
//                         'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
//                     );

//                     if (existingScript) {
//                         existingScript.addEventListener("load", resolve, {
//                             once: true,
//                         });
//                         existingScript.addEventListener(
//                             "error",
//                             () =>
//                                 reject(
//                                     new Error(
//                                         "Unable to load Razorpay Checkout."
//                                     )
//                                 ),
//                             { once: true }
//                         );
//                         return;
//                     }

//                     const script = document.createElement("script");
//                     script.src =
//                         "https://checkout.razorpay.com/v1/checkout.js";
//                     script.async = true;
//                     script.onload = resolve;
//                     script.onerror = () =>
//                         reject(
//                             new Error(
//                                 "Unable to load Razorpay Checkout. Please try again."
//                             )
//                         );

//                     document.body.appendChild(script);
//                 });
//             }

//             if (!window.Razorpay) {
//                 throw new Error(
//                     "Razorpay Checkout could not be initialized."
//                 );
//             }

//             // Step 3: Open checkout and verify payment on the backend
//             await new Promise((resolve, reject) => {
//                 let settled = false;

//                 const resolveOnce = () => {
//                     if (settled) return;
//                     settled = true;
//                     resolve();
//                 };

//                 const rejectOnce = (err) => {
//                     if (settled) return;
//                     settled = true;
//                     reject(err);
//                 };

//                 const checkout = new window.Razorpay({
//                     key: order.key,
//                     amount: order.amount,
//                     currency: order.currency || "INR",
//                     name: "KrishiConnect",
//                     description: `Pooled deal ${deal._id}`,
//                     order_id: order.orderId,

//                     handler: async (razorpayResponse) => {
//                         try {
//                             const verificationResult =
//                                 await verifyPooledPayment({
//                                     pooledPaymentId: order.paymentId,
//                                     razorpay_order_id:
//                                         razorpayResponse.razorpay_order_id,
//                                     razorpay_payment_id:
//                                         razorpayResponse.razorpay_payment_id,
//                                     razorpay_signature:
//                                         razorpayResponse.razorpay_signature,
//                                 });

//                             const verified =
//                                 verificationResult?.data ??
//                                 verificationResult;

//                             if (
//                                 verified?.success === false ||
//                                 verified?.payment?.status === "FAILED"
//                             ) {
//                                 throw new Error(
//                                     verified?.message ||
//                                         "Payment verification failed."
//                                 );
//                             }

//                             // The verification endpoint must validate the
//                             // Razorpay signature on the server.
//                             setPaymentSuccess((previous) => ({
//                                 ...previous,
//                                 [deal._id]: true,
//                             }));

//                             setPaymentError("");
//                             setPaymentErrorDealId(null);

//                             resolveOnce();
//                         } catch (err) {
//                             rejectOnce(err);
//                         }
//                     },

//                     modal: {
//                         ondismiss: () => {
//                             rejectOnce(
//                                 new Error("Payment checkout was closed.")
//                             );
//                         },
//                     },

//                     theme: {
//                         color: "#16a34a",
//                     },
//                 });

//                 checkout.on("payment.failed", (response) => {
//                     rejectOnce(
//                         new Error(
//                             response.error?.description ||
//                                 "Razorpay payment failed."
//                         )
//                     );
//                 });

//                 checkout.open();
//             });

//             // Step 4: Refresh deals after successful verification
//             await Promise.all([
//                 loadDeals(true),
//                 loadDeliveries().catch(() => []),
//             ]);
//         } catch (err) {
//             setPaymentError(
//                 err.message || "Unable to complete pooled payment."
//             );
//             setPaymentErrorDealId(deal._id);
//         } finally {
//             setPayingDealId(null);
//         }
//     };

//     // Create a pooled delivery
//     const handleCreateDelivery = async (deal) => {
//         const deliveryLocation = (
//             deliveryLocations[deal._id] || ""
//         ).trim();

//         if (!deliveryLocation) {
//             setDeliveryError(
//                 "Enter your complete delivery address before continuing."
//             );
//             setDeliverySuccess("");
//             return;
//         }

//         if (creatingDeliveryId !== null) return;

//         setCreatingDeliveryId(deal._id);
//         setDeliveryError("");
//         setDeliverySuccess("");

//         try {
//             const result = await createPooledDelivery({
//                 pooledDealId: deal._id,
//                 deliveryLocation,
//                 notes: (deliveryNotes[deal._id] || "").trim(),
//             });

//             const response = result?.data ?? result;

//             setDeliverySuccess(
//                 response?.message ||
//                     result?.message ||
//                     "Pooled delivery created successfully."
//             );

//             // Refresh both lists after creating the delivery
//             await Promise.all([
//                 loadDeals(true),
//                 loadDeliveries(),
//             ]);
//         } catch (err) {
//             setDeliveryError(
//                 err.message || "Unable to create pooled delivery."
//             );
//         } finally {
//             setCreatingDeliveryId(null);
//         }
//     };

//     // Initial loading skeleton
//     if (loading) {
//         return (
//             <div className="space-y-5 p-4 sm:p-6">
//                 <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

//                 <div className="grid gap-4 sm:grid-cols-3">
//                     {[1, 2, 3].map((item) => (
//                         <div
//                             key={item}
//                             className="h-24 animate-pulse rounded-2xl bg-gray-100"
//                         />
//                     ))}
//                 </div>

//                 <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//             <div className="mx-auto max-w-7xl space-y-6">
//                 {/* Page heading */}
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <p className="text-sm font-medium text-green-700">
//                             KRISHICONNECT / MARKETPLACE
//                         </p>

//                         <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
//                             My Pooled Deals
//                         </h1>

//                         <p className="mt-2 text-sm text-gray-500">
//                             Track your pooled offers, farmer responses,
//                             payments and deliveries.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={refreshPooledData}
//                         disabled={refreshing || loadingDeliveries}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
//                     >
//                         <RefreshCw
//                             size={16}
//                             className={
//                                 refreshing || loadingDeliveries
//                                     ? "animate-spin"
//                                     : ""
//                             }
//                         />
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Load error */}
//                 {error && (
//                     <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                         <AlertCircle
//                             size={20}
//                             className="mt-0.5 shrink-0"
//                         />

//                         <div className="flex-1">
//                             <p className="font-semibold">
//                                 Could not load pooled deals
//                             </p>

//                             <p className="mt-1">{error}</p>

//                             <button
//                                 type="button"
//                                 onClick={() => loadDeals()}
//                                 className="mt-2 font-semibold underline"
//                             >
//                                 Try again
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Statistics */}
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     <StatCard
//                         title="Total Offers"
//                         value={totalOffers}
//                         icon={Package}
//                         color="text-blue-600"
//                         bg="bg-blue-50"
//                     />

//                     <StatCard
//                         title="Awaiting Responses"
//                         value={pendingOffers}
//                         icon={Clock}
//                         color="text-amber-600"
//                         bg="bg-amber-50"
//                     />

//                     <StatCard
//                         title="Accepted Offers"
//                         value={acceptedOffers}
//                         icon={CheckCircle2}
//                         color="text-green-600"
//                         bg="bg-green-50"
//                     />
//                 </div>

//                 {/* Empty state */}
//                 {!error && deals.length === 0 ? (
//                     <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
//                         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
//                             <Package size={27} />
//                         </div>

//                         <h2 className="mt-4 text-lg font-bold text-gray-900">
//                             No pooled offers yet
//                         </h2>

//                         <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
//                             Explore pooled produce and submit an offer to
//                             farmers. Your offers will appear here.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-5">
//                         {deals.map((deal) => {
//                             const lot =
//                                 deal.pooledLot &&
//                                 typeof deal.pooledLot === "object"
//                                     ? deal.pooledLot
//                                     : {};

//                             const contributions = deal.contributions || [];

//                             // Find delivery associated with this deal
//                             const delivery = deliveries.find((item) => {
//                                 const linkedDeal =
//                                     item.pooledDeal &&
//                                     typeof item.pooledDeal === "object"
//                                         ? item.pooledDeal._id
//                                         : item.pooledDeal;

//                                 return (
//                                     String(linkedDeal) === String(deal._id)
//                                 );
//                             });

//                             // Find payment details
//                             const savedPayment =
//                                 deal.pooledPayment ||
//                                 deal.payment ||
//                                 deal.pooledPaymentId ||
//                                 null;

//                             const savedPaymentStatus =
//                                 typeof savedPayment === "object"
//                                     ? savedPayment?.status
//                                     : deal.paymentStatus;

//                             const isPaymentPaid =
//                                 savedPaymentStatus === "PAID" ||
//                                 savedPaymentStatus === "CAPTURED" ||
//                                 paymentSuccess[deal._id] === true;

//                             return (
//                                 <section
//                                     key={deal._id}
//                                     className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
//                                 >
//                                     {/* Deal heading */}
//                                     <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
//                                         <div className="min-w-0">
//                                             <h2 className="text-lg font-bold text-gray-900">
//                                                 {lot.crop || "Pooled Produce"}
//                                             </h2>

//                                             <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
//                                                 <span className="inline-flex items-center gap-1.5">
//                                                     <MapPin size={15} />
//                                                     {lot.location ||
//                                                         "Location unavailable"}
//                                                 </span>

//                                                 <span className="inline-flex items-center gap-1.5">
//                                                     <Users size={15} />
//                                                     {contributions.length}{" "}
//                                                     contributions
//                                                 </span>
//                                             </div>

//                                             <p className="mt-2 break-all text-xs text-gray-400">
//                                                 Offer ID: {deal._id}
//                                             </p>
//                                         </div>

//                                         <span
//                                             className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
//                                                 statusStyles[deal.status] ||
//                                                 statusStyles.PENDING
//                                             }`}
//                                         >
//                                             {deal.status || "PENDING"}
//                                         </span>
//                                     </div>

//                                     {/* Deal metrics */}
//                                     <div className="grid gap-4 border-b border-gray-100 bg-gray-50/70 p-5 sm:grid-cols-3">
//                                         <Metric
//                                             label="Total quantity"
//                                             value={`${deal.quantity ?? 0} ${
//                                                 deal.unit || lot.unit || ""
//                                             }`}
//                                         />

//                                         <Metric
//                                             label="Offered price / unit"
//                                             value={formatCurrency(
//                                                 deal.offeredPrice
//                                             )}
//                                         />

//                                         <Metric
//                                             label="Total offer amount"
//                                             value={formatCurrency(
//                                                 deal.totalAmount
//                                             )}
//                                             highlight
//                                         />
//                                     </div>

//                                     <div className="p-5">
//                                         {/* Farmer responses */}
//                                         <h3 className="mb-4 text-sm font-bold text-gray-900">
//                                             Farmer responses
//                                         </h3>

//                                         {contributions.length === 0 ? (
//                                             <p className="text-sm text-gray-500">
//                                                 No contribution details
//                                                 available.
//                                             </p>
//                                         ) : (
//                                             <div className="space-y-3">
//                                                 {contributions.map(
//                                                     (contribution, index) => {
//                                                         const farmer =
//                                                             contribution.farmer &&
//                                                             typeof contribution.farmer ===
//                                                                 "object"
//                                                                 ? contribution.farmer
//                                                                 : {};

//                                                         const responseStatus =
//                                                             contribution.responseStatus ||
//                                                             "PENDING";

//                                                         return (
//                                                             <div
//                                                                 key={`${
//                                                                     contribution
//                                                                         .produce
//                                                                         ?._id ||
//                                                                     contribution.produce ||
//                                                                     index
//                                                                 }-${index}`}
//                                                                 className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
//                                                             >
//                                                                 <div>
//                                                                     <p className="font-semibold text-gray-800">
//                                                                         {farmer.name ||
//                                                                             `Farmer ${
//                                                                                 index +
//                                                                                 1
//                                                                             }`}
//                                                                     </p>

//                                                                     <p className="mt-1 text-sm text-gray-500">
//                                                                         {
//                                                                             contribution.quantity
//                                                                         }{" "}
//                                                                         {deal.unit ||
//                                                                             lot.unit ||
//                                                                             ""}{" "}
//                                                                         contribution
//                                                                     </p>

//                                                                     {farmer.village && (
//                                                                         <p className="mt-1 text-xs text-gray-400">
//                                                                             {
//                                                                                 farmer.village
//                                                                             }
//                                                                         </p>
//                                                                     )}
//                                                                 </div>

//                                                                 <span
//                                                                     className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
//                                                                         responseStyles[
//                                                                             responseStatus
//                                                                         ] ||
//                                                                         responseStyles.PENDING
//                                                                     }`}
//                                                                 >
//                                                                     {
//                                                                         responseStatus
//                                                                     }
//                                                                 </span>
//                                                             </div>
//                                                         );
//                                                     }
//                                                 )}
//                                             </div>
//                                         )}

//                                         {deal.message && (
//                                             <div className="mt-4 rounded-xl bg-gray-50 p-4">
//                                                 <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                                                     Your message
//                                                 </p>

//                                                 <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
//                                                     {deal.message}
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* Payment errors */}
//                                         {paymentError &&
//                                             paymentErrorDealId === deal._id && (
//                                                 <p
//                                                     role="alert"
//                                                     className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
//                                                 >
//                                                     {paymentError}
//                                                 </p>
//                                             )}

//                                         {/* Pooled payment section */}
//                                         <div className="mt-5 border-t border-gray-100 bg-white pt-5">
//                                             {deal.status === "PENDING" && (
//                                                 <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
//                                                     <Clock
//                                                         className="mt-0.5 shrink-0 text-amber-600"
//                                                         size={20}
//                                                     />

//                                                     <div>
//                                                         <p className="font-semibold text-amber-800">
//                                                             Awaiting farmer
//                                                             responses
//                                                         </p>

//                                                         <p className="mt-1 text-sm text-amber-700">
//                                                             Payment becomes
//                                                             available once the
//                                                             pooled deal is
//                                                             accepted.
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {deal.status === "ACCEPTED" && (
//                                                 <div className="flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                                     <div>
//                                                         <p className="font-semibold text-green-900">
//                                                             {isPaymentPaid
//                                                                 ? "Payment verified successfully"
//                                                                 : "All farmers have accepted"}
//                                                         </p>

//                                                         <p className="mt-1 text-sm text-green-800">
//                                                             {isPaymentPaid
//                                                                 ? "Your payment has been confirmed."
//                                                                 : `Amount due: ${formatCurrency(
//                                                                       deal.totalAmount
//                                                                   )}`}
//                                                         </p>
//                                                     </div>

//                                                     {!isPaymentPaid && (
//                                                         <button
//                                                             type="button"
//                                                             onClick={() =>
//                                                                 handlePooledPayment(
//                                                                     deal
//                                                                 )
//                                                             }
//                                                             disabled={
//                                                                 payingDealId !==
//                                                                 null
//                                                             }
//                                                             className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//                                                         >
//                                                             {payingDealId ===
//                                                             deal._id ? (
//                                                                 <>
//                                                                     <LoaderCircle
//                                                                         size={17}
//                                                                         className="animate-spin"
//                                                                     />
//                                                                     Processing...
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <CreditCard
//                                                                         size={17}
//                                                                     />
//                                                                     Pay Now
//                                                                 </>
//                                                             )}
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {deal.status === "REJECTED" && (
//                                                 <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
//                                                     This pooled offer was
//                                                     rejected. Payment is
//                                                     unavailable.
//                                                 </div>
//                                             )}

//                                             {deal.status === "CANCELLED" && (
//                                                 <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
//                                                     This pooled offer was
//                                                     cancelled. Payment is
//                                                     unavailable.
//                                                 </div>
//                                             )}

//                                             {deal.status === "COMPLETED" && (
//                                                 <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
//                                                     This pooled deal is
//                                                     completed.
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Pooled delivery section */}
//                                         <div className="mt-5 border-t border-gray-100 pt-5">
//                                             <div className="mb-4 flex items-center gap-2">
//                                                 <Truck
//                                                     size={20}
//                                                     className="text-green-700"
//                                                 />

//                                                 <h3 className="font-bold text-gray-900">
//                                                     Pooled Delivery
//                                                 </h3>
//                                             </div>

//                                             {deliveryError && (
//                                                 <div
//                                                     role="alert"
//                                                     className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
//                                                 >
//                                                     {deliveryError}
//                                                 </div>
//                                             )}

//                                             {deliverySuccess && (
//                                                 <div
//                                                     role="status"
//                                                     className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
//                                                 >
//                                                     {deliverySuccess}
//                                                 </div>
//                                             )}

//                                             {delivery ? (
//                                                 <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/50 p-4">
//                                                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                                         <div>
//                                                             <p className="font-semibold text-gray-900">
//                                                                 Delivery tracking
//                                                             </p>

//                                                             <p className="mt-1 break-all text-xs text-gray-500">
//                                                                 Delivery ID:{" "}
//                                                                 {delivery._id}
//                                                             </p>
//                                                         </div>

//                                                         <span
//                                                             className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
//                                                                 deliveryStatusStyles[
//                                                                     delivery.status
//                                                                 ] ||
//                                                                 "bg-gray-100 text-gray-700"
//                                                             }`}
//                                                         >
//                                                             {(
//                                                                 delivery.status ||
//                                                                 "NOT_ASSIGNED"
//                                                             ).replaceAll(
//                                                                 "_",
//                                                                 " "
//                                                             )}
//                                                         </span>
//                                                     </div>

//                                                     <div className="grid gap-4 sm:grid-cols-2">
//                                                         <div className="flex items-start gap-3">
//                                                             <MapPin
//                                                                 size={18}
//                                                                 className="mt-0.5 shrink-0 text-green-700"
//                                                             />

//                                                             <div>
//                                                                 <p className="text-xs text-gray-500">
//                                                                     Pickup
//                                                                     location
//                                                                 </p>

//                                                                 <p className="mt-1 break-words text-sm font-medium text-gray-800">
//                                                                     {delivery.pickupLocation ||
//                                                                         "Not available"}
//                                                                 </p>
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex items-start gap-3">
//                                                             <Navigation
//                                                                 size={18}
//                                                                 className="mt-0.5 shrink-0 text-green-700"
//                                                             />

//                                                             <div>
//                                                                 <p className="text-xs text-gray-500">
//                                                                     Delivery
//                                                                     location
//                                                                 </p>

//                                                                 <p className="mt-1 break-words text-sm font-medium text-gray-800">
//                                                                     {delivery.deliveryLocation ||
//                                                                         "Not available"}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {delivery.deliveryPartner
//                                                         ?.name && (
//                                                         <div className="rounded-lg border border-gray-100 bg-white p-3">
//                                                             <p className="text-xs text-gray-500">
//                                                                 Delivery partner
//                                                             </p>

//                                                             <p className="mt-1 font-semibold text-gray-800">
//                                                                 {
//                                                                     delivery
//                                                                         .deliveryPartner
//                                                                         .name
//                                                                 }
//                                                             </p>

//                                                             {delivery
//                                                                 .deliveryPartner
//                                                                 .phone && (
//                                                                 <p className="mt-1 text-sm text-gray-600">
//                                                                     {
//                                                                         delivery
//                                                                             .deliveryPartner
//                                                                             .phone
//                                                                     }
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                     )}

//                                                     {delivery.estimatedDeliveryDate && (
//                                                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <CalendarDays
//                                                                 size={17}
//                                                                 className="text-green-700"
//                                                             />

//                                                             <span>
//                                                                 Estimated
//                                                                 delivery:{" "}
//                                                                 {new Date(
//                                                                     delivery.estimatedDeliveryDate
//                                                                 ).toLocaleDateString(
//                                                                     "en-IN"
//                                                                 )}
//                                                             </span>
//                                                         </div>
//                                                     )}

//                                                     {delivery.status ===
//                                                         "DELIVERED" && (
//                                                         <p className="rounded-lg bg-green-100 p-3 text-sm font-medium text-green-800">
//                                                             Your pooled produce
//                                                             has been delivered.
//                                                         </p>
//                                                     )}

//                                                     {delivery.status ===
//                                                         "CANCELLED" && (
//                                                         <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
//                                                             This delivery has
//                                                             been cancelled.
//                                                             Contact support for
//                                                             assistance.
//                                                         </p>
//                                                     )}

//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             loadDeliveries().catch(
//                                                                 () => {}
//                                                             )
//                                                         }
//                                                         disabled={
//                                                             loadingDeliveries
//                                                         }
//                                                         className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
//                                                     >
//                                                         <RefreshCw
//                                                             size={15}
//                                                             className={
//                                                                 loadingDeliveries
//                                                                     ? "animate-spin"
//                                                                     : ""
//                                                             }
//                                                         />
//                                                         Refresh tracking
//                                                     </button>
//                                                 </div>
//                                             ) : deal.status === "ACCEPTED" &&
//                                               isPaymentPaid ? (
//                                                 <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/50 p-4">
//                                                     <div>
//                                                         <p className="font-semibold text-green-900">
//                                                             Payment confirmed
//                                                         </p>

//                                                         <p className="mt-1 text-sm text-green-800">
//                                                             Enter your delivery
//                                                             address to create a
//                                                             pooled delivery
//                                                             request.
//                                                         </p>
//                                                     </div>

//                                                     <div>
//                                                         <label
//                                                             htmlFor={`delivery-location-${deal._id}`}
//                                                             className="mb-1.5 block text-sm font-medium text-gray-700"
//                                                         >
//                                                             Delivery address
//                                                         </label>

//                                                         <textarea
//                                                             id={`delivery-location-${deal._id}`}
//                                                             value={
//                                                                 deliveryLocations[
//                                                                     deal._id
//                                                                 ] || ""
//                                                             }
//                                                             onChange={(event) =>
//                                                                 setDeliveryLocations(
//                                                                     (previous) => ({
//                                                                         ...previous,
//                                                                         [deal._id]:
//                                                                             event
//                                                                                 .target
//                                                                                 .value,
//                                                                     })
//                                                                 )
//                                                             }
//                                                             rows={2}
//                                                             maxLength={500}
//                                                             placeholder="Enter house number, street, village/city, district and PIN code"
//                                                             className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                                                         />
//                                                     </div>

//                                                     <div>
//                                                         <label
//                                                             htmlFor={`delivery-notes-${deal._id}`}
//                                                             className="mb-1.5 block text-sm font-medium text-gray-700"
//                                                         >
//                                                             Delivery
//                                                             instructions
//                                                             (optional)
//                                                         </label>

//                                                         <textarea
//                                                             id={`delivery-notes-${deal._id}`}
//                                                             value={
//                                                                 deliveryNotes[
//                                                                     deal._id
//                                                                 ] || ""
//                                                             }
//                                                             onChange={(event) =>
//                                                                 setDeliveryNotes(
//                                                                     (previous) => ({
//                                                                         ...previous,
//                                                                         [deal._id]:
//                                                                             event
//                                                                                 .target
//                                                                                 .value,
//                                                                     })
//                                                                 )
//                                                             }
//                                                             rows={2}
//                                                             maxLength={1000}
//                                                             placeholder="Any special delivery instructions?"
//                                                             className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                                                         />
//                                                     </div>

//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             handleCreateDelivery(
//                                                                 deal
//                                                             )
//                                                         }
//                                                         disabled={
//                                                             creatingDeliveryId !==
//                                                             null
//                                                         }
//                                                         className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
//                                                     >
//                                                         {creatingDeliveryId ===
//                                                         deal._id ? (
//                                                             <>
//                                                                 <LoaderCircle
//                                                                     size={17}
//                                                                     className="animate-spin"
//                                                                 />
//                                                                 Creating
//                                                                 delivery...
//                                                             </>
//                                                         ) : (
//                                                             <>
//                                                                 <Truck
//                                                                     size={17}
//                                                                 />
//                                                                 Create Delivery
//                                                             </>
//                                                         )}
//                                                     </button>
//                                                 </div>
//                                             ) : deal.status === "ACCEPTED" ? (
//                                                 <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
//                                                     <p className="font-semibold text-amber-900">
//                                                         Payment required
//                                                     </p>

//                                                     <p className="mt-1 text-sm text-amber-800">
//                                                         Complete and verify
//                                                         your payment before
//                                                         creating a pooled
//                                                         delivery.
//                                                     </p>
//                                                 </div>
//                                             ) : (
//                                                 <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
//                                                     Delivery becomes available
//                                                     after the pooled deal is
//                                                     accepted and payment is
//                                                     confirmed.
//                                                 </p>
//                                             )}
//                                         </div>

//                                         {/* Submission date */}
//                                         <p className="mt-4 text-xs text-gray-400">
//                                             Submitted{" "}
//                                             {deal.createdAt
//                                                 ? new Date(
//                                                       deal.createdAt
//                                                   ).toLocaleString("en-IN")
//                                                 : "date unavailable"}
//                                         </p>
//                                     </div>
//                                 </section>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // Statistics card
// const StatCard = ({ title, value, icon: Icon, color, bg }) => (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="flex items-center justify-between">
//             <p className="text-sm font-medium text-gray-500">{title}</p>

//             <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
//                 <Icon size={21} />
//             </div>
//         </div>

//         <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
//     </div>
// );

// // Deal metric
// const Metric = ({ label, value, highlight = false }) => (
//     <div>
//         <p className="text-xs font-medium text-gray-500">{label}</p>

//         <p
//             className={`mt-1 flex items-center gap-1 text-lg font-bold ${
//                 highlight ? "text-green-700" : "text-gray-900"
//             }`}
//         >
//             {highlight && <IndianRupee size={17} />}
//             {highlight ? value.replace("₹", "") : value}
//         </p>
//     </div>
// );

// export default BuyerPooledDeals;

import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Package,
    MapPin,
    Users,
    IndianRupee,
    Clock,
    CheckCircle2,
    AlertCircle,
    CreditCard,
    LoaderCircle,
    Truck,
    CalendarDays,
    Navigation,
} from "lucide-react";

import { getBuyerPooledDeals } from "../../services/pooledDealServices";
import {
    createPooledPaymentOrder,
    verifyPooledPayment,
} from "../../services/pooledPaymentServices";
import {
    createPooledDelivery,
    getBuyerPooledDeliveries,
} from "../../services/pooledDeliveryServices";

import DocumentDownloadButtons from "../../components/common/DocumentDownloadButton";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const responseStyles = {
    PENDING: "text-amber-700 bg-amber-50",
    ACCEPTED: "text-green-700 bg-green-50",
    REJECTED: "text-red-700 bg-red-50",
};

const deliveryStatusStyles = {
    NOT_ASSIGNED: "bg-gray-100 text-gray-700",
    ASSIGNED: "bg-purple-50 text-purple-700",
    PICKED_UP: "bg-amber-50 text-amber-700",
    IN_TRANSIT: "bg-blue-50 text-blue-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const BuyerPooledDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Payment state
    const [payingDealId, setPayingDealId] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState({});
    const [paymentError, setPaymentError] = useState("");
    const [paymentErrorDealId, setPaymentErrorDealId] = useState(null);

    // Pooled delivery state
    const [deliveries, setDeliveries] = useState([]);
    const [deliveryLocations, setDeliveryLocations] = useState({});
    const [deliveryNotes, setDeliveryNotes] = useState({});
    const [creatingDeliveryId, setCreatingDeliveryId] = useState(null);
    const [deliveryError, setDeliveryError] = useState("");
    const [deliverySuccess, setDeliverySuccess] = useState("");
    const [loadingDeliveries, setLoadingDeliveries] = useState(false);

    // Load buyer's pooled deals
    const loadDeals = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result = await getBuyerPooledDeals();
            const data = result?.data ?? result;

            setDeals(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load pooled deals.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Load buyer's pooled deliveries
    const loadDeliveries = useCallback(async () => {
        setLoadingDeliveries(true);

        try {
            const result = await getBuyerPooledDeliveries();
            const data = result?.data ?? result;

            const deliveryList = Array.isArray(data)
                ? data
                : Array.isArray(data?.deliveries)
                  ? data.deliveries
                  : [];

            setDeliveries(deliveryList);
            setDeliveryError("");

            return deliveryList;
        } catch (err) {
            setDeliveryError(
                err.message || "Unable to load pooled deliveries."
            );

            throw err;
        } finally {
            setLoadingDeliveries(false);
        }
    }, []);

    // Load deals and deliveries on mount
    useEffect(() => {
        loadDeals();
        loadDeliveries().catch(() => {});
    }, [loadDeals, loadDeliveries]);

    // Refresh both lists
    const refreshPooledData = async () => {
        setDeliveryError("");
        setDeliverySuccess("");

        const results = await Promise.allSettled([
            loadDeals(true),
            loadDeliveries(),
        ]);

        if (results.some((result) => result.status === "rejected")) {
            setDeliveryError(
                "Some pooled deal or delivery data could not be refreshed."
            );
        }
    };

    // Dashboard statistics
    const totalOffers = deals.length;

    const acceptedOffers = deals.filter(
        (deal) => deal.status === "ACCEPTED"
    ).length;

    const pendingOffers = deals.filter(
        (deal) => deal.status === "PENDING"
    ).length;

    // Handle Razorpay pooled-deal payment
    const handlePooledPayment = async (deal) => {
        if (deal.status !== "ACCEPTED") {
            setPaymentError(
                "Payment is available only for accepted pooled deals."
            );
            setPaymentErrorDealId(deal._id);
            return;
        }

        if (payingDealId !== null) {
            return;
        }

        setPayingDealId(deal._id);
        setPaymentError("");
        setPaymentErrorDealId(null);
        setDeliveryError("");
        setDeliverySuccess("");

        try {
            // Step 1: Create an order on the backend
            const orderResult = await createPooledPaymentOrder(deal._id);
            const order = orderResult?.data ?? orderResult;

            if (!order?.orderId || !order?.paymentId || !order?.key) {
                throw new Error(
                    "The server returned incomplete payment details."
                );
            }

            // Step 2: Load Razorpay Checkout if needed
            if (!window.Razorpay) {
                await new Promise((resolve, reject) => {
                    const existingScript = document.querySelector(
                        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                    );

                    if (existingScript) {
                        existingScript.addEventListener("load", resolve, {
                            once: true,
                        });
                        existingScript.addEventListener(
                            "error",
                            () =>
                                reject(
                                    new Error(
                                        "Unable to load Razorpay Checkout."
                                    )
                                ),
                            { once: true }
                        );
                        return;
                    }

                    const script = document.createElement("script");
                    script.src =
                        "https://checkout.razorpay.com/v1/checkout.js";
                    script.async = true;
                    script.onload = resolve;
                    script.onerror = () =>
                        reject(
                            new Error(
                                "Unable to load Razorpay Checkout. Please try again."
                            )
                        );

                    document.body.appendChild(script);
                });
            }

            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay Checkout could not be initialized."
                );
            }

            // Step 3: Open checkout and verify payment on the backend
            await new Promise((resolve, reject) => {
                let settled = false;

                const resolveOnce = () => {
                    if (settled) return;
                    settled = true;
                    resolve();
                };

                const rejectOnce = (err) => {
                    if (settled) return;
                    settled = true;
                    reject(err);
                };

                const checkout = new window.Razorpay({
                    key: order.key,
                    amount: order.amount,
                    currency: order.currency || "INR",
                    name: "KrishiConnect",
                    description: `Pooled deal ${deal._id}`,
                    order_id: order.orderId,

                    handler: async (razorpayResponse) => {
                        try {
                            const verificationResult =
                                await verifyPooledPayment({
                                    pooledPaymentId: order.paymentId,
                                    razorpay_order_id:
                                        razorpayResponse.razorpay_order_id,
                                    razorpay_payment_id:
                                        razorpayResponse.razorpay_payment_id,
                                    razorpay_signature:
                                        razorpayResponse.razorpay_signature,
                                });

                            const verified =
                                verificationResult?.data ??
                                verificationResult;

                            if (
                                verified?.success === false ||
                                verified?.payment?.status === "FAILED"
                            ) {
                                throw new Error(
                                    verified?.message ||
                                        "Payment verification failed."
                                );
                            }

                            // The verification endpoint must validate the
                            // Razorpay signature on the server.
                            setPaymentSuccess((previous) => ({
                                ...previous,
                                [deal._id]: true,
                            }));

                            setPaymentError("");
                            setPaymentErrorDealId(null);

                            resolveOnce();
                        } catch (err) {
                            rejectOnce(err);
                        }
                    },

                    modal: {
                        ondismiss: () => {
                            rejectOnce(
                                new Error("Payment checkout was closed.")
                            );
                        },
                    },

                    theme: {
                        color: "#16a34a",
                    },
                });

                checkout.on("payment.failed", (response) => {
                    rejectOnce(
                        new Error(
                            response.error?.description ||
                                "Razorpay payment failed."
                        )
                    );
                });

                checkout.open();
            });

            // Step 4: Refresh deals after successful verification
            await Promise.all([
                loadDeals(true),
                loadDeliveries().catch(() => []),
            ]);
        } catch (err) {
            setPaymentError(
                err.message || "Unable to complete pooled payment."
            );
            setPaymentErrorDealId(deal._id);
        } finally {
            setPayingDealId(null);
        }
    };

    // Create a pooled delivery
    const handleCreateDelivery = async (deal) => {
        const deliveryLocation = (
            deliveryLocations[deal._id] || ""
        ).trim();

        if (!deliveryLocation) {
            setDeliveryError(
                "Enter your complete delivery address before continuing."
            );
            setDeliverySuccess("");
            return;
        }

        if (creatingDeliveryId !== null) return;

        setCreatingDeliveryId(deal._id);
        setDeliveryError("");
        setDeliverySuccess("");

        try {
            const result = await createPooledDelivery({
                pooledDealId: deal._id,
                deliveryLocation,
                notes: (deliveryNotes[deal._id] || "").trim(),
            });

            const response = result?.data ?? result;

            setDeliverySuccess(
                response?.message ||
                    result?.message ||
                    "Pooled delivery created successfully."
            );

            // Refresh both lists after creating the delivery
            await Promise.all([
                loadDeals(true),
                loadDeliveries(),
            ]);
        } catch (err) {
            setDeliveryError(
                err.message || "Unable to create pooled delivery."
            );
        } finally {
            setCreatingDeliveryId(null);
        }
    };

    // Initial loading skeleton
    if (loading) {
        return (
            <div className="space-y-5 p-4 sm:p-6">
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

                <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-24 animate-pulse rounded-2xl bg-gray-100"
                        />
                    ))}
                </div>

                <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            KRISHICONNECT / MARKETPLACE
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            My Pooled Deals
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Track your pooled offers, farmer responses,
                            payments and deliveries.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={refreshPooledData}
                        disabled={refreshing || loadingDeliveries}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing || loadingDeliveries
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                        Refresh
                    </button>
                </div>

                {/* Load error */}
                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div className="flex-1">
                            <p className="font-semibold">
                                Could not load pooled deals
                            </p>

                            <p className="mt-1">{error}</p>

                            <button
                                type="button"
                                onClick={() => loadDeals()}
                                className="mt-2 font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total Offers"
                        value={totalOffers}
                        icon={Package}
                        color="text-blue-600"
                        bg="bg-blue-50"
                    />

                    <StatCard
                        title="Awaiting Responses"
                        value={pendingOffers}
                        icon={Clock}
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />

                    <StatCard
                        title="Accepted Offers"
                        value={acceptedOffers}
                        icon={CheckCircle2}
                        color="text-green-600"
                        bg="bg-green-50"
                    />
                </div>

                {/* Empty state */}
                {!error && deals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <Package size={27} />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-gray-900">
                            No pooled offers yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Explore pooled produce and submit an offer to
                            farmers. Your offers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {deals.map((deal) => {
                            const lot =
                                deal.pooledLot &&
                                typeof deal.pooledLot === "object"
                                    ? deal.pooledLot
                                    : {};

                            const contributions = deal.contributions || [];

                            // Find delivery associated with this deal
                            const delivery = deliveries.find((item) => {
                                const linkedDeal =
                                    item.pooledDeal &&
                                    typeof item.pooledDeal === "object"
                                        ? item.pooledDeal._id
                                        : item.pooledDeal;

                                return (
                                    String(linkedDeal) === String(deal._id)
                                );
                            });

                            // Find payment details
                            const savedPayment =
                                deal.pooledPayment ||
                                deal.payment ||
                                deal.pooledPaymentId ||
                                null;

                            const savedPaymentStatus =
                                typeof savedPayment === "object"
                                    ? savedPayment?.status
                                    : deal.paymentStatus;

                            const isPaymentPaid =
                                savedPaymentStatus === "PAID" ||
                                savedPaymentStatus === "CAPTURED" ||
                                paymentSuccess[deal._id] === true;

                            return (
                                <section
                                    key={deal._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* Deal heading */}
                                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {lot.crop || "Pooled Produce"}
                                            </h2>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={15} />
                                                    {lot.location ||
                                                        "Location unavailable"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users size={15} />
                                                    {contributions.length}{" "}
                                                    contributions
                                                </span>
                                            </div>

                                            <p className="mt-2 break-all text-xs text-gray-400">
                                                Offer ID: {deal._id}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                                                statusStyles[deal.status] ||
                                                statusStyles.PENDING
                                            }`}
                                        >
                                            {deal.status || "PENDING"}
                                        </span>
                                    </div>

                                    {/* Deal metrics */}
                                    <div className="grid gap-4 border-b border-gray-100 bg-gray-50/70 p-5 sm:grid-cols-3">
                                        <Metric
                                            label="Total quantity"
                                            value={`${deal.quantity ?? 0} ${
                                                deal.unit || lot.unit || ""
                                            }`}
                                        />

                                        <Metric
                                            label="Offered price / unit"
                                            value={formatCurrency(
                                                deal.offeredPrice
                                            )}
                                        />

                                        <Metric
                                            label="Total offer amount"
                                            value={formatCurrency(
                                                deal.totalAmount
                                            )}
                                            highlight
                                        />
                                    </div>

                                    <div className="p-5">
                                        {/* Farmer responses */}
                                        <h3 className="mb-4 text-sm font-bold text-gray-900">
                                            Farmer responses
                                        </h3>

                                        {contributions.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No contribution details
                                                available.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {contributions.map(
                                                    (contribution, index) => {
                                                        const farmer =
                                                            contribution.farmer &&
                                                            typeof contribution.farmer ===
                                                                "object"
                                                                ? contribution.farmer
                                                                : {};

                                                        const responseStatus =
                                                            contribution.responseStatus ||
                                                            "PENDING";

                                                        return (
                                                            <div
                                                                key={`${
                                                                    contribution
                                                                        .produce
                                                                        ?._id ||
                                                                    contribution.produce ||
                                                                    index
                                                                }-${index}`}
                                                                className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                            >
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">
                                                                        {farmer.name ||
                                                                            `Farmer ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {
                                                                            contribution.quantity
                                                                        }{" "}
                                                                        {deal.unit ||
                                                                            lot.unit ||
                                                                            ""}{" "}
                                                                        contribution
                                                                    </p>

                                                                    {farmer.village && (
                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            {
                                                                                farmer.village
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <span
                                                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                                        responseStyles[
                                                                            responseStatus
                                                                        ] ||
                                                                        responseStyles.PENDING
                                                                    }`}
                                                                >
                                                                    {
                                                                        responseStatus
                                                                    }
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}

                                        {deal.message && (
                                            <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Your message
                                                </p>

                                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                    {deal.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Payment errors */}
                                        {paymentError &&
                                            paymentErrorDealId === deal._id && (
                                                <p
                                                    role="alert"
                                                    className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                                                >
                                                    {paymentError}
                                                </p>
                                            )}

                                        {/* Pooled payment section */}
                                        <div className="mt-5 border-t border-gray-100 bg-white pt-5">
                                            {deal.status === "PENDING" && (
                                                <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
                                                    <Clock
                                                        className="mt-0.5 shrink-0 text-amber-600"
                                                        size={20}
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-amber-800">
                                                            Awaiting farmer
                                                            responses
                                                        </p>

                                                        <p className="mt-1 text-sm text-amber-700">
                                                            Payment becomes
                                                            available once the
                                                            pooled deal is
                                                            accepted.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {deal.status === "ACCEPTED" && (
                                                <div className="flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="font-semibold text-green-900">
                                                            {isPaymentPaid
                                                                ? "Payment verified successfully"
                                                                : "All farmers have accepted"}
                                                        </p>

                                                        <p className="mt-1 text-sm text-green-800">
                                                            {isPaymentPaid
                                                                ? "Your payment has been confirmed."
                                                                : `Amount due: ${formatCurrency(
                                                                      deal.totalAmount
                                                                  )}`}
                                                        </p>
                                                    </div>

                                                    {!isPaymentPaid && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handlePooledPayment(
                                                                    deal
                                                                )
                                                            }
                                                            disabled={
                                                                payingDealId !==
                                                                null
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {payingDealId ===
                                                            deal._id ? (
                                                                <>
                                                                    <LoaderCircle
                                                                        size={17}
                                                                        className="animate-spin"
                                                                    />
                                                                    Processing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard
                                                                        size={17}
                                                                    />
                                                                    Pay Now
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {deal.status === "REJECTED" && (
                                                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                                                    This pooled offer was
                                                    rejected. Payment is
                                                    unavailable.
                                                </div>
                                            )}

                                            {deal.status === "CANCELLED" && (
                                                <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                                                    This pooled offer was
                                                    cancelled. Payment is
                                                    unavailable.
                                                </div>
                                            )}

                                            {deal.status === "COMPLETED" && (
                                                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                                                    This pooled deal is
                                                    completed.
                                                </div>
                                            )}
                                        </div>

                                        {/* Pooled delivery section */}
                                        <div className="mt-5 border-t border-gray-100 pt-5">
                                            <div className="mb-4 flex items-center gap-2">
                                                <Truck
                                                    size={20}
                                                    className="text-green-700"
                                                />

                                                <h3 className="font-bold text-gray-900">
                                                    Pooled Delivery
                                                </h3>
                                            </div>

                                            {deliveryError && (
                                                <div
                                                    role="alert"
                                                    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                                >
                                                    {deliveryError}
                                                </div>
                                            )}

                                            {deliverySuccess && (
                                                <div
                                                    role="status"
                                                    className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                                                >
                                                    {deliverySuccess}
                                                </div>
                                            )}

                                            {delivery ? (
                                                <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/50 p-4">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                Delivery tracking
                                                            </p>

                                                            <p className="mt-1 break-all text-xs text-gray-500">
                                                                Delivery ID:{" "}
                                                                {delivery._id}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                                deliveryStatusStyles[
                                                                    delivery.status
                                                                ] ||
                                                                "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {(
                                                                delivery.status ||
                                                                "NOT_ASSIGNED"
                                                            ).replaceAll(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="flex items-start gap-3">
                                                            <MapPin
                                                                size={18}
                                                                className="mt-0.5 shrink-0 text-green-700"
                                                            />

                                                            <div>
                                                                <p className="text-xs text-gray-500">
                                                                    Pickup
                                                                    location
                                                                </p>

                                                                <p className="mt-1 break-words text-sm font-medium text-gray-800">
                                                                    {delivery.pickupLocation ||
                                                                        "Not available"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <Navigation
                                                                size={18}
                                                                className="mt-0.5 shrink-0 text-green-700"
                                                            />

                                                            <div>
                                                                <p className="text-xs text-gray-500">
                                                                    Delivery
                                                                    location
                                                                </p>

                                                                <p className="mt-1 break-words text-sm font-medium text-gray-800">
                                                                    {delivery.deliveryLocation ||
                                                                        "Not available"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {delivery.deliveryPartner
                                                        ?.name && (
                                                        <div className="rounded-lg border border-gray-100 bg-white p-3">
                                                            <p className="text-xs text-gray-500">
                                                                Delivery partner
                                                            </p>

                                                            <p className="mt-1 font-semibold text-gray-800">
                                                                {
                                                                    delivery
                                                                        .deliveryPartner
                                                                        .name
                                                                }
                                                            </p>

                                                            {delivery
                                                                .deliveryPartner
                                                                .phone && (
                                                                <p className="mt-1 text-sm text-gray-600">
                                                                    {
                                                                        delivery
                                                                            .deliveryPartner
                                                                            .phone
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {delivery.estimatedDeliveryDate && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <CalendarDays
                                                                size={17}
                                                                className="text-green-700"
                                                            />

                                                            <span>
                                                                Estimated
                                                                delivery:{" "}
                                                                {new Date(
                                                                    delivery.estimatedDeliveryDate
                                                                ).toLocaleDateString(
                                                                    "en-IN"
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {delivery.status ===
                                                        "DELIVERED" && (
                                                        <p className="rounded-lg bg-green-100 p-3 text-sm font-medium text-green-800">
                                                            Your pooled produce
                                                            has been delivered.
                                                        </p>
                                                    )}

                                                    {delivery.status ===
                                                        "CANCELLED" && (
                                                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                                            This delivery has
                                                            been cancelled.
                                                            Contact support for
                                                            assistance.
                                                        </p>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            loadDeliveries().catch(
                                                                () => {}
                                                            )
                                                        }
                                                        disabled={
                                                            loadingDeliveries
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                                    >
                                                        <RefreshCw
                                                            size={15}
                                                            className={
                                                                loadingDeliveries
                                                                    ? "animate-spin"
                                                                    : ""
                                                            }
                                                        />
                                                        Refresh tracking
                                                    </button>
                                                </div>
                                            ) : deal.status === "ACCEPTED" &&
                                              isPaymentPaid ? (
                                                <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/50 p-4">
                                                    <div>
                                                        <p className="font-semibold text-green-900">
                                                            Payment confirmed
                                                        </p>

                                                        <p className="mt-1 text-sm text-green-800">
                                                            Enter your delivery
                                                            address to create a
                                                            pooled delivery
                                                            request.
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor={`delivery-location-${deal._id}`}
                                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                                        >
                                                            Delivery address
                                                        </label>

                                                        <textarea
                                                            id={`delivery-location-${deal._id}`}
                                                            value={
                                                                deliveryLocations[
                                                                    deal._id
                                                                ] || ""
                                                            }
                                                            onChange={(event) =>
                                                                setDeliveryLocations(
                                                                    (previous) => ({
                                                                        ...previous,
                                                                        [deal._id]:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            rows={2}
                                                            maxLength={500}
                                                            placeholder="Enter house number, street, village/city, district and PIN code"
                                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor={`delivery-notes-${deal._id}`}
                                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                                        >
                                                            Delivery
                                                            instructions
                                                            (optional)
                                                        </label>

                                                        <textarea
                                                            id={`delivery-notes-${deal._id}`}
                                                            value={
                                                                deliveryNotes[
                                                                    deal._id
                                                                ] || ""
                                                            }
                                                            onChange={(event) =>
                                                                setDeliveryNotes(
                                                                    (previous) => ({
                                                                        ...previous,
                                                                        [deal._id]:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            rows={2}
                                                            maxLength={1000}
                                                            placeholder="Any special delivery instructions?"
                                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCreateDelivery(
                                                                deal
                                                            )
                                                        }
                                                        disabled={
                                                            creatingDeliveryId !==
                                                            null
                                                        }
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                                    >
                                                        {creatingDeliveryId ===
                                                        deal._id ? (
                                                            <>
                                                                <LoaderCircle
                                                                    size={17}
                                                                    className="animate-spin"
                                                                />
                                                                Creating
                                                                delivery...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Truck
                                                                    size={17}
                                                                />
                                                                Create Delivery
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : deal.status === "ACCEPTED" ? (
                                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                    <p className="font-semibold text-amber-900">
                                                        Payment required
                                                    </p>

                                                    <p className="mt-1 text-sm text-amber-800">
                                                        Complete and verify
                                                        your payment before
                                                        creating a pooled
                                                        delivery.
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                                    Delivery becomes available
                                                    after the pooled deal is
                                                    accepted and payment is
                                                    confirmed.
                                                </p>
                                            )}
                                        </div>

                                        {/* Document downloads */}
                                        <DocumentDownloadButtons
                                            id={deal._id}
                                            type="pooled"
                                            status={deal.status}
                                        />

                                        {/* Submission date */}
                                        <p className="mt-4 text-xs text-gray-400">
                                            Submitted{" "}
                                            {deal.createdAt
                                                ? new Date(
                                                      deal.createdAt
                                                  ).toLocaleString("en-IN")
                                                : "date unavailable"}
                                        </p>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Statistics card
const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>

            <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
                <Icon size={21} />
            </div>
        </div>

        <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

// Deal metric
const Metric = ({ label, value, highlight = false }) => (
    <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p
            className={`mt-1 flex items-center gap-1 text-lg font-bold ${
                highlight ? "text-green-700" : "text-gray-900"
            }`}
        >
            {highlight && <IndianRupee size={17} />}
            {highlight ? value.replace("₹", "") : value}
        </p>
    </div>
);

export default BuyerPooledDeals;
