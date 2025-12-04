// Import Express
import express from "express";

// Import Dotenv
import {config} from "dotenv";

// Import connectToDB Function
import connectToDB from "./config/db.js";

// Import Middlewares
import logger from "./middlewares/logger.js";
import {errorHandler, notFound} from "./middlewares/errors.js";

// Import Routers
import BooksRouter from "./routes/books.js";
import AuthorsRouter from "./routes/authors.js";
import authRouter from "./routes/auth.js";
// import authTestRouter from "./routes/auth-test.js";
import updateUserRouter from "./routes/users.js";

// Load environment variables from .env file
config();

// Connect to MongoDB
connectToDB();

// Initialize App
const app = express();

// Apply Middlewares
app.use(express.json());
app.use(logger);

// Routers
app.use("/api/books", BooksRouter);
app.use("/api/authors", AuthorsRouter);
app.use("/api/auth", authRouter);
// app.use("/api/authtest", authTestRouter);
app.use("/api/users", updateUserRouter);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  )
);
