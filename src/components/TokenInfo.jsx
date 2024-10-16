// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTokenPrice, getTokensAvailable } from '../utils/presaleContract.js';

function TokenInfo() {
    const [tokenPrice, setTokenPrice] = useState(null);
    const [tokensAvailable, setTokensAvailable] = useState(null);

    useEffect(() => {
        const fetchTokenInfo = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const price = await getTokenPrice(provider);
                const available = await getTokensAvailable(provider);
                setTokenPrice(ethers.utils.formatEther(price));
                setTokensAvailable(ethers.utils.formatEther(available));
            }
        };
        fetchTokenInfo();
        const interval = setInterval(fetchTokenInfo, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-2">Token Info</h3>
            <div className="space-y-2">
                {tokenPrice !== null ? (
                    <p>Current Token Price: {tokenPrice} ETH</p>
                ) : (
                    <p>Loading token price...</p>
                )}
                {tokensAvailable !== null ? (
                    <p>Tokens Available: {tokensAvailable} CAFI</p>
                ) : (
                    <p>Loading tokens available...</p>
                )}
            </div>
        </div>
    );
}

export default TokenInfo;