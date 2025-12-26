import express from "express";
import { PORT } from "./config/env";
import connectDb from "./database/db";
import userRouter from "./routes/user.route";
import todoRouter from "./routes/todo.routes";
import authRouter from "./routes/auth.routes";
import { errorMiddleware } from "./middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

connectDb(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
