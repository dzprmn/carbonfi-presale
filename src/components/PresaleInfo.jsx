// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { getPresaleInfo, getTotalRaised, getTokensSold, getSoftCapReached, getPresaleStatus } from '../utils/contractInteraction';

function PresaleInfo() {
    const [presaleInfo, setPresaleInfo] = useState(null);
    const [totalRaised, setTotalRaised] = useState('');
    const [tokensSold, setTokensSold] = useState('');
    const [softCapReached, setSoftCapReached] = useState(false);
    const [presaleStatus, setPresaleStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPresaleInfo();
        const interval = setInterval(fetchPresaleInfo, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchPresaleInfo = async () => {
        try {
            const [info, raised, sold, softCap, status] = await Promise.all([
                getPresaleInfo(),
                getTotalRaised(),
                getTokensSold(),
                getSoftCapReached(),
                getPresaleStatus()
            ]);
            setPresaleInfo(info);
            setTotalRaised(raised);
            setTokensSold(sold);
            setSoftCapReached(softCap);

            // Calculate the actual status including "Hardcap Reached"
            if (parseFloat(sold) >= parseFloat(info.hardCap)) {
                setPresaleStatus("Hardcap Reached");
            } else {
                setPresaleStatus(status);
            }
        } catch (error) {
            console.error("Error fetching presale info:", error);
            setError("Failed to fetch presale information. Please try again later.");
        }
    };

    const calculateProgress = () => {
        if (!presaleInfo || !tokensSold) return 0;
        return (parseFloat(tokensSold) / parseFloat(presaleInfo.hardCap)) * 100;
    };

    const calculateSoftCapPosition = () => {
        if (!presaleInfo) return 0;
        return (parseFloat(presaleInfo.softCap) / parseFloat(presaleInfo.hardCap)) * 100;
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!presaleInfo) {
        return <div className="text-white">Loading presale information...</div>;
    }

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-white">Presale Information</h2>

            <div className="mb-6">
                <div className="mb-2 flex justify-between">
                    <span className="text-gray-400 text-sm">Progress</span>
                    <span className="text-white text-sm font-semibold">{tokensSold} / {presaleInfo.hardCap} CAFI</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 relative">
                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                    <div
                        className="absolute top-0 bottom-0 border-l-2 border-yellow-400"
                        style={{ left: `${calculateSoftCapPosition()}%` }}
                    ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs">
                    <span className="text-gray-400">Soft Cap: {presaleInfo.softCap} CAFI</span>
                    <span className="text-gray-400">Hard Cap: {presaleInfo.hardCap} CAFI</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-lg">Token Price:</span>
                    <span className="text-white text-lg font-semibold">1 BNB = {1 / parseFloat(presaleInfo.tokenPrice)} CAFI</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-lg">Total Raised:</span>
                    <span className="text-white text-lg font-semibold">{totalRaised} BNB</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-lg">Tokens Sold:</span>
                    <span className="text-white text-lg font-semibold">{tokensSold} CAFI</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-lg">Soft Cap Reached:</span>
                    <span className={`text-lg font-semibold ${softCapReached ? 'text-green-500' : 'text-red-500'}`}>
            {softCapReached ? 'Yes' : 'No'}
          </span>
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
                    <span className="text-gray-400 text-lg">Presale Status:</span>
                    <span className={`text-lg font-semibold ${
                        presaleStatus === 'Active' ? 'text-green-500' :
                            presaleStatus === 'Hardcap Reached' ? 'text-red-500' :
                                'text-red-500'
                    }`}>
            {presaleStatus}
          </span>
                </div>
            </div>
        </div>
    );
}

export default PresaleInfo;