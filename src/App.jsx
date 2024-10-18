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
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
                            CarbonFi Presale
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-8">
                                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                                    <PresaleCountdown />
                                </div>
                                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                                    <PresaleInfo />
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                                <PresaleForm />
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
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