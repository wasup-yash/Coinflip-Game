import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } else {
      alert('Please install MetaMask');
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default WalletConnect;
