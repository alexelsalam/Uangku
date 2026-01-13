import express from "express";
import transactionsRouter from "./routes/transactions.js";
import authRouter from "./routes/auth.js";
import middleware from "./middleware/middleware.js";
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
  })
);

app.use(express.json());
app.use("/", authRouter);
app.use("/transactions", middleware, transactionsRouter);

app.get("/", (req, res) => {
  res.send("API Catatan Uang berjalan");
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});

export default app;
