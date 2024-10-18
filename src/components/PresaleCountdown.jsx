// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { usePresale } from '../contexts/PresaleContext';
import { getPresaleInfo, getPresaleStatus } from '../utils/contractInteraction';

function PresaleCountdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [presaleStatus, setPresaleStatus] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPresaleInfo = async () => {
            try {
                const info = await getPresaleInfo();
                const status = await getPresaleStatus();

                if (info && info.startTime && info.endTime) {
                    setStartTime(parseInt(info.startTime) * 1000); // Convert to milliseconds
                    setEndTime(parseInt(info.endTime) * 1000); // Convert to milliseconds
                } else {
                    setError("Failed to fetch presale times. Please try again later.");
                }

                setPresaleStatus(status);
            } catch (error) {
                console.error("Failed to fetch presale info:", error);
                setError("Failed to fetch presale information. Please check your connection and try again.");
            }
        };

        fetchPresaleInfo();
        const interval = setInterval(fetchPresaleInfo, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!startTime || !endTime) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            let targetTime = presaleStatus === 'Not started' ? startTime : endTime;
            const distance = targetTime - now;

            if (distance < 0) {
                if (presaleStatus === 'Not started' && now < endTime) {
                    // Presale has just started, switch to counting down to end time
                    setPresaleStatus('Active');
                    targetTime = endTime;
                } else {
                    clearInterval(timer);
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    setPresaleStatus('Ended');
                    return;
                }
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime, endTime, presaleStatus]);

    if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;
    if (!startTime || !endTime) return <div className="text-gray-300 p-6 text-center">Loading presale information...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center text-green-400">
                {presaleStatus === 'Not started' ? 'Presale Starts In:' :
                    presaleStatus === 'Active' ? 'Presale Ends In:' :
                        'Presale Ended'}
            </h3>
            {presaleStatus !== 'Ended' && (
                <div className="grid grid-cols-4 gap-4">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                            <div className="bg-gray-700 w-full aspect-square rounded-lg flex items-center justify-center mb-2">
                                <span className="text-3xl font-bold text-green-400">{value.toString().padStart(2, '0')}</span>
                            </div>
                            <span className="text-sm uppercase text-gray-400">{unit}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6 text-center">
                <span className="text-gray-400 font-semibold">Status: </span>
                <span className={`font-bold ${
                    presaleStatus === 'Active' ? 'text-green-500' :
                        presaleStatus === 'Not started' ? 'text-yellow-500' :
                            'text-red-500'
                }`}>
                    {presaleStatus}
                </span>
            </div>
        </div>
    );
}

export default PresaleCountdown;