import { ethers } from 'ethers';
import axios from 'axios';

console.log("🔥 getTokenBalances.ts loaded");

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const TOKENS = [
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    coingeckoId: "tether"
  },
  {
    symbol: "USDC",
    address: "0xA0b86991C6218b36c1d19D4a2e9Eb0cE3606EB48",
    coingeckoId: "usd-coin"
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    coingeckoId: "dai"
  }
];

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

const getTokenBalances = async (address: string) => {
  try {
    console.log("⛽ Fetching ETH balance for", address);

    const balances = [];
    const ethBalance = await provider.getBalance(address);
    const ethAmount = parseFloat(ethers.formatEther(ethBalance));
    console.log("✅ ETH Balance:", ethAmount);

    const ethPrice = await getUSDPrice('ethereum');
    console.log("💰 ETH USD Price:", ethPrice);

    balances.push({
      symbol: 'ETH',
      amount: ethAmount,
      usd: ethAmount * ethPrice
    });

    for (const token of TOKENS) {
      try {
        console.log(`🔍 Fetching ${token.symbol} for`, address);
        const contract = new ethers.Contract(
          ethers.getAddress(token.address),
          ERC20_ABI,
          provider
        );
        const rawBalance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        const symbol = await contract.symbol();
        const amount = parseFloat(ethers.formatUnits(rawBalance, decimals));
        console.log(`✅ ${symbol} Balance:`, amount);
        if (amount > 0) {
          const usdPrice = await getUSDPrice(token.coingeckoId);
          console.log(`💵 ${symbol} USD Price:`, usdPrice);
          balances.push({
            symbol,
            amount,
            usd: amount * usdPrice
          });
        }
      } catch (tokenErr) {
        console.warn(`❌ Failed fetching ${token.symbol}`, tokenErr);
      }
    }

    console.log("📊 Final balances:", balances);
    return balances;
  } catch (err) {
    console.error("❌ Failed to fetch balances (ETH or tokens):", err);
    return [];
  }
};

const getUSDPrice = async (coingeckoId: string): Promise<number> => {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: coingeckoId,
        vs_currencies: 'usd'
      }
    });
    return res.data[coingeckoId]?.usd || 0;
  } catch (err) {
    console.warn(`⚠️ Price fetch failed for ${coingeckoId}`, err);
    return 0;
  }
};

export default getTokenBalances;
