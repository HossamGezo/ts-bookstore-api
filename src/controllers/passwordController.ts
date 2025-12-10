// - - - - - - - - - - Import Libraries
// *** Import Express Types
import type {Request, Response} from "express";
// *** Import Async Handler Express
import asyncHandler from "express-async-handler";
// *** Import Json Web Token
import jwt from "jsonwebtoken";
// *** Import Bcrypt Js
import bcrypt from "bcryptjs";

// - - - - - - - - - - Import Local Files
// *** Import User Model
import User from "../models/User.js";

// - - - - - - - - - - HTTP Verbs (methods)
/**
 * @desc Get Fortgot Password View
 * @route password/forgot-password
 * @method GET
 * @access public
 */
export const getForgotPasswordView = asyncHandler(
  (_: Request, res: Response) => {
    res.render("forgot-password");
  }
);
/**
 * @desc Send Forgot Password Link
 * @route password/forgot-password
 * @method POST
 * @access public
 */
export const sendForgotPasswordLink = asyncHandler(
  async (req: Request, res: Response) => {
    // Check User Existence
    const email = req.body.email;
    const user = await User.findOne({email: email});
    if (!user) {
      res.status(404).json({message: "User Not Found"});
      return;
    }
    // Generate Forgot Password Link
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({id: user._id, email: user.email}, secret, {
      expiresIn: "10m",
    });
    const link = `http://localhost:${process.env.PORT}/password/reset-password/${user.id}/${token}`;
    // Response
    res
      .status(200)
      .json({message: "Click on the link", resetPasswordLink: link});
  }
  // TODO: send email to the user
);
/**
 * @desc Get Rest Password View
 * @route password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
export const getRestPasswordView = asyncHandler(
  async (req: Request, res: Response) => {
    // Check User Existence
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({message: "User Not Found"});
      return;
    }
    // Check Token Existence
    if (!req.params.token) {
      res.status(403).json({message: "Not Authorized"});
      return;
    }
    // Reset Password
    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
      jwt.verify(req.params.token, secret);
      res.render("reset-password", {email: user.email});
      return;
    } catch (error) {
      console.log(error);
      res.status(401).json({message: "Not Valid Token" + error});
      return;
    }
  }
);
/**
 * @desc Reset Password
 * @route password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
export const resetPassword = asyncHandler(
  // TODO: Validation
  async (req: Request, res: Response) => {
    // *** Check User
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({message: "User Not Found"});
      return;
    }

    // *** Check Token Existence
    if (!req.params.token) {
      res.status(403).json({message: "Not Authorized"});
      return;
    }

    // *** Reset Password
    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
      jwt.verify(req.params.token, secret);
      // *** Update Password
      // * Hash New Password
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const updatedUser = {password: hash};
      // * Update Database With New Password
      await User.findByIdAndUpdate(user._id, {$set: updatedUser}, {new: true});
      // *** Response
      res.render("success-password");
      return;
    } catch (error) {
      console.log(error);
      res.status(401).json({message: "Not Valid Token" + error});
      return;
    }
  }
);
