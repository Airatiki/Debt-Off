export interface Wallet {
  id: string;
  name: string;
  amount: number;
}

export interface User {
  email: string;
  wallets: string[];
}
