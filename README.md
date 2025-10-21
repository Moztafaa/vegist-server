# Authentication & User Management API

A clean, minimal Node.js/Express/TypeScript backend API with authentication and user management.

## Features

- ✅ User registration and login with JWT authentication
- ✅ **Google OAuth 2.0 authentication** (NEW!)
- ✅ Password hashing with bcrypt
- ✅ User profile management (CRUD operations)
- ✅ Role-based authorization (admin, user)
- ✅ MongoDB database integration
- ✅ Input validation with Joi
- ✅ TypeScript for type safety
- ✅ Security headers with Helmet
- ✅ CORS enabled

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: bcryptjs, helmet, cors

## Installation

Follow these steps to get the API up and running on your local machine:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Moztafaa/vegist-server.git
   ```

2. Install the project dependencies using npm:

   ```bash
   cd vegist-server
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables:

   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/your_database_name
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:4200
   ```

4. Start the server:

   ```bash
   npm run build && npm run start
   ```

   Or for development with auto-reload:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Traditional Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Google OAuth 2.0
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback (redirects to frontend with token)

> 📖 For detailed Google OAuth setup instructions, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

### Users

- `GET /api/users/profile` - Get all users (Admin only)
- `GET /api/users/profile/:id` - Get user by ID
- `PUT /api/users/profile/:id` - Update user profile (Owner only)
- `DELETE /api/users/profile/:id` - Delete user (Owner or Admin)
- `GET /api/users/count` - Get users count (Admin only)

## Project Structure

```
src/
├── app.ts                    # Main application entry point
├── config/
│   └── connectToDb.ts        # MongoDB connection
├── controllers/
│   ├── authController.ts     # Register & Login
│   └── userController.ts     # User CRUD operations
├── middleware/
│   ├── error.ts              # Error handling
│   ├── validateObjectId.ts   # MongoDB ID validation
│   └── verifyToken.ts        # JWT verification & authorization
├── models/
│   └── User.ts               # User model & validation schemas
└── routes/
    ├── authRoute.ts          # Auth endpoints
    └── userRoute.ts          # User endpoints
```

## Usage in Other Projects

This is a clean starter template that can be easily integrated into other projects. Simply:

1. Copy the entire project
2. Update the `.env` file with your database credentials
3. Modify the User model to fit your needs
4. Add additional routes and controllers as needed

## Scripts

- `npm run dev` - Run development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server

## License

This project is licensed under the MIT License.

## Contact Information

For any inquiries or feedback, please contact imoztafa@gmail.com
