import { Response, Request, NextFunction } from "express";
import { loginSchema, signUpSchema } from "../schemas/auth";

export const signUpValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  try {
    const parsedBody = signUpSchema.parse(body);

    req.body = parsedBody;
    next();
  } catch (error) {
    next(error);
  }
};

export const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  try {
    const parsedBody = loginSchema.parse(body);

    req.body = parsedBody;
    next();
  } catch (error) {
    next(error);
  }
};
