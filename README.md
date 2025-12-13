# 📚 Bookstore API

A comprehensive, production-ready RESTful API for an online Bookstore system.
Built with modern technologies to ensure scalability, security, and clean architecture.

## 🚀 Technologies & Tools

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Bcryptjs, Helmet, CORS
- **File Upload:** Multer
- **Template Engine:** EJS (for Password Reset)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Registration & Login:** Hashed passwords using `bcryptjs`.
- **JWT Authorization:** Protected routes verify user identity via tokens.
- **Password Complexity:** Enforced strong passwords (uppercase, lowercase, numbers, special chars) using Zod regex.
- **Forgot/Reset Password:** Secure flow using temporary one-time links sent via email (simulated) with EJS views.

### 👥 User Management
- **CRUD Operations:** Create, Read, Update, Delete users.
- **Role-Based Access Control:**
  - **Admins:** Can manage all users.
  - **Users:** Can only manage their own profile.
- **Password Privacy:** Passwords are automatically excluded from all API responses.

### 📚 Books & Authors (The Core)
- **Advanced Filtering:** Filter books by price range (`minPrice`, `maxPrice`).
- **Pagination:** Efficiently handle large datasets using `skip` and `limit`.
- **Relationships:** Books are linked to Authors via Mongoose population.
- **Image Upload:** Upload book covers or author photos to the server using `Multer`.

### 🛠️ Developer Tools & Architecture
- **MVC Architecture:** Clean separation of concerns (Models, Views, Controllers, Routes).
- **Database Seeding:** Automated scripts to populate the DB with dummy data for testing (`npm run seed:books`).
- **Type Safety:** Full TypeScript support for robust and error-free code.
- **Centralized Error Handling:** Consistent error responses across the API.

---

## ⚙️ Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HossamGezo/ts-bookstore-api.git
   cd bookstore-api
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_super_secret_key
   NODE_ENV=development
   ```

4. **Run Database Seeder (Optional):**
   ```bash
   npm run seed:books
   ```

5. **Start the Server:**
   ```bash
   # Development Mode
   npm run dev
   
   # Production Build
   npm run build
   npm start
   ```

---

## 🔗 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user | Public |
| **POST** | `/api/auth/login` | Login user | Public |
| **POST** | `/password/forgot-password` | Send reset link | Public |
| **GET** | `/api/books` | Get books (with pagination & filter) | Public |
| **POST** | `/api/books` | Add new book | Admin |
| **POST** | `/api/upload` | Upload an image | Public |
| **GET** | `/api/authors` | Get authors (with pagination) | Public |

---

## 👨‍💻 Author

**Hossam**
- Passionate Full Stack Developer specialized in the MERN Stack (MongoDB, Express, React, Node.js).