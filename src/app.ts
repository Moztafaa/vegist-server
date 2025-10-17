import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import db from "./config/connectToDb";
import { errorHandler, notFound } from "./middleware/error";
import { authRouter } from "./routes/authRoute";
import { userRouter } from "./routes/userRoute";

dotenv.config();
//connect to db
db();

//init app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

//routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

//running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
