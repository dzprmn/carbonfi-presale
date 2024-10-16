// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contribute, getPresaleInfo, getPresaleStatus, getTokensSold } from '../utils/contractInteraction';

function PresaleForm() {
    const [bnbAmount, setBnbAmount] = useState('');
    const [cafiAmount, setCafiAmount] = useState('');
    const [presaleInfo, setPresaleInfo] = useState(null);
    const [presaleStatus, setPresaleStatus] = useState('');
    const [tokensSold, setTokensSold] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPresaleInfo();
        const interval = setInterval(fetchPresaleInfo, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchPresaleInfo = async () => {
        try {
            const [info, status, sold] = await Promise.all([
                getPresaleInfo(),
                getPresaleStatus(),
                getTokensSold()
            ]);
            setPresaleInfo(info);
            setPresaleStatus(status);
            setTokensSold(sold);
        } catch (error) {
            console.error("Error fetching presale info:", error);
            setError("Failed to fetch presale information. Please try again later.");
        }
    };

    const handleBnbAmountChange = (e) => {
        const value = e.target.value;
        setBnbAmount(value);
        if (presaleInfo && value !== '') {
            const tokens = parseFloat(value) / parseFloat(presaleInfo.tokenPrice);
            setCafiAmount(tokens.toFixed(2));
        } else {
            setCafiAmount('');
        }
    };

    const handleCafiAmountChange = (e) => {
        const value = e.target.value;
        setCafiAmount(value);
        if (presaleInfo && value !== '') {
            const bnb = parseFloat(value) * parseFloat(presaleInfo.tokenPrice);
            setBnbAmount(bnb.toFixed(8));
        } else {
            setBnbAmount('');
        }
    };

    const handleContribute = async () => {
        setLoading(true);
        setError('');
        try {
            if (!bnbAmount || isNaN(parseFloat(bnbAmount))) {
                throw new Error("Please enter a valid BNB amount.");
            }
            if (parseFloat(bnbAmount) < parseFloat(presaleInfo.minContribution) || parseFloat(bnbAmount) > parseFloat(presaleInfo.maxContribution)) {
                throw new Error(`Contribution amount must be between ${presaleInfo.minContribution} and ${presaleInfo.maxContribution} BNB`);
            }
            if (presaleStatus !== "Active") {
                throw new Error(`Presale is not active. Current status: ${presaleStatus}`);
            }

            const remainingTokens = parseFloat(presaleInfo.hardCap) - parseFloat(tokensSold);
            if (parseFloat(cafiAmount) > remainingTokens) {
                throw new Error(`Contribution would exceed hard cap. Maximum contribution allowed: ${remainingTokens.toFixed(2)} CAFI`);
            }

            await contribute(bnbAmount);
            alert('Contribution successful!');
            setBnbAmount('');
            setCafiAmount('');
            fetchPresaleInfo(); // Refresh presale info after contribution
        } catch (error) {
            console.error("Error contributing:", error);
            if (error.message.includes("Hardcap reached")) {
                setError("The presale hard cap has been reached. No more contributions are possible.");
            } else {
                setError(`Failed to contribute: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const isHardCapReached = parseFloat(tokensSold) >= parseFloat(presaleInfo?.hardCap || 0);

    return (
        <div className="h-full flex flex-col bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Contribute to Presale</h2>
            {error && <p className="text-red-500 mb-6">{error}</p>}

            <div className="mb-6">
                <div className="flex items-center mb-3">
                    <img src="/bnb-logo.png" alt="BNB" className="w-8 h-8 mr-3" />
                    <span className="text-white text-lg font-medium">BNB</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <input
                        type="number"
                        value={bnbAmount}
                        onChange={handleBnbAmountChange}
                        className="bg-transparent text-white text-right text-xl w-full focus:outline-none"
                        placeholder="0.00"
                        disabled={isHardCapReached}
                    />
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center mb-3">
                    <img src="/cafi-logo.png" alt="CAFI" className="w-8 h-8 mr-3" />
                    <span className="text-white text-lg font-medium">CAFI</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <input
                        type="number"
                        value={cafiAmount}
                        onChange={handleCafiAmountChange}
                        className="bg-transparent text-white text-right text-xl w-full focus:outline-none"
                        placeholder="0.00"
                        disabled={isHardCapReached}
                    />
                </div>
            </div>

            {presaleInfo && (
                <div className="space-y-3 mb-8 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-lg">Token Price:</span>
                        <span className="text-white text-lg font-semibold">1 BNB = {1 / parseFloat(presaleInfo.tokenPrice)} CAFI</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-lg">Min Contribution:</span>
                        <span className="text-white text-lg font-semibold">{presaleInfo.minContribution} BNB</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-lg">Max Contribution:</span>
                        <span className="text-white text-lg font-semibold">{presaleInfo.maxContribution} BNB</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-lg">Tokens Sold:</span>
                        <span className="text-white text-lg font-semibold">{tokensSold} / {presaleInfo.hardCap} CAFI</span>
                    </div>
                </div>
            )}

            <button
                onClick={handleContribute}
                disabled={loading || !bnbAmount || presaleStatus !== "Active" || isHardCapReached}
                className={`mt-auto w-full bg-green-500 text-white py-4 px-6 rounded-md hover:bg-green-600 transition-colors font-semibold text-lg ${(loading || !bnbAmount || presaleStatus !== "Active" || isHardCapReached) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isHardCapReached ? 'Hard Cap Reached' : loading ? 'Processing...' : 'Contribute'}
            </button>
        </div>
    );
}

export default PresaleForm;