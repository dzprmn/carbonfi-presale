// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { usePresale } from '../contexts/PresaleContext';

function PresaleInfo() {
    const { presaleData, loading, error } = usePresale();

    if (loading) return <div className="text-center p-8">Loading presale information...</div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

    const { info, sold, softCap, totalRaised } = presaleData;

    const calculateProgress = () => {
        return (parseFloat(sold) / parseFloat(info.hardCap)) * 100;
    };

    return (
        <div className="bg-gradient-to-br from-background-light to-background-dark p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Presale Information</h2>

            <div className="mb-6 flex-shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-text-primary font-semibold">{sold} / {info.hardCap} CAFI</span>
                </div>
                <div className="w-full bg-background-dark rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                    <span className="text-text-secondary">Soft Cap: {info.softCap} CAFI</span>
                    <span className="text-text-secondary">Hard Cap: {info.hardCap} CAFI</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-grow">
                <InfoItem label="Token Price" value={`1 BNB = ${1 / parseFloat(info.tokenPrice)} CAFI`} />
                <InfoItem label="Total Raised" value={`${totalRaised} BNB`} />
                <InfoItem label="Tokens Sold" value={`${sold} CAFI`} />
                <InfoItem label="Soft Cap Reached" value={softCap ? 'Yes' : 'No'} valueColor={softCap ? 'text-green-500' : 'text-red-500'} />
                <InfoItem label="Min Contribution" value={`${info.minContribution} BNB`} />
                <InfoItem label="Max Contribution" value={`${info.maxContribution} BNB`} />
            </div>
        </div>
    );
}

function InfoItem({ label, value, valueColor = 'text-text-primary' }) {
    return (
        <div className="flex flex-col">
            <span className="text-text-secondary text-sm">{label}</span>
            <span className={`font-semibold ${valueColor}`}>{value}</span>
        </div>
    );
}

export default PresaleInfo;