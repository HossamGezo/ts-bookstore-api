import mongoose from "mongoose";

const connectToDB = async () => {
  // Ensure MONGO_URI exists (TypeScript safety check)
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing!");
  }
  // Handle Promise
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB…");
  } catch (error) {
    console.error("Failed to connect to MongoDB!", error);
  }
};

export default connectToDB;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB…"))
//   .catch((error) => console.error("Failed to connect to MongoDB!", error));
