import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ProduceForm from "../../components/Farmer/ProduceForm";

import {
    getProduceById,
    updateProduce,
} from "../../services/produceservices.js";

const formatDateForInput = (date) => {
    if (!date) return "";

    return new Date(date)
        .toISOString()
        .split("T")[0];
};

const EditProduce = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produce, setProduce] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadProduce = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getProduceById(id);

                setProduce({
                    crop: data.produce.crop,
                    quantity:
                        data.produce.quantity,
                    unit: data.produce.unit,
                    expectedPrice:
                        data.produce.expectedPrice,
                    location:
                        data.produce.location,
                    quality:
                        data.produce.quality,
                    availableFrom:
                        formatDateForInput(
                            data.produce
                                .availableFrom
                        ),
                    description:
                        data.produce.description ||
                        "",
                });
            } catch (error) {
                setError(
                    error.message ||
                    "Unable to load listing."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduce();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            setError("");

            await updateProduce(
                id,
                formData
            );

            navigate("/farmer/produce");
        } catch (error) {
            setError(
                error.message ||
                "Unable to update listing."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                    <p className="text-sm font-medium text-gray-500">
                        Loading produce listing...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !produce) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
                <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">
                        Unable to load listing
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/farmer/produce"
                            )
                        }
                        className="mt-6 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
                    >
                        Back to My Produce
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ProduceForm
            title="Edit Produce Listing"
            subtitle="Update the details of your active produce listing."
            submitLabel="Save Changes"
            initialValues={produce}
            onSubmit={handleSubmit}
            loading={saving}
            error={error}
            onCancel={() =>
                navigate("/farmer/produce")
            }
        />
    );
};

export default EditProduce;