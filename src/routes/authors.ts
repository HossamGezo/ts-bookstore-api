// - - - - - - - - - - Import Libraries
// *** Import Express
import express, {type Request, type Response} from "express";
// *** Import Express Async Handler
import asyncHandler from "express-async-handler";

// - - - - - - - - - - Import Local Files
// *** Import Book Model & Validation Functions
import Author, {validateAuthor} from "../models/Author.js";
// *** Import Middlewares
import {verifyTokenAndAdmin} from "../middlewares/verifyToken.js";

// - - - - - - - - - - Router
const router = express.Router();

// - - - - - - - - - - HTTP Methods (Verbs)
/**
 * @desc Get All Authors
 * @route /api/authors
 * @method GET
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.page) || 1;
    const authorsPerPage = 2;
    const authorsList = await Author.find()
      .skip((pageNumber - 1) * authorsPerPage)
      .limit(authorsPerPage);
    // .sort({firstName: -1}) // 👉 Use 1 for ascending order and -1 for descending order.
    // .select("firstName lastName -_id"); // 👉 Write the data you want to display, and to hide the ID, use -_id.
    res.status(200).json(authorsList);
    return;
  })
);
/**
 * @desc Get Author By Id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
      return;
    } else {
      res.status(404).json({message: "Author Not Found"});
      return;
    }
  })
);
/**
 * @desc Create A New Author
 * @route /api/authors
 * @method POST
 * @access private (only admin)
 */
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    // Validation
    const validate = validateAuthor(req.body);
    // Doesn't Pass Express Validation
    if (!validate.success) {
      res.status(400).json(validate.error);
      return;
    }
    // Pass Express Validation
    // Create New Author To Save It In Database
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });
    // Save Author in Database
    const result = await author.save(); // Promise Expression
    // Response
    res.status(201).json(result);
    return;
  })
);
/**
 * @desc Update An Author
 * @route /api/authors/:id
 * @method PUT
 * @access private (only admin)
 */
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const validate = validateAuthor(req.body);
    if (!validate.success) {
      res.json(validate.error);
      return;
    }
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        // 👉 To update data, you must write it inside the $set property.
        $set: {...req.body},
      },
      {new: true} // 👉 If you want the updated author to appear, you must write { new: true } as the third argument.
    );
    res.status(200).json(author);
    return;
  })
);
/**
 * @desc Delete An Author
 * @route /api/author/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const author = await Author.findById(req.params.id); // 👉 Find an author by ID.
    if (author) {
      await Author.findByIdAndDelete(req.params.id); // 👉 Use this command to delete an author.
      res.status(200).json({message: "Author has been deleted"});
      return;
    } else {
      res.status(404).json({message: "Author Not Found"});
      return;
    }
  })
);

export default router;
