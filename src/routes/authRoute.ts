import express from "express";
import passport from "../config/passport";
import { loginUserCtrl, registerUserCtrl } from "../controllers/authController";

const router = express.Router();

// /api/auth/register
router.post("/register", registerUserCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

// Google OAuth routes
// /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    try {
      // Generate JWT token
      const token = req.user.generateAuthToken();

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&userId=${req.user._id}`
      );
    } catch (error) {
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:4200"
        }/login?error=auth_failed`
      );
    }
  }
);

export { router as authRouter };
