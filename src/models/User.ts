// Import Mongoose
import mongoose from "mongoose";
// Import Zod
import {z} from "zod";
// Impot Jsonwebtoken
import jwt from "jsonwebtoken";

// --------------------------------------------------------- MongoDB Validation

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 21,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      regex: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {id: this._id, isAdmin: this.isAdmin},
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "1h",
    }
  );
};

const User = mongoose.model("User", UserSchema);

// --------------------------------------------------------- Express Validation

// -------------------- Register Schema
const registerSchema = z
  .object({
    userName: z.string().min(3).max(21).trim(),
    email: z
      .string()
      .trim()
      .regex(/^\S+@\S+\.\S+$/, "Please enter a valid email address"),
    password: z.string().min(8).trim(),
  })
  .strict();
type RegisterSchemaProps = z.infer<typeof registerSchema>;

// -------------------- Login Schema
const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(/^\S+@\S+\.\S+$/, "Please enter a valid email address"),
    password: z.string().min(3).max(21).trim(),
  })
  .strict();

type LoginSchemaProps = z.infer<typeof loginSchema>;

// -------------------- Update Schema
const updateSchema = z
  .object({
    userName: z.string().min(3).max(21).trim().optional(),
    email: z
      .string()
      .trim()
      .regex(/^\S+@\S+\.\S+$/, "Please enter a valid email address")
      .optional(),
    password: z.string().min(8).trim().optional(),
  })
  .strict();
type UpdateSchemaProps = z.infer<typeof updateSchema>;

// --------------------------------------------------------- Express Validation Functions

// -------------------- Validate Register User
const validateRegisterUser = (obj: RegisterSchemaProps) => {
  const parseResult = registerSchema.safeParse(obj);
  return parseResult;
};
// -------------------- Validate Login User
const validateLoginUser = (obj: LoginSchemaProps) => {
  const parseResult = loginSchema.safeParse(obj);
  return parseResult;
};
// -------------------- Validate Update User
const validateUpdateUser = (obj: UpdateSchemaProps) => {
  const parseResult = updateSchema.safeParse(obj);
  return parseResult;
};

// --------------------------------------------------------- Export
export {validateRegisterUser, validateLoginUser, validateUpdateUser};
export default User;
