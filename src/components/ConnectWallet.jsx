// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/ethereum-provider";

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

    // MetaMask mobile detection
    const isMetaMaskMobile = () => {
        return /MetaMaskMobile/.test(navigator.userAgent);
    };

    const metamaskDeepLink = 'https://metamask.app.link/dapp/your-dapp-url.com'; // Adjust the URL

    // Configure WalletConnect v2.0 provider
    const walletConnectProvider = new WalletConnectProvider({
        projectId: '2e21daf14b1f09f22caf8b57a1982449',  // Register for a project ID at cloud.walletconnect.com
        chains: [97],  // BSC Testnet
        rpcMap: {
            97: 'https://data-seed-prebsc-1-s2.binance.org:8545/'  // BSC Testnet RPC
        }
    });

    const connectWallet = async () => {
        setError('');
        console.log('Initiating wallet connection...');

        try {
            // Check if Web3 is injected by the browser (MetaMask)
            if (typeof window.ethereum !== 'undefined') {
                console.log('Web3 detected');
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                // Request account access
                console.log('Requesting account access...');
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const signer = provider.getSigner();
                const address = await signer.getAddress();
                console.log('Connected address:', address);

                setAccount(address);
                await checkNetwork(provider);
            } else if (isMetaMaskMobile()) {
                // Redirect to MetaMask Mobile app if detected
                window.location.href = metamaskDeepLink;
            } else {
                // Use WalletConnect as fallback for mobile browsers
                console.log('No Web3 detected, using WalletConnect...');
                await walletConnectProvider.connect();

                const web3Provider = new ethers.providers.Web3Provider(walletConnectProvider);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();
                console.log('Connected address (via WalletConnect):', address);

                setAccount(address);
                await checkNetwork(web3Provider);
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setError(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
        }
    };

    const checkNetwork = async (provider) => {
        try {
            const network = await provider.getNetwork();
            console.log('Current network:', network);
            setIsCorrectNetwork(network.chainId === parseInt(BSC_TESTNET_CHAIN_ID, 16));
        } catch (error) {
            console.error('Failed to check network:', error);
            setError('Failed to check network: ' + (error.message || 'Unknown error'));
        }
    };

    const switchNetwork = async () => {
        if (typeof window.ethereum === 'undefined') {
            setError('No Web3 detected. Please use a Web3 enabled browser or wallet app.');
            return;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_TESTNET_CHAIN_ID }],
            });
            setIsCorrectNetwork(true);
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [BSC_TESTNET_PARAMS],
                    });
                    setIsCorrectNetwork(true);
                } catch (addError) {
                    setError(`Failed to add BSC Testnet: ${addError.message}`);
                }
            } else {
                setError(`Failed to switch to BSC Testnet: ${switchError.message}`);
            }
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setIsCorrectNetwork(false);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    checkNetwork(provider);
                } else {
                    disconnectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                checkNetwork(provider);
            });

            window.ethereum.on('disconnect', disconnectWallet);

            return () => {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
                window.ethereum.removeAllListeners('disconnect');
            };
        }
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
                        className="bg-transparent text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors w-full text-left text-sm"
                    >
                        {account.slice(0, 4)}...{account.slice(-4)}
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
