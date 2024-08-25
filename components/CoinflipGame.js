"use client";

import { useState } from 'react';
import { ethers } from 'ethers';

function CoinflipGame({ contractAddress }) {
    const [amount, setAmount] = useState("");
    const [choice, setChoice] = useState(null);
    const [result, setResult] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [error, setError] = useState(""); // To store error message

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                await newProvider.send("eth_requestAccounts", []);
                const newSigner = await newProvider.getSigner();
                const address = await newSigner.getAddress();
                setWalletAddress(address);
                setProvider(newProvider);
                setSigner(newSigner);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this app.");
        }
    };

    const handleFlip = async () => {
        if (!signer || !contractAddress || !amount || choice === null) {
            setError("❗ Please enter a valid amount."); // Show error if input is invalid
            setResult(null); // Hide result if invalid
            return;
        }

        // Clear error message if amount is valid
        setError("");

        try {
            const contract = new ethers.Contract(contractAddress, [
                "function flip(uint256 _amount, bool _choice) public",
            ], signer);

            const randomResult = Math.random() < 0.5;

            if (choice === randomResult) {
                setResult("You Win! 🎉 Your amount is doubled.");
            } else {
                setResult("You Lose. 😞 Better luck next time.");
            }

            const tx = await contract.flip(ethers.parseUnits(amount, 18), choice);
            await tx.wait(); // Wait for the transaction to be mined
        } catch (error) {
            console.error("Error executing flip:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="text-3xl font-bold mb-8">Coinflip Game</h1>
            
            {!walletAddress ? (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center connect-wallet-button"
                    onClick={connectWallet}
                >
                    <img src="/images/metamask.png" alt="MetaMask" className="w-6 h-6 mr-2" />
                    Connect Wallet
                </button>
            ) : (
                <div className="text-center">
                    <p className="mb-4">Connected Wallet: {walletAddress}</p>

                    <div className="flex items-center justify-center mb-4">
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="border rounded py-2 px-4 text-right w-36"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="ml-2 text-white">ETH</span>
                    </div>

                    <div className="flex justify-center mb-4">
                        <button
                            className={`px-4 py-2 mx-2 rounded ${choice === true ? "bg-green-500" : "bg-gray-500"}`}
                            onClick={() => setChoice(true)}
                        >
                            Heads
                        </button>
                        <button
                            className={`px-4 py-2 mx-2 rounded ${choice === false ? "bg-red-500" : "bg-gray-500"}`}
                            onClick={() => setChoice(false)}
                        >
                            Tails
                        </button>
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleFlip}
                    >
                        Flip Coin
                    </button>

                    {error && (
                        <p className="mt-4 text-xl font-semibold text-red-500">{error}</p>
                    )}

                    {result && !error && (
                        <p className="mt-4 text-xl font-semibold">{result}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CoinflipGame;
