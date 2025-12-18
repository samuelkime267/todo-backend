import { Response, Request, NextFunction } from "express";
import { todoBodySchema } from "../schemas/todo";

export const createTodoValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  try {
    const parsedBody = todoBodySchema.parse(body);

    req.body = parsedBody;
    next();
  } catch (error) {
    next(error);
  }
};
