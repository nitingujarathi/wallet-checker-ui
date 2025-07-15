import { useState } from 'react';
import getTokenBalances from '../utils/getTokenBalances';

type Token = {
  symbol: string;
  amount: number;
  usd: number;
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const balances = await getTokenBalances(address);
      setTokens(balances);
    } catch (err) {
      setError('Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧾 Wallet Checker</h1>
      <input
        type="text"
        placeholder="Enter EVM Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          padding: '10px',
          width: '300px',
          marginRight: '10px',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />
      <button
        onClick={handleCheck}
        disabled={!address || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Check Wallet'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      <div style={{ marginTop: '2rem' }}>
        {tokens.map((token, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '10px',
              textAlign: 'left'
            }}
          >
            <strong>{token.symbol}</strong>: {token.amount.toFixed(4)} (~${token.usd.toFixed(2)})
          </div>
        ))}
      </div>
    </div>
  );
}
