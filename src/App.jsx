// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PresaleProvider } from './contexts/PresaleContext';
import Header from './components/Header';
import PresaleCountdown from './components/PresaleCountdown';
import PresaleInfo from './components/PresaleInfo';
import PresaleForm from './components/PresaleForm';
import ClaimWithdrawSection from './components/ClaimWithdrawSection';
import Footer from './components/Footer';

function App() {
    return (
        <PresaleProvider>
            <div className="min-h-screen flex flex-col bg-gray-800 text-text-primary">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-primary">
                            CarbonFi Presale
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="flex flex-col space-y-8">
                                <div className="bg-background-light rounded-lg shadow-xl overflow-hidden">
                                    <PresaleCountdown />
                                </div>
                                <div className="bg-background-light rounded-lg shadow-xl overflow-hidden">
                                    <PresaleInfo />
                                </div>
                            </div>
                            <div className="bg-background-light rounded-lg shadow-xl overflow-hidden">
                                <PresaleForm />
                            </div>
                        </div>
                        <div className="mt-8">
                            <ClaimWithdrawSection />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </PresaleProvider>
    );
}

export default App;