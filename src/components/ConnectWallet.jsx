// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

function ConnectWallet() {
    const [account, setAccount] = useState('');
    const [error, setError] = useState('');
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const BSC_TESTNET_CHAIN_ID = '0x61'; // 97 in decimal

    const BSC_TESTNET_PARAMS = {
        chainId: BSC_TESTNET_CHAIN_ID,
        chainName: 'BSC Testnet',
        nativeCurrency: {
            name: 'Binance Chain Native Token',
            symbol: 'tBNB',
            decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com']
    };

    const getEthereumProvider = () => {
        if (typeof window.ethereum !== 'undefined') {
            return window.ethereum;
        } else if (typeof window.web3 !== 'undefined') {
            return window.web3.currentProvider;
        } else {
            return null;
        }
    };

    const connectWallet = async () => {
        setError('');
        const provider = getEthereumProvider();

        if (!provider) {
            setError('No Ethereum wallet found. Please install MetaMask or use a Web3-enabled browser.');
            return;
        }

        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                throw new Error('No accounts found. Please unlock your wallet and try again.');
            }
            setAccount(accounts[0]);
            await checkNetwork();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            setError("Failed to connect wallet: " + (error.message || "Unknown error"));
        }
    };

    const checkNetwork = async () => {
        const provider = getEthereumProvider();
        if (provider) {
            try {
                const chainId = await provider.request({ method: 'eth_chainId' });
                setIsCorrectNetwork(chainId === BSC_TESTNET_CHAIN_ID);
            } catch (error) {
                console.error("Failed to get network chain ID:", error);
                setError("Failed to check network: " + (error.message || "Unknown error"));
            }
        }
    };

    const switchNetwork = async () => {
        const provider = getEthereumProvider();
        if (!provider) {
            setError('No Ethereum wallet found. Please install MetaMask or use a Web3-enabled browser.');
            return;
        }

        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_TESTNET_CHAIN_ID }],
            });
            setIsCorrectNetwork(true);
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [BSC_TESTNET_PARAMS],
                    });
                    setIsCorrectNetwork(true);
                } catch (addError) {
                    setError('Failed to add BSC Testnet: ' + addError.message);
                }
            } else {
                setError('Failed to switch to BSC Testnet: ' + switchError.message);
            }
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setIsCorrectNetwork(false);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const provider = getEthereumProvider();
        if (provider) {
            provider.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    checkNetwork();
                } else {
                    disconnectWallet();
                }
            });

            provider.on('chainChanged', () => {
                checkNetwork();
            });

            provider.on('disconnect', () => {
                disconnectWallet();
            });

            return () => {
                provider.removeListener('accountsChanged', () => {});
                provider.removeListener('chainChanged', () => {});
                provider.removeListener('disconnect', () => {});
            };
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center h-full" ref={dropdownRef}>
            {error && <p className="text-red-500 absolute top-0 left-0 right-0">{error}</p>}
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="bg-transparent text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="relative w-full">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-transparent text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors w-full text-left"
                    >
                        Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                            {!isCorrectNetwork && (
                                <button
                                    onClick={switchNetwork}
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                >
                                    Switch to BSC Testnet
                                </button>
                            )}
                            <button
                                onClick={disconnectWallet}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                            >
                                Disconnect Wallet
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConnectWallet;