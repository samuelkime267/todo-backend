import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { isAuthenticated, isAuthorized } from "../middleware";
import { createTodoValidator } from "../validators/todo.validator";
import Todo from "../models/todo.model";

const todoRouter = express.Router();

todoRouter.post("/", createTodoValidator, isAuthenticated, createTodo);

todoRouter.patch("/:id", isAuthenticated, isAuthorized(Todo), updateTodo);

todoRouter.delete("/:id", isAuthenticated, isAuthorized(Todo), deleteTodo);

todoRouter.get("/", isAuthenticated, getTodos);

todoRouter.get("/:id", isAuthenticated, isAuthorized(Todo), getTodo);

export default todoRouter;
