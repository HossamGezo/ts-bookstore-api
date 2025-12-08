// - - - - - - - - - - Import Libraries
// *** Import Dotenv
import {config} from "dotenv";

// - - - - - - - - - - Import Local Files
// *** Import Book model
import Book from "../models/Book.js";
// *** Import Books Data
import {books} from "../data/books.data.js";
// *** Import connectToDB Function
import connectToDB from "../config/db.js";

// - - - - - - - - - - Load Environment Variables From .Env File
config();

// - - - - - - - - - - Connected To MongoDB
connectToDB();

// - - - - - - - - - - Seeding Books To Database
const seedBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Books has been seeded");
    process.exit(0); // Exit process with success code
  } catch (error) {
    console.log("Error seeding books:", error);
    process.exit(1); // Exit process with failure code
  }
};

// - - - - - - - - - - Removing Books From Database
const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Books has been removed");
    process.exit(0); // Exit process with success code
  } catch (error) {
    console.log("Error removing books:", error);
    process.exit(1); // Exit process with failure code
  }
};

// - - - - - - - - - - Function Execution
if (process.argv[2] === "-seed") {
  seedBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
} else {
  console.log("Please run with '-seed' or '-remove'");
  process.exit(1);
}
