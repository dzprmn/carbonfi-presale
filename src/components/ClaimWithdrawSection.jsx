// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { usePresale } from '../contexts/PresaleContext';
import { claimTokens, withdrawContribution, canWithdraw, canClaimTokens } from '../utils/contractInteraction';

function ClaimWithdrawSection() {
    const { presaleData, loading, error, refreshData } = usePresale();
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [canWithdrawContribution, setCanWithdrawContribution] = useState(false);
    const [canClaimUserTokens, setCanClaimUserTokens] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setUserAddress(accounts[0]);
                    setIsWalletConnected(true);
                    checkEligibility(accounts[0]);
                }
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                setActionError("Failed to connect wallet. Please try again.");
            }
        } else {
            setActionError("Ethereum object not found. Please install MetaMask.");
        }
    };

    const checkEligibility = async (address) => {
        if (presaleData && presaleData.status === "Ended") {
            try {
                if (presaleData.softCapReached) {
                    const canClaim = await canClaimTokens(address);
                    setCanClaimUserTokens(canClaim);
                } else {
                    const canWithdrawFunds = await canWithdraw(address);
                    setCanWithdrawContribution(canWithdrawFunds);
                }
            } catch (error) {
                console.error("Error checking eligibility:", error);
                setActionError("Error checking eligibility. Please try again.");
            }
        }
    };

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setUserAddress(accounts[0]);
                    setIsWalletConnected(true);
                    checkEligibility(accounts[0]);
                }
            }
        };

        checkWalletConnection();
    }, [presaleData]);

    if (loading || error || !presaleData || presaleData.status !== "Ended") {
        return null;
    }

    const isSoftCapReached = presaleData.softCapReached;

    const handleAction = async () => {
        setActionLoading(true);
        setActionError('');
        try {
            if (isSoftCapReached) {
                if (!canClaimUserTokens) {
                    throw new Error("You are not eligible to claim tokens.");
                }
                await claimTokens(userAddress);
                alert('Tokens claimed successfully!');
            } else {
                if (!canWithdrawContribution) {
                    throw new Error("You don't have any contributions to withdraw.");
                }
                await withdrawContribution(userAddress);
                alert('Contribution withdrawn successfully!');
            }
            refreshData();
            checkEligibility(userAddress);
        } catch (error) {
            console.error("Error performing action:", error);
            setActionError(error.reason || error.message || "Failed to perform action. Please try again.");
        }
        setActionLoading(false);
    };

    const isEligible = isSoftCapReached ? canClaimUserTokens : canWithdrawContribution;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-400">
                {isSoftCapReached ? "Claim Your Tokens" : "Withdraw Your Contribution"}
            </h2>
            <p className="text-gray-300 text-center mb-6">
                {isSoftCapReached
                    ? "The presale has ended and the soft cap was reached. Eligible participants can now claim their tokens."
                    : "The presale has ended and the soft cap was not reached. If you made a contribution, you can now withdraw it."}
            </p>
            {actionError && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{actionError}</span>
                </div>
            )}
            <div className="flex justify-center">
                <button
                    onClick={handleAction}
                    disabled={actionLoading || !isEligible}
                    className={`bg-green-500 text-white py-3 px-8 rounded-full hover:bg-green-600 transition-colors font-semibold text-lg ${
                        (actionLoading || !isEligible)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                    }`}
                >
                    {actionLoading ? 'Processing...' : isSoftCapReached ? 'Claim Tokens' : 'Withdraw Contribution'}
                </button>
            </div>
            {!isEligible && (
                <p className="text-yellow-400 text-center mt-4">
                    {isSoftCapReached
                        ? "You are not eligible to claim tokens. You may have already claimed or did not participate in the presale."
                        : "You don't have any contributions to withdraw."}
                </p>
            )}
        </div>
    );
}

export default ClaimWithdrawSection;