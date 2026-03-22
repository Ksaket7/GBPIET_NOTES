import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import sendEmail from "../utils/sendEmail.js";
import { verifyRealEmail } from "../utils/emailValidator.js";

export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }
  let isReal = false;
  try {
    isReal = await verifyRealEmail(email);
  } catch (err) {
    console.error("Email verification failed:", err.message);
  }

  if (!isReal) {
    throw new ApiError(400, "Please enter a valid email");
  }

  await sendEmail({ name, email, message });

  res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
});
