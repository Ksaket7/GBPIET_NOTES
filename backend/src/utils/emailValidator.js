import axios from "axios";

export const verifyRealEmail = async (email) => {
  try {
    const response = await axios.get("https://apilayer.net/api/check", {
      params: {
        access_key: process.env.MAILBOXLAYER_KEY,
        email,
      },
    });

    const data = response.data;

    // data.format_valid -> regex
    // data.mx_found -> domain has mail server
    // data.smtp_check -> actual mailbox check
    return data.format_valid && data.mx_found && data.smtp_check;
  } catch (err) {
    console.error("Email verification failed:", err.message);
    return false;
  }
};
