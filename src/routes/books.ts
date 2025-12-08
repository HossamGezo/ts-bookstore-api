// - - - - - - - - - - Import Libraries
// *** Import Express
import express, {type Request, type Response} from "express";
// *** Import Express Async Handler
import asyncHandler from "express-async-handler";

// - - - - - - - - - - Import Local Files
// *** Import Book Model & Validation Functions
import Book, {validateBook} from "../models/Book.js";
// *** Import Middlewares
import {verifyTokenAndAdmin} from "../middlewares/verifyToken.js";

// - - - - - - - - - - Router
const router = express.Router();

// - - - - - - - - - - HTTP Methods (Verbs)
/**
 * @desc Get All Books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    /**
     * Comparison Query Operators // We Use It For Filtering Using ( req.query object )
     * $eq : Equal
     * $ne : Not Equal
     * $lt : Less Than
     * $lte: Less Than And Equal
     * $gt : Greater Than
     * $gte: Greater Than And Equal
     * $in : Include    -- Take An Array [8,9] -- All Books With Price 8 & 9
     * $nin: NotInclude -- Take An Array [8,9] -- All Books Except That With Price 8 & 9
     */
    const {minPrice, maxPrice} = req.query; // Filtering
    let books;
    if (minPrice && maxPrice) {
      books = await Book.find({price: {$gte: minPrice, $lte: maxPrice}})
        /**
         * Because I created a relationship between the Book collection and the Author collection,
         * we use the populate() method to retrieve the related data from the Author collection by
         * specifying its " field name ".
         */
        .populate("author", ["_id", "firstName", "lastName"]);
    } else {
      books = await Book.find().populate("author", [
        "_id",
        "firstName",
        "lastName",
      ]);
    }
    res.status(200).json(books);
    return;
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
    if (!book) {
      res.status(404).json({message: "Book Not Found"});
      return;
    }
    res.status(200).json(book);
    return;
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
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    const book = new Book({...req.body});
    const result = await book.save();
    res.status(201).json(result);
    return;
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
    if (!book) {
      res.status(404).json({message: "Book Not Found"});
      return;
    }
    const validate = validateBook(req.body);
    if (!validate.success) {
      res.status(400).json({message: validate.error.message});
      return;
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {$set: {...req.body}},
      {new: true}
    );
    res.status(200).json(updatedBook);
    return;
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
    if (!book) {
      res.status(404).json({message: "Book Not Found"});
      return;
    }
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Book has been deleted"});
    return;
  })
);

// Exporting
export default router;
