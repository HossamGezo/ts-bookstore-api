// - - - - - - - - - - Import Libraries
// *** Import Express
import express from "express";

// - - - - - - - - - - Import Local Files
// *** Import Middlewares
import {verifyTokenAndAdmin} from "../middlewares/verifyToken.js";
// *** Import Book Controller Routes
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

// - - - - - - - - - - Router
const router = express.Router();

// Book Routers
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);
router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

export default router;
