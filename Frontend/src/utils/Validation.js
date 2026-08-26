export const validateRegistration = (formData) => {
    const errors = {};

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const village = formData.village.trim();
    const district = formData.district.trim();
    const state = formData.state.trim();

    if (!name) {
        errors.name = "Please enter your full name.";
    } else if (name.length < 3) {
        errors.name = "Name must contain at least 3 characters.";
    }

    if (!phone) {
        errors.phone = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
        errors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!village) {
        errors.village = "Please enter your village.";
    }

    if (!district) {
        errors.district = "Please enter your district.";
    }

    if (!state) {
        errors.state = "Please enter your state.";
    }

    if (
        formData.role === "FARMER" &&
        !formData.farmerType
    ) {
        errors.farmerType = "Please select a farmer category.";
    }

    return errors;
};