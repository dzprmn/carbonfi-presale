// eslint-disable-next-line no-unused-vars
import React from 'react';
import Header from './components/Header';
import PresaleCountdown from './components/PresaleCountdown';
import PresaleInfo from './components/PresaleInfo';
import PresaleForm from './components/PresaleForm';
import Footer from './components/Footer';

function App() {
    return (
        <div className="min-h-screen bg-gray-800 flex flex-col">
            <Header />
            <div className="flex-grow">
                <div className="w-full max-w-6xl mx-auto">
                    <main className="bg-gray-800 overflow-hidden">
                        <h1 className="text-3xl lg:text-4xl font-bold text-center text-white py-8">
                            CarbonFi Presale
                        </h1>
                        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 px-6 lg:px-8 pb-8">
                            <div className="space-y-6 lg:space-y-8">
                                <div className="bg-gray-700 rounded-lg overflow-hidden">
                                    <PresaleCountdown />
                                </div>
                                <div className="bg-gray-700 rounded-lg overflow-hidden">
                                    <PresaleInfo />
                                </div>
                            </div>
                            <div className="bg-gray-700 rounded-lg overflow-hidden">
                                <PresaleForm />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;