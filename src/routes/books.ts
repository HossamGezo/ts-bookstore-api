// Importing Express
import express, {type Request, type Response} from "express";
// Importing Validation
import {validateBook} from "../models/Book.js";
import Book from "../models/Book.js";
// Importing Express Async Handler
import asyncHandler from "express-async-handler";
// import Middlewares
import {verifyTokenAndAdmin} from "../middlewares/verifyToken.js";

// Router
const router = express.Router();

// HTTP Methods / Verbs

/**
 * @desc Get All Books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (_: Request, res: Response) => {
    /**
     * Because I created a relationship between the Book collection and the Author collection,
     * we use the populate() method to retrieve the related data from the Author collection by
     * specifying its " field name ".
     */
    const books = await Book.find().populate("author", [
      "_id",
      "firstName",
      "lastName",
    ]);
    res.status(200).json(books);
  })
);

/**
 * @desc Get Book By Id
 * @route /api/books/:id
 * @method GET
 * @access public
 */
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) res.status(404).json({message: "Book Not Found"});
    res.status(200).json(book);
  })
);

/**
 * @desc Create A New Book
 * @route /api/books
 * @method POST
 * @access private (only admin)
 */
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const validate = validateBook(req.body);
    if (!validate.success)
      res.status(400).json({message: validate.error.message});
    const book = new Book({...req.body});
    const result = await book.save();
    res.status(201).json(result);
  })
);

/**
 * @desc Update A Book By Id
 * @route /api/books/:id
 * @method PUT
 * @access private (only admin)
 */
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id);
    if (!book) res.status(404).json({message: "Book Not Found"});
    const validate = validateBook(req.body);
    if (!validate.success)
      res.status(400).json({message: validate.error.message});
    await Book.findByIdAndUpdate(
      req.params.id,
      {$set: {...req.body}},
      {new: true}
    );
    res.status(200).json({message: "Book has been updated"});
  })
);

/**
 * @desc Delete A Book By Id
 * @route /api/books/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id);
    if (!book) res.status(404).json({message: "Book Not Found"});
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Book has been deleted"});
  })
);

// Exporting
export default router;
