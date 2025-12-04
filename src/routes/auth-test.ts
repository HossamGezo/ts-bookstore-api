// Import Express
import express, {type Request, type Response} from "express";
// Import Express Async Handler
import asyncHandler from "express-async-handler";
// Import User Model & Zod Validation Functions
import User, {validateLoginUser, validateRegisterUser} from "../models/User.js";
// Import bycryptjs
import bcrypt from "bcryptjs";

// Auth Routes: handles user registeration and login
const route = express.Router();

/**
 * @dec Register new user
 * @route /api/authtest/register
 * @method POST
 * @access public
 */
route.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    // Zod Validation
    const validate = validateRegisterUser(req.body);
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    // Check Email
    const isExist = await User.findOne({email: req.body.email});
    if (isExist) {
      res.status(400).json({message: "This user already registered"});
      return;
    }
    // Create New User
    // -- Hash user password with bcrypt before saving to DB for security
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    // -- Create new user
    const user = new User({...req.body, password: hash});
    const result = await user.save();
    const token = null;
    // Exclude Password from response
    const {password, ...userData} = result.toObject();
    // Response
    res.status(201).json({...userData, token});
  })
);

/**
 * @desc Login User
 * @route /api/authtest/login
 * @method POST
 * @access public
 */
route.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    // Zod Validation
    const validate = validateLoginUser(req.body);
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    // Check Email
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      res.status(400).json({message: "Email or Password is incorrect"});
      return;
    }
    // Check Password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordMatch) {
      res.status(400).json({message: "Email or Password is incorrect"});
      return;
    }
    const token = null;
    const {password, ...userData} = user.toObject();
    // Response
    res.status(200).json({...userData, token});
  })
);

export default route;
