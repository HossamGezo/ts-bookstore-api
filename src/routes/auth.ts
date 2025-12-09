// - - - - - - - - - - Import Libraries
// *** Import Express
import express from "express";

// - - - - - - - - - - Import Local Files
// *** Import Book Controller Routes
import {loginUser, registerUser} from "../controllers/authController.js";

// - - - - - - - - - - Auth routes: handles user registration and login
const route = express.Router();

// *** api/auth/register
route.post("/register", registerUser);
// *** api/auth/login
route.post("/login", loginUser);

export default route;
