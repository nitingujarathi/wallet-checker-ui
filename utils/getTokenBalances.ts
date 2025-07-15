import { ethers } from 'ethers';
import axios from 'axios';

// Standard ERC20 ABI
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Predefined common token contracts on Ethereum (can be extended)
const TOKENS = [
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48"
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  }
];

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL); // set this in your .env

const getTokenBalances = async (address: string) => {
  const balances = [];

  // ETH balance
  const ethBalance = await provider.getBalance(address);
  const ethAmount = parseFloat(ethers.formatEther(ethBalance));
  const ethPrice = await getUSDPrice('ethereum');
  balances.push({
    symbol: 'ETH',
    amount: ethAmount,
    usd: ethAmount * ethPrice
  });

  // ERC-20 tokens
  for (const token of TOKENS) {
    const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
    const rawBalance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    const symbol = await contract.symbol();
    const amount = parseFloat(ethers.formatUnits(rawBalance, decimals));
    if (amount > 0) {
      const usdPrice = await getUSDPrice(symbol.toLowerCase());
      balances.push({
        symbol,
        amount,
        usd: amount * usdPrice
      });
    }
  }

  return balances;
};

const getUSDPrice = async (symbol: string): Promise<number> => {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: symbol,
        vs_currencies: 'usd'
      }
    });
    return res.data[symbol]?.usd || 0;
  } catch (err) {
    console.error(`Price fetch failed for ${symbol}`, err);
    return 0;
  }
};

export default getTokenBalances;
