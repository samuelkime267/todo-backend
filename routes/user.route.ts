import express from "express";
import { getUser, getUsers, getMe } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticated, getMe);

userRouter.get("/:id", isAuthenticated, getUser);

userRouter.get("/", isAuthenticated, getUsers);

export default userRouter;
