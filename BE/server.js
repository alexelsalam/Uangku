import express from "express";
const app = express();
import transactionsRouter from "./routes/transactions.js";
import authRouter from "./routes/auth.js";
import middleware from "./middleware/middleware.js";

app.use(express.json());
app.use("/", authRouter);
app.use("/transactions", middleware, transactionsRouter);

app.get("/", (req, res) => {
  res.send("API Catatan Uang berjalan");
});
