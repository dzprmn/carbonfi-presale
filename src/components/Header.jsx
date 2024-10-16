// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import ConnectWallet from './ConnectWallet';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`bg-gray-900 text-white w-full ${isSticky ? 'sticky top-0 z-50 shadow-md' : ''}`}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <img src="/logo.png" alt="CarbonFi Logo" className="h-16 w-48" /> {/* Increased size, maintaining 3:1 ratio */}
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-6"> {/* Increased space between items */}
                        <a href="#" className="hover:text-green-500 transition-colors">Home</a>
                        <a href="#" className="hover:text-green-500 transition-colors">About</a>
                        <a href="#" className="hover:text-green-500 transition-colors">Presale</a>
                        <a href="#" className="hover:text-green-500 transition-colors">Whitepaper</a>
                        <ConnectWallet />
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 space-y-2">
                        <a href="#" className="block py-2 hover:bg-gray-700 transition-colors">Home</a>
                        <a href="#" className="block py-2 hover:bg-gray-700 transition-colors">About</a>
                        <a href="#" className="block py-2 hover:bg-gray-700 transition-colors">Presale</a>
                        <a href="#" className="block py-2 hover:bg-gray-700 transition-colors">Whitepaper</a>
                        <div className="py-2">
                            <ConnectWallet />
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;