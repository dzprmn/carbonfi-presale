// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPresaleInfo, getTokensSold, getSoftCapReached, getPresaleStatus, getTotalRaised } from '../utils/contractInteraction';

const PresaleContext = createContext();

// eslint-disable-next-line react/prop-types
export function PresaleProvider({ children }) {
    const [presaleData, setPresaleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPresaleData();
        const interval = setInterval(fetchPresaleData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const fetchPresaleData = async () => {
        try {
            setLoading(true);
            const [info, sold, softCap, status, totalRaised] = await Promise.all([
                getPresaleInfo(),
                getTokensSold(),
                getSoftCapReached(),
                getPresaleStatus(),
                getTotalRaised()
            ]);
            setPresaleData({ info, sold, softCap, status, totalRaised });
            setError(null);
        } catch (err) {
            console.error("Error fetching presale data:", err);
            setError("Failed to fetch presale information. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PresaleContext.Provider value={{ presaleData, loading, error, refreshData: fetchPresaleData }}>
            {children}
        </PresaleContext.Provider>
    );
}

export function usePresale() {
    return useContext(PresaleContext);
}