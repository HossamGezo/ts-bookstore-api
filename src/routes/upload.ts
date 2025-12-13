// - - - - - - - - - - Import Libraries
// *** Import Express
import express, {type Request, type Response} from "express";
// *** Import multer
import multer from "multer";
// *** Import Path
import path from "path";

// - - - - - - - - - - Upload Router
const router = express.Router();

// - - - - - - - - - - Temporary Middleware
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(process.cwd(), "public", "images"));
  },
  filename: (_, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const upload = multer({storage});

// - - - - - - - - - - HTTP Methods (Verbs)
/**
 * @desc Upload Image
 * @route /api/upload
 * @method POST
 * @access public
 */
router.post("/", upload.single("image"), (req: Request, res: Response) => {
  res
    .status(200)
    .json({message: "Image Uploaded", filename: req.file?.filename});
  return;
});

export default router;
