// - - - - - - - - - - Import Libraries
// *** Import Express Types
import type {Request, Response} from "express";
// *** Import Express Async Handler
import asyncHandler from "express-async-handler";
// *** Impot Bcrypt JS
import bcrypt from "bcryptjs";
// *** Impot Jsonwebtoken
import jwt from "jsonwebtoken";

// - - - - - - - - - - Import Local Files
// *** Import User Model & Validation Functions
import User, {validateLoginUser, validateRegisterUser} from "../models/User.js";

// - - - - - - - - - - HTTP Methods (Verbs)
/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Zod validation
    const validate = validateRegisterUser(req.body);
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    // Check if he is a unique user
    const uniqueUser = await User.findOne({email: req.body.email});
    if (uniqueUser) {
      res.status(400).json({message: "This user already registered"});
      return;
    }
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
    return;
  }
);
/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
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
  return;
});
