// Importing Zod
import {z} from "zod";
// Importing Mongoose
import mongoose from "mongoose";

// ----------------------------------- Express Validation ------------------------------------

const BookSchema = z.object({
  title: z
    .string()
    .min(3, {message: "Characters must be at least 3 characters"}),
  author: z.string(),
  description: z
    .string()
    .min(3, {message: "Characters must be at least 3 characters"}),
  price: z.number().int(),
  cover: z.enum(["soft cover", "hard cover"]),
});

type BookSchemaProps = z.infer<typeof BookSchema>;

// Validate Book Function
export function validateBook(obj: BookSchemaProps) {
  const validate = BookSchema.safeParse(obj);
  return validate;
}

// ----------------------------------- Mongoose Validation -----------------------------------

const MongoBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Characters must be at least 3 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Characters must be at least 3 characters"],
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", MongoBookSchema);

export default Book;
