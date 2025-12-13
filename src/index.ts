// *** Import Express
import express from "express";

// *** Import Path
import path from "path";

// *** Import Helmet
import helmet from "helmet";

// *** Import Cors
import cors from "cors";

// *** Import Dotenv
import {config} from "dotenv";

// *** Import connectToDB Function
import connectToDB from "./config/db.js";

// *** Import Middlewares
import logger from "./middlewares/logger.js";
import {errorHandler, notFound} from "./middlewares/errors.js";

// *** Import Routers
import BooksRouter from "./routes/books.js";
import AuthorsRouter from "./routes/authors.js";
import AuthRouter from "./routes/auth.js";
import UpdateUserRouter from "./routes/users.js";
import PasswordRouter from "./routes/password.js";
import UploadRouter from "./routes/upload.js";

// *** Load environment variables from .env file
config();

// *** Connect to MongoDB
connectToDB();

// *** Initialize App
const app = express();

// *** Static Folder
app.use(express.static(path.join(process.cwd(), "public", "images")));

// *** Apply Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);

// *** Helmet
app.use(helmet);

// *** Cors Policy
app.use(
  cors({
    origin: "http://localhost:3000", // Only That Domain Can Take Services From API
  })
);

// *** Set View Engine
app.set("view engine", "ejs");

// *** Routers
app.use("/api/books", BooksRouter);
app.use("/api/authors", AuthorsRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/users", UpdateUserRouter);
app.use("/api/upload", UploadRouter);
app.use("/password", PasswordRouter);

// *** Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// *** Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  )
);
