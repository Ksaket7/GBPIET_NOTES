import express from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
  completeProfile,
  logoutUser,
  getUserProfile,
  getCurrentUser,
  updateAccountDetails,
  deleteUserCoverImage,
  updateUserAvatar,
  updateUserCoverImage,
  changeCurrentPassword,
  updateUserRole,
  getFacultyUsers,
  getStudentUsers,
  getUserSuggestions,
  getUserActivity,
  getLandingData,
  getTopContributors,
  getLeaderboardDashboard,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.route("/register").post(
  upload.single("avatar"), // only one file named 'avatar'
  registerUser
);
router.route("/login").post(loginUser);
router.route("/google").post(googleAuth);
router.route("/landing").get(getLandingData);
router.route("/top-contributors").get(getTopContributors);
router.route("/complete-profile").patch(verifyJWT, completeProfile);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/activity").get(verifyJWT, getUserActivity);
router.route("/leaderboard-dashboard").get(verifyJWT, getLeaderboardDashboard);
router.route("/suggestions").get(verifyJWT, getUserSuggestions);
router.route("/faculty").get(verifyJWT, getFacultyUsers);
router.route("/students").get(verifyJWT, getStudentUsers);
router.route("/profile/:username").get(verifyJWT, getUserProfile);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/cover-image").delete(verifyJWT, deleteUserCoverImage);

router.route("/update-role").patch(verifyJWT,verifyRole("admin"), updateUserRole);
export default router;
