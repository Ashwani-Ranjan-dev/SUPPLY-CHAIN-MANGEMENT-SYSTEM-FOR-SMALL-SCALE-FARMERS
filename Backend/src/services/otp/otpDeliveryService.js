import axios from "axios";

/**
 * Formats a 10-digit Indian phone number to standard international format (without + for MSG91).
 */
const formatPhoneNumber = (phone) => {
  const cleaned = phone.toString().replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned;
  }
  return cleaned;
};

/**
 * Sends an OTP via SMS gateway.
 * @param {string} phone - Target mobile number
 * @param {string} otp - Plaintext OTP
 */
export const sendOtpSms = async (phone, otp) => {
  const formattedPhone = formatPhoneNumber(phone);

  // In local development or if SMS provider isn't configured, skip network call safely
  if (process.env.NODE_ENV !== "production" && !process.env.MSG91_AUTH_KEY) {
    // Development fallback (keep logs safe from production)
    console.info(`[DEV MODE] OTP generated for ${formattedPhone.slice(-4)}: ${otp}`);
    return { success: true, simulated: true };
  }

  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: formattedPhone,
        otp: otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.type === "error") {
      throw new Error(response.data.message || "Provider returned an error");
    }

    return { success: true };
  } catch (error) {
    // Log only safe operational error details; never log secrets or the raw OTP
    console.error("SMS Gateway delivery failure:", error.response?.data?.message || error.message);
    throw new Error("Failed to send OTP via SMS gateway");
  }
};