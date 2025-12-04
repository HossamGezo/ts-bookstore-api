// Import express
import express, {type Request, type Response} from "express";
// Import User model and Zod validation functions
import User, {validateUpdateUser} from "../models/User.js";
// Import asyncHandler
import asyncHandler from "express-async-handler";
// Import bcrypt JS
import bcrypt from "bcryptjs";
// Import Middlewares
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middlewares/verifyToken.js";

// Route
const route = express.Router();

/**
 * @desc Update User
 * @route /api/users/:id
 * @method PUT
 * @access private
 */
route.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    // Zod Validation
    const validate = validateUpdateUser(req.body);
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    // Check User
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).json({message: "User Not Found"});
      return;
    }
    // Hash Password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    // Udpate User
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json(updatedUser);
  })
);
/**
 * @desc Get All Users
 * @route /api/users
 * @method GET
 * @access private (only admin)
 */
route.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (_: Request, res: Response) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);
/**
 * @desc Get User By Id
 * @route /api/users/:id
 * @method GET
 * @access private (only admin & user himself)
 */
route.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({message: "User not found"});
      return;
    }
    res.status(200).json(user);
  })
);
/**
 * @desc Delete User
 * @route /api/users/:id
 * @method DELETE
 * @access private (only admin & user himself)
 */
route.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({message: "User not found"});
      return;
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "User has been deleted successfully"});
  })
);

export default route;
