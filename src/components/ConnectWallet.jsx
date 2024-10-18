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
            // Check for specific wallet providers
            if (window.ethereum.isMetaMask) {
                return { provider: window.ethereum, name: 'MetaMask' };
            } else if (window.ethereum.isSafePal) {
                return { provider: window.ethereum, name: 'SafePal' };
            } else if (window.ethereum.isTrust) {
                return { provider: window.ethereum, name: 'Trust Wallet' };
            } else if (window.ethereum.isCoinbaseWallet) {
                return { provider: window.ethereum, name: 'Coinbase Wallet' };
            }
            // Generic Ethereum provider
            return { provider: window.ethereum, name: 'Ethereum Wallet' };
        } else if (typeof window.web3 !== 'undefined') {
            return { provider: window.web3.currentProvider, name: 'Legacy Web3' };
        }
        return null;
    };

    const connectWallet = async () => {
        setError('');
        const providerInfo = getEthereumProvider();

        if (!providerInfo) {
            setError('No compatible wallet found. Please install MetaMask, SafePal, or use a Web3-enabled browser.');
            return;
        }

        const { provider, name } = providerInfo;

        try {
            // Enable the provider (for older wallets)
            if (provider.enable) {
                await provider.enable();
            }

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                throw new Error('No accounts found. Please unlock your wallet and try again.');
            }
            setAccount(accounts[0]);
            console.log(`Connected with ${name}`);
            await checkNetwork(provider);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            setError(`Failed to connect ${name}: ${error.message || "Unknown error"}`);
        }
    };

    const checkNetwork = async (provider) => {
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
        const providerInfo = getEthereumProvider();
        if (!providerInfo) {
            setError('No compatible wallet found. Please install MetaMask, SafePal, or use a Web3-enabled browser.');
            return;
        }

        const { provider, name } = providerInfo;

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
                    setError(`Failed to add BSC Testnet to ${name}: ${addError.message}`);
                }
            } else {
                setError(`Failed to switch to BSC Testnet on ${name}: ${switchError.message}`);
            }
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setIsCorrectNetwork(false);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const providerInfo = getEthereumProvider();
        if (providerInfo) {
            const { provider } = providerInfo;

            provider.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    checkNetwork(provider);
                } else {
                    disconnectWallet();
                }
            });

            provider.on('chainChanged', () => {
                checkNetwork(provider);
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
            {error && <p className="text-red-500 absolute top-0 left-0 right-0 text-sm">{error}</p>}
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="bg-transparent text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors text-sm"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="relative w-full">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-primary text-white border border-primary px-4 py-2 rounded transition-colors w-full text-left text-sm"
                    >
                        {account.slice(0, 6)}...{account.slice(-4)}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                            {!isCorrectNetwork && (
                                <button
                                    onClick={switchNetwork}
                                    className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-600"
                                >
                                    Switch to BSC Testnet
                                </button>
                            )}
                            <button
                                onClick={disconnectWallet}
                                className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-600"
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