// - - - - - - - - - - Import Libraries
// *** Import Dotenv
import {config} from "dotenv";

// - - - - - - - - - - Import Local Files
// *** Import Author Model
import Author from "../models/Author.js";
// *** Import Author Data
import {authors} from "../data/authors.data.js";
// *** Import connectToDB Function
import connectToDB from "../config/db.js";

// - - - - - - - - - - Load Environment Variables From .Env File
config();

// - - - - - - - - - - Connect To Database
connectToDB();

// - - - - - - - - - - Seeding Authors To Database
const seedAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors has been seeded");
    process.exit(0); // Exit process with sucess code
  } catch (error) {
    console.log("Error seeding authors:", error);
    process.exit(1); // Exit process with failure code
  }
};

// - - - - - - - - - - Removing Authors From Database
const reomveAuthors = async () => {
  try {
    await Author.deleteMany();
    console.log("Authors has been removed");
    process.exit(0); // Exit process with success code
  } catch (error) {
    console.log("Error Removing Authors", error);
    process.exit(1); // Exit process with failure code
  }
};

// - - - - - - - - - - Execution Functions
if (process.argv[2] === "-seed") {
  seedAuthors();
} else if (process.argv[2] === "-remove") {
  reomveAuthors();
} else {
  console.log("Please run with '-seed' or '-remove'");
  process.exit(1);
}
