// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { usePresale } from '../contexts/PresaleContext';

function PresaleCountdown() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const { presaleData, loading, error } = usePresale();

    useEffect(() => {
        if (presaleData && presaleData.info) {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const startTime = new Date(presaleData.info.startTime * 1000).getTime();
                const endTime = new Date(presaleData.info.endTime * 1000).getTime();

                let distance;
                if (now < startTime) {
                    distance = startTime - now;
                } else if (now < endTime) {
                    distance = endTime - now;
                } else {
                    clearInterval(timer);
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    return;
                }

                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [presaleData]);

    if (loading) return <div className="flex items-center justify-center h-full">Loading countdown...</div>;
    if (error) return <div className="text-red-500 flex items-center justify-center h-full">{error}</div>;

    const renderCountdown = () => {
        if (presaleData.status === "Ended") {
            return (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary mb-4">Presale Ended</h2>
                    <p className="text-text-secondary">Thank you for your participation!</p>
                </div>
            );
        }

        const isNotStarted = presaleData.status === "Not started";

        return (
            <>
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                    {isNotStarted ? "Presale Starts In" : "Presale Ends In"}
                </h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                            <div className="bg-background-dark w-full aspect-square rounded-lg flex items-center justify-center mb-2 shadow-inner">
                                <span className="text-3xl font-bold text-primary">{value.toString().padStart(2, '0')}</span>
                            </div>
                            <span className="text-sm uppercase text-text-secondary">{unit}</span>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <span className="text-text-secondary font-semibold">Status: </span>
                    <span className={`font-bold ${
                        presaleData.status === 'Active' ? 'text-green-500' :
                            presaleData.status === 'Not started' ? 'text-yellow-500' :
                                'text-red-500'
                    }`}>
                        {presaleData.status}
                    </span>
                </div>
            </>
        );
    };

    return (
        <div className="bg-gradient-to-br from-background-light to-background-dark p-6 h-full flex flex-col justify-center">
            {renderCountdown()}
        </div>
    );
}

export default PresaleCountdown;