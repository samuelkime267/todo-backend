import { Request, Response, NextFunction } from "express";
import { CustomError } from "../@types";

export const isAuthorized = (
  model: any,
  paramKey: string = "id",
  ownerField: string = "user"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await model.findById(req.params[paramKey]);

      if (!resource) {
        const error = new Error("Resource not found") as CustomError;
        error.statusCode = 404;
        throw error;
      }

      if (resource[ownerField].toString() !== req?.user?._id.toString()) {
        const error = new Error(
          "You are not authorized to perform this action"
        ) as CustomError;
        error.statusCode = 403;
        throw error;
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
