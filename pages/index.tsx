import { useState } from 'react';
import getTokenBalances from '../utils/getTokenBalances';

export default function Home() {
  const [address, setAddress] = useState('');
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    try {
      console.log("🔎 Checking address:", address);
      const result = await getTokenBalances(address);
      setBalances(result);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError('Failed to fetch balances. Please check the address.');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h1>🧾 Wallet Checker</h1>

      <input
        type="text"
        placeholder="Enter EVM address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          marginBottom: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />

      <button
        onClick={handleCheck}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}
      >
        {loading ? 'Checking...' : 'Check'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {balances.length > 0 && (
        <div>
          <h3>💼 Balances:</h3>
          <ul>
            {balances.map((b, i) => (
              <li key={i}>
                {b.symbol}: {b.amount.toFixed(4)} (${b.usd.toFixed(2)})
              </li>
            ))}
          </ul>
          <h4>
            🧮 Total USD: $
            {balances.reduce((sum, b) => sum + b.usd, 0).toFixed(2)}
          </h4>
        </div>
      )}
    </div>
  );
}
