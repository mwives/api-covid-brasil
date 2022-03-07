import "express-async-errors";
import "reflect-metadata";
import "../../container/providers";

import express, { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { router } from "./routes";

const app = express();

app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      mensagem: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      mensagem: "Erro interno de servidor",
    });
  }
});

export { app };
