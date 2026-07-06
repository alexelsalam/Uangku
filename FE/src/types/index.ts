export type GroupId = "needs" | "wants" | "investment";
export interface CustomJwtPayload {
  username: string;
  exp: number;
  // Add other fields your token contains
}
export type TransactionType = "Pemasukan" | "Pengeluaran";
