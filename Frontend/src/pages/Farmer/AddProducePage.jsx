import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ProduceForm from "../../components/Farmer/ProduceForm";
import { createProduce } from "../../services/produceservices.js";

const AddProduce = () => {
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            setError("");

            await createProduce(formData);

            navigate("/farmer/produce");
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
        <ProduceForm
            title="Add New Produce"
            subtitle="Create a listing for buyers to discover your produce."
            submitLabel="Create Listing"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            onCancel={() =>
                navigate("/farmer/produce")
            }
        />
    );
};

export default AddProduce;