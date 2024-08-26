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
        if (!signer || !contractAddress || !amount || choice === null) return;

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
            await tx.wait();
        } catch (error) {
            console.error("Error executing flip:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <h1 className="text-4xl font-bold mb-8 text-white text-center">Welcome to the Coinflip Game</h1>
            
            {!walletAddress ? (
                <button
                    className="connect-wallet text-white font-bold py-2 px-4 rounded"
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="text-center text-white">
                    <p className="mb-4">Connected Wallet: {walletAddress}</p>

                    <input
                        type="number"
                        placeholder="Enter amount"
                        className="border rounded p-2 mb-4 text-black"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <div className="flex justify-center mb-4">
                        <button
                            className={`heads px-4 py-2 mx-2 rounded ${choice === true ? "bg-green-500" : "bg-gray-500"}`}
                            onClick={() => setChoice(true)}
                        >
                            Heads
                        </button>
                        <button
                            className={`tails px-4 py-2 mx-2 rounded ${choice === false ? "bg-red-500" : "bg-gray-500"}`}
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

                    {result && (
                        <p className="mt-4 text-xl font-semibold">{result}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CoinflipGame;
