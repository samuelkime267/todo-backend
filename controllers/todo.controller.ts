import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../@types/express";
import { todoBodyType } from "../schemas/todo";
import Todo from "../models/todo.model";
import { CustomError } from "../@types";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserDocument;
    const { status, subtasks, title, description } = req.body as todoBodyType;

    const todos = await Todo.create([
      { title, status, user: user._id, description, subtasks },
    ]);

    if (!todos || todos.length === 0 || !todos[0]) {
      const error = new Error(
        "Something went wrong creating todo"
      ) as CustomError;
      error.statusCode = 400;
      throw error;
    }

    res.status(201).json({
      message: "Todo created successfully",
      success: true,
      data: {
        todo: todos[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = req.resource;

    const { title, description, status, subtasks } = req.body as todoBodyType;

    todo.title = title;
    todo.description = description;
    todo.status = status;
    todo.subtasks = subtasks as any;

    const savedTodo = await todo.save();

    res.status(200).json({
      message: "Todo updated successfully",
      success: true,
      data: {
        todo: savedTodo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = req.resource;

    await todo.deleteOne();

    res.status(200).json({
      message: "Todo deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req?.user?._id as unknown as string;
    const todos = await Todo.find({ user: id });

    res.status(200).json({
      message: "Todos fetched successfully",
      success: true,
      data: {
        todos,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = req.resource;

    res.status(200).json({
      message: "Todo fetched successfully",
      success: true,
      data: {
        todo,
      },
    });
  } catch (error) {
    next(error);
  }
};
