// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePresale } from '../contexts/PresaleContext';
import { contribute, isCorrectNetwork, switchToCorrectNetwork } from '../utils/contractInteraction';

function PresaleForm() {
    const [bnbAmount, setBnbAmount] = useState('');
    const [cafiAmount, setCafiAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { presaleData, refreshData } = usePresale();

    useEffect(() => {
        if (presaleData && presaleData.info && bnbAmount !== '') {
            const tokens = parseFloat(bnbAmount) / parseFloat(presaleData.info.tokenPrice);
            setCafiAmount(tokens.toFixed(2));
        }
    }, [bnbAmount, presaleData]);

    const handleBnbAmountChange = (e) => {
        setBnbAmount(e.target.value);
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

            // Add other validations here...

            await contribute(bnbAmount);
            alert('Contribution successful!');
            setBnbAmount('');
            setCafiAmount('');
            refreshData();
        } catch (error) {
            console.error("Error contributing:", error);
            setError(error.message || "Failed to contribute. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!presaleData || !presaleData.info) return null;

    const isHardCapReached = parseFloat(presaleData.sold) >= parseFloat(presaleData.info.hardCap);

    return (
        <div className="bg-gradient-to-br from-background-light to-background-dark p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Contribute to Presale</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <div className="mb-4 flex-shrink-0">
                <label htmlFor="bnb-amount" className="block text-sm font-medium text-text-secondary mb-2">BNB Amount</label>
                <div className="flex items-center bg-background-dark rounded-md p-2">
                    <input
                        id="bnb-amount"
                        type="number"
                        value={bnbAmount}
                        onChange={handleBnbAmountChange}
                        className="bg-transparent text-text-primary text-lg w-full focus:outline-none"
                        placeholder="0.00"
                        disabled={isHardCapReached}
                    />
                    <span className="text-text-secondary ml-2">BNB</span>
                </div>
            </div>

            <div className="mb-6 flex-shrink-0">
                <label htmlFor="cafi-amount" className="block text-sm font-medium text-text-secondary mb-2">CAFI Amount</label>
                <div className="flex items-center bg-background-dark rounded-md p-2">
                    <input
                        id="cafi-amount"
                        type="number"
                        value={cafiAmount}
                        className="bg-transparent text-text-primary text-lg w-full focus:outline-none"
                        placeholder="0.00"
                        disabled
                    />
                    <span className="text-text-secondary ml-2">CAFI</span>
                </div>
            </div>

            <button
                onClick={handleContribute}
                disabled={loading || !bnbAmount || presaleData.status !== "Active" || isHardCapReached}
                className={`w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors font-semibold text-lg mb-6 flex-shrink-0 ${(loading || !bnbAmount || presaleData.status !== "Active" || isHardCapReached) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isHardCapReached ? 'Hard Cap Reached' : loading ? 'Processing...' : 'Contribute'}
            </button>

            <div className="mt-auto space-y-2 text-sm">
                <InfoItem label="Token Price" value={`1 BNB = ${1 / parseFloat(presaleData.info.tokenPrice)} CAFI`} />
                <InfoItem label="Min Contribution" value={`${presaleData.info.minContribution} BNB`} />
                <InfoItem label="Max Contribution" value={`${presaleData.info.maxContribution} BNB`} />
                <InfoItem label="Tokens Sold" value={`${presaleData.sold} / ${presaleData.info.hardCap} CAFI`} />
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-text-secondary">{label}:</span>
            <span className="text-text-primary font-semibold">{value}</span>
        </div>
    );
}

export default PresaleForm;