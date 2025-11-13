import express from 'express'
const app = express();
const PORT = 3000;
import transactionsRouter from "./routes/transactions.js";

app.use(express.json());
app.use('/transactions', transactionsRouter);

app.get('/', (req, res) => {
  res.send('API Catatan Uang berjalan');
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
