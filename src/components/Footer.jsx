// eslint-disable-next-line no-unused-vars
import React from 'react';
import { FaTelegram, FaDiscord, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
    return (
        <footer className="bg-gray-900 text-center p-6">
            <div className="flex justify-center space-x-6 mb-4">
                <a href="https://t.me/CarbonFiHQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaTelegram size={24} />
                </a>
                <a href="https://x.com/CarbonFiHQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaXTwitter size={24} />
                </a>
                <a href="https://discord.gg/CarbonFiHQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaDiscord size={24} />
                </a>
                <a href="https://youtube.com/@CarbonFiHQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaYoutube size={24} />
                </a>
            </div>
            <p className="text-sm text-gray-400">&copy; 2024 CarbonFi. All rights reserved.</p>
        </footer>
    );
}

export default Footer;