import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import mongoose from "mongoose";
import { LoginBodyType, SignUpBodyType } from "../schemas/auth";
import { CustomError } from "../@types";
import { generateToken } from "../utils";
import Token from "../models/token.model";
import { UserDocument } from "../@types/express";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, name } = req.body as SignUpBodyType;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await User.create([
      { name, email, password: hashedPassword },
    ]);

    if (!users || users.length === 0 || !users[0]) {
      const error = new Error(
        "Something went wrong creating user"
      ) as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const token = generateToken(users[0]._id.toString());

    const user = {
      _id: users[0]._id,
      name: users[0].name,
      email: users[0].email,
    };

    await session.commitTransaction();
    session.endSession();

    res
      .cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api/v1/auth",
      })
      .status(201)
      .json({
        message: "User created successfully",
        success: true,
        user,
        token,
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as LoginBodyType;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("Invalid credentials") as CustomError;
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id.toString());

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res
      .cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api/v1/auth",
      })
      .status(200)
      .json({
        message: "User logged in successfully",
        success: true,
        user: userData,
        token,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, tokenExpiryDate } = req;
    const { refreshToken } = req.cookies;
    if (!user || !tokenExpiryDate || !refreshToken) {
      const error = new Error("User not authenticated") as CustomError;
      error.statusCode = 401;
      throw error;
    }

    const token = await Token.findOne({ refreshToken });

    if (token) {
      const error = new Error("User already logged out") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    // const refreshExpires = Date.now();

    await Token.create([
      {
        refreshToken,
        tokenExpiryDate,
        user: user._id,
      },
    ]);

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth",
      })
      .status(200)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const token = generateToken(user._id.toString(), true);

  res.status(200).json({
    message: "Generated Access Token Successfully",
    success: true,
    token,
  });
};
