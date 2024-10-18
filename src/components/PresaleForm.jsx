// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePresale } from '../contexts/PresaleContext';
import {
    contribute,
    getPresaleInfo,
    getPresaleStatus,
    getTokensSold,
    isCorrectNetwork,
    switchToCorrectNetwork,
    getUserContribution
} from '../utils/contractInteraction';

function PresaleForm() {
    const [bnbAmount, setBnbAmount] = useState('');
    const [cafiAmount, setCafiAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [presaleInfo, setPresaleInfo] = useState(null);
    const [presaleStatus, setPresaleStatus] = useState('');
    const [tokensSold, setTokensSold] = useState('0');
    const [userContribution, setUserContribution] = useState('0');
    const [userTokenAllocation, setUserTokenAllocation] = useState('0');
    const { account, refreshData } = usePresale();

    useEffect(() => {
        fetchPresaleInfo();
        const interval = setInterval(fetchPresaleInfo, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (account) {
            fetchUserContribution();
        }
    }, [account]);

    useEffect(() => {
        if (presaleInfo && userContribution) {
            const tokenAllocation = parseFloat(userContribution) / parseFloat(presaleInfo.tokenPrice);
            setUserTokenAllocation(tokenAllocation.toFixed(2));
        }
    }, [presaleInfo, userContribution]);

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

    const fetchUserContribution = async () => {
        try {
            const contribution = await getUserContribution(account);
            setUserContribution(contribution);
        } catch (error) {
            console.error("Error fetching user contribution:", error);
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
            if (!(await isCorrectNetwork())) {
                const switched = await switchToCorrectNetwork();
                if (!switched) {
                    throw new Error("Please switch to the correct network to contribute");
                }
            }

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
            refreshData();
            fetchPresaleInfo();
            fetchUserContribution();
        } catch (error) {
            console.error("Error contributing:", error);
            setError(error.message || "Failed to contribute. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isHardCapReached = parseFloat(tokensSold) >= parseFloat(presaleInfo?.hardCap || 0);

    return (
        <div className="flex flex-col h-full p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Contribute to Presale</h2>
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            <div className="mb-4">
                <label htmlFor="bnb-amount" className="block text-sm font-medium text-gray-400 mb-1">BNB Amount</label>
                <div className="flex items-center bg-gray-700 rounded-md p-2">
                    <input
                        id="bnb-amount"
                        type="number"
                        value={bnbAmount}
                        onChange={handleBnbAmountChange}
                        className="bg-transparent text-white text-lg w-full focus:outline-none"
                        placeholder="0.00"
                        disabled={isHardCapReached}
                    />
                    <span className="text-white ml-2">BNB</span>
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="cafi-amount" className="block text-sm font-medium text-gray-400 mb-1">CAFI Amount</label>
                <div className="flex items-center bg-gray-700 rounded-md p-2">
                    <input
                        id="cafi-amount"
                        type="number"
                        value={cafiAmount}
                        onChange={handleCafiAmountChange}
                        className="bg-transparent text-white text-lg w-full focus:outline-none"
                        placeholder="0.00"
                        disabled={isHardCapReached}
                    />
                    <span className="text-white ml-2">CAFI</span>
                </div>
            </div>

            <button
                onClick={handleContribute}
                disabled={loading || !bnbAmount || presaleStatus !== "Active" || isHardCapReached}
                className={`w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors font-semibold text-lg mb-4 ${
                    (loading || !bnbAmount || presaleStatus !== "Active" || isHardCapReached)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                }`}
            >
                {isHardCapReached ? 'Hard Cap Reached' : loading ? 'Processing...' : 'Contribute'}
            </button>

            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Tokens you will receive:</span>
                <span className="text-white font-semibold">{userTokenAllocation} CAFI</span>
            </div>

            {presaleInfo && (
                <div className="mt-auto space-y-3 text-sm">
                    <InfoItem label="Token Price" value={`1 BNB = ${1 / parseFloat(presaleInfo.tokenPrice)} CAFI`} />
                    <InfoItem label="Min Contribution" value={`${presaleInfo.minContribution} BNB`} />
                    <InfoItem label="Max Contribution" value={`${presaleInfo.maxContribution} BNB`} />
                    <InfoItem label="Tokens Sold" value={`${tokensSold} / ${presaleInfo.hardCap} CAFI`} />
                </div>
            )}
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-400">{label}:</span>
            <span className="text-white font-semibold">{value}</span>
        </div>
    );
}

export default PresaleForm;