import express from "express";

import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/auth.controller";
import { loginValidator, signUpValidator } from "../validators/auth.validator";
import { isAuthenticated, isValidRefreshToken } from "../middleware";

const authRouter = express.Router();

authRouter.post("/signup", signUpValidator, signup);

authRouter.post("/login", loginValidator, login);

authRouter.post("/logout", isAuthenticated, isValidRefreshToken, logout);

authRouter.post("/refresh-token", isValidRefreshToken, refreshToken);

export default authRouter;
