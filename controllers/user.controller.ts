import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { CustomError } from "../@types";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ user, success: true, message: "User fetched successfully" });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      user: req.user,
      success: true,
      message: "User fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      users,
      success: true,
      message: "Users fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
