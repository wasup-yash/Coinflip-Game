"use client";
import '../app/globals.css';
import { useState } from 'react';
import { ethers } from 'ethers';

function CoinflipGame({ contractAddress }) {
    const [amount, setAmount] = useState("");
    const [choice, setChoice] = useState(null);
    const [result, setResult] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
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

        // Show popup if negative amount is entered
        if (parseFloat(amount) <= 0) {
            alert("Please enter a positive amount.");
            return;
        }

        try {
            const contract = new ethers.Contract(contractAddress, [
                "function flip(uint256 _amount, bool _choice) public",
            ], signer);

            const randomResult = Math.random() < 0.5;

            const amountInEther = ethers.parseUnits(amount, 18);
            let displayResult;

            if (choice === randomResult) {
                const doubledAmount = parseFloat(amount) * 2;
                displayResult = `You Win! 🎉 Your amount is doubled to ${doubledAmount} ETH.`;
            } else {
                displayResult = `You Lose. 😞 You lost ${amount} ETH. Better luck next time.`;
            }

            setResult(displayResult);

            const tx = await contract.flip(amountInEther, choice);
            await tx.wait();
            setActiveButton(null);
        } catch (error) {
            console.error("Error executing flip:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <h1 className="text-4xl font-bold mb-8 text-white text-center">Welcome to the Coinflip Game</h1>
            <p className="mb-8 text-lg text-gray-300 text-center">
                This is a simulated coin flip game. If luck is on your side, you might double your ETH; otherwise, you might lose it if you're unlucky.
            </p>
            
            {!walletAddress ? (
                <button style={{ display: 'block', margin: '0 auto' }}
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
                             className={`heads px-4 py-2 mx-2 rounded ${choice === true ? "bg-green-500" : "bg-gray-500"} ${activeButton === 'heads' ? 'scale-110' : ''}`}
                             onClick={() => { setChoice(true); setActiveButton('heads'); }}
                        >
                            Heads
                        </button>
                        <button style={{ display: 'block', margin: '0 -20px 0px  auto', marginTop: -40 }}
                            className={`tails px-4 py-2 mx-2 rounded ${choice === false ? "bg-red-500" : "bg-gray-500"} ${activeButton === 'tails' ? 'scale-110' : ''}`}
                            onClick={() => { setChoice(false); setActiveButton('tails'); }}
                        >
                            Tails
                        </button>
                    </div>

                    <button style={{ display: 'block', margin: '0 auto' }}
                        className="flip-coin bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
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
