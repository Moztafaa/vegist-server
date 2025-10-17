import Router from "express";
import {
  deleteUserProfileCtrl,
  getAllUserCtrl,
  getUserProfileCtrl,
  getUsersCount,
  updateUserProfileCtrl,
} from "../controllers/userController";
import validateObjectId from "../middleware/validateObjectId";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyTokenAndOnlyUser,
} from "../middleware/verifyToken";

const router = Router();

// /api/users/profile
router.get("/profile", verifyTokenAndAdmin, getAllUserCtrl);

// /api/users/profile/:id
router.get("/profile/:id", validateObjectId, getUserProfileCtrl);
router.put(
  "/profile/:id",
  validateObjectId,
  verifyTokenAndOnlyUser,
  updateUserProfileCtrl
);
router.delete(
  "/profile/:id",
  validateObjectId,
  verifyTokenAndAuthorization,
  deleteUserProfileCtrl
);

// /api/users/count
router.get("/count", verifyTokenAndAdmin, getUsersCount);

export { router as userRouter };
