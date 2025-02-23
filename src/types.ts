export interface Wallet {
  id: string;
  name: string;
  platform: Platform;
  purpose: string;
  chain: Chain;
  address: string;
  privateKey?: string;
  email?: string;
}

export interface User {
  email: string;
  password: string;
}

export type Platform = 'Binance' | 'KuCoin' | 'MEXC' | 'MetaMask' | 'Trust Wallet' | 'Other';
export type Chain = 'BNB' | 'TRC20' | 'SUI' | 'ARB' | 'SOL';

export const PLATFORMS: Platform[] = ['Binance', 'KuCoin', 'MEXC', 'MetaMask', 'Trust Wallet', 'Other'];
export const CHAINS: Chain[] = ['BNB', 'TRC20', 'SUI', 'ARB', 'SOL'];