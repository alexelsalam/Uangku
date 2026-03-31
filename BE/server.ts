import express, { Request, Response } from "express";
import transactionsRouter from "./routes/transactions";
import authRouter from "./routes/auth";
import middleware from "./middleware/middleware";
import cors from "cors";

// Create an Express application
// and configure CORS to allow requests from specific origins
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", // dev FE
      "https://uangku.vercel.app", // prod FE
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/", authRouter);
app.use("/transactions", middleware, transactionsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("API Catatan Uang berjalan");
});

export default app;
