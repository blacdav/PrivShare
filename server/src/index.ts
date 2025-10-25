import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
// import { dbConn } from "./db";
// import router from "./routes";
import { appConfig } from "./config";
import cookie from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/v1", router);

app.use(cookie());

// dbConn();

// Add this at the bottom of your Express app setup
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(appConfig.port, () => {
  console.log(`Server is running on http://localhost:${appConfig.port}`);
});