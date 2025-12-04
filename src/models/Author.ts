// Importing Zod
import {z} from "zod";
// Importing Mongoose
import mongoose from "mongoose";

// ----------------------------------- Express Validation -----------------------------------

// Zod Schema
const AuthorSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "FirstName Must Be At Least 3 Characters")
    .max(200),
  lastName: z.string().trim().min(3, "LastName Must Be At Least 3 Characters"),
  nationality: z
    .string()
    .trim()
    .min(3, "Nationality Must Be At Least 3 Characters")
    .max(200),
  image: z
    .string()
    .trim()
    .min(3, "Image URL Must Be At Least 3 Characters")
    .max(200)
    .optional(),
});

// Types
type AuthorType = z.infer<typeof AuthorSchema>;

// Validate Create Author & Update Author Functions
export function validateAuthor(obj: AuthorType) {
  const parseResult = AuthorSchema.safeParse(obj);
  return parseResult;
}

// ----------------------------------- Mongoose Validation -----------------------------------

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    image: {
      type: String,
      default: "default-image.png",
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);



export default Author;
