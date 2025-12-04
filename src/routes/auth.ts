// Import Express
import express, {type Request, type Response} from "express";
// Import Express Async Handler
import asyncHandler from "express-async-handler";
// Import Zod Validation Function
import {validateLoginUser, validateRegisterUser} from "../models/User.js";
// Import User Model
import User from "../models/User.js";
// Impot Bcrypt JS
import bcrypt from "bcryptjs";
// Impot Jsonwebtoken
import jwt from "jsonwebtoken";

// Auth routes: handles user registration and login
const route = express.Router();

/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
route.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    // Zod validation
    const validate = validateRegisterUser(req.body);
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    // Check if he is a unique user
    const uniqueUser = await User.findOne({email: req.body.email});
    if (uniqueUser)
      res.status(400).json({message: "This user already registered"});
    // Hash user password with bcrypt before saving to DB for security
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    // Create new user
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hash,
    });
    const result = await user.save();
    // Generate Token
    const token = jwt.sign(
      {id: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET_KEY!,
      {expiresIn: "30d"}
    );
    // Alternative Solution For Token
    /*
      utils/generateToken.ts
      ----------------------
      export const generateToken = (id: string, isAdmin: boolean) => {
        return jwt.sign({id, isAdmin}, process.env.JWT_SECRET_KEY!, {
          expiresIn: "30d",
        });
      };
      const token = generateToken(user._id, user.isAdmin);
      Exclude password from response
     */
    const {password, ...userData} = result.toObject(); // The new alternative of result._doc from mongoose
    res.status(201).json({...userData, token});
  })
);

/**
 * @desc Login User
 * @route /api/auth/login
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
      res.status(400).json({message: "Invalid email or password"});
      return;
    }
    // Check Password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      res.status(400).json({message: "Invalid email or password"});
      return;
    }
    const token = jwt.sign(
      {id: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "30d",
      }
    );
    const {password, ...userData} = user.toObject();
    res.status(200).json({...userData, token});
  })
);

export default route;
