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
        console.log('Attempting to detect Ethereum provider...');

        // Check for window.ethereum
        if (typeof window.ethereum !== 'undefined') {
            console.log('window.ethereum detected');
            return { provider: window.ethereum, name: detectProviderName(window.ethereum) };
        }

        // Check for window.web3
        if (typeof window.web3 !== 'undefined') {
            console.log('window.web3 detected');
            return { provider: window.web3.currentProvider, name: 'Legacy Web3' };
        }

        // Check for specific wallet providers
        const walletProviders = [
            { check: () => window.SafePal && window.SafePal.ethereum, name: 'SafePal' },
            { check: () => window.trustwallet && window.trustwallet.ethereum, name: 'Trust Wallet' },
            { check: () => window.imToken && window.imToken.ethereum, name: 'imToken' },
            { check: () => window.TPJSBrigeClient && window.TPJSBrigeClient.ethereum, name: 'TokenPocket' },
            // Add more wallet-specific checks here
        ];

        for (const { check, name } of walletProviders) {
            if (check()) {
                console.log(`${name} detected`);
                return { provider: check(), name };
            }
        }

        // Check if we're in a mobile browser
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            console.log('Mobile browser detected, but no specific wallet found');
        } else {
            console.log('Desktop browser detected, but no wallet found');
        }

        console.log('No provider found');
        return null;
    };

    const detectProviderName = (provider) => {
        if (provider.isMetaMask) return 'MetaMask';
        if (provider.isSafePal) return 'SafePal';
        if (provider.isTrust) return 'Trust Wallet';
        if (provider.isCoinbaseWallet) return 'Coinbase Wallet';
        if (provider.isTokenPocket) return 'TokenPocket';
        // Add more wallet checks here
        return 'Unknown Wallet';
    };

    const connectWallet = async () => {
        setError('');
        console.log('Attempting to connect wallet...');
        const providerInfo = getEthereumProvider();

        if (!providerInfo) {
            const errorMsg = 'No compatible wallet found. Please install a Web3 wallet or use a dApp browser.';
            console.error(errorMsg);
            setError(errorMsg);
            return;
        }

        const { provider, name } = providerInfo;
        console.log(`Attempting to connect with ${name}`);

        try {
            // For older wallets or mobile dApp browsers
            if (typeof provider.enable === 'function') {
                console.log('Using provider.enable()');
                await provider.enable();
            }

            // For newer wallets
            console.log('Requesting accounts...');
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            console.log('Accounts received:', accounts);

            if (accounts.length === 0) {
                throw new Error('No accounts found. Please unlock your wallet and try again.');
            }
            setAccount(accounts[0]);
            console.log(`Connected with ${name}. Account:`, accounts[0]);
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
            setError('No compatible wallet found. Please install a Web3 wallet or use a dApp browser.');
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

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    checkNetwork(provider);
                } else {
                    disconnectWallet();
                }
            };

            const handleChainChanged = () => {
                checkNetwork(provider);
            };

            const handleDisconnect = () => {
                disconnectWallet();
            };

            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);
            provider.on('disconnect', handleDisconnect);

            return () => {
                provider.removeListener('accountsChanged', handleAccountsChanged);
                provider.removeListener('chainChanged', handleChainChanged);
                provider.removeListener('disconnect', handleDisconnect);
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
                                className="block w-full text-center px-4 py-2 text-sm text-white hover:bg-gray-600"
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