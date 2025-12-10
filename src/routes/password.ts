// - - - - - - - - - - Import Libraries
// *** Import Express
import express from "express";
import {
  getForgotPasswordView,
  getRestPasswordView,
  resetPassword,
  sendForgotPasswordLink,
} from "../controllers/passwordController.js";

// - - - - - - - - - - Password Router
const router = express.Router();

// - - - - - - - - - - HTTP Verbs (methods)
// *** password/forgot-password
router
  .route("/forgot-password")
  .get(getForgotPasswordView)
  .post(sendForgotPasswordLink);

// *** password/reset-password/:userId/:token
router
  .route("/reset-password/:userId/:token")
  .get(getRestPasswordView)
  .post(resetPassword);

export default router;
