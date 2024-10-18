// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

function ConnectWallet() {
    const [account, setAccount] = useState('');
    const [error, setError] = useState('');
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

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

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const getEthereumProvider = () => {
        if (typeof window.ethereum !== 'undefined') {
            return window.ethereum;
        } else if (typeof window.web3 !== 'undefined') {
            return window.web3.currentProvider;
        } else if (typeof window.BinanceChain !== 'undefined') {
            return window.BinanceChain;
        } else {
            return null;
        }
    };

    const checkNetwork = useCallback(async () => {
        const provider = getEthereumProvider();
        if (provider) {
            try {
                const chainId = await provider.request({ method: 'eth_chainId' });
                setIsCorrectNetwork(chainId === BSC_TESTNET_CHAIN_ID);
            } catch (error) {
                console.error("Failed to get network chain ID:", error);
            }
        }
    }, [BSC_TESTNET_CHAIN_ID]);

    const openMobileWallet = () => {
        const dappUrl = window.location.href;
        const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
        const trustWalletDeepLink = `https://link.trustwallet.com/open_url?coin_id=56&url=${dappUrl}`;

        if (window.confirm("Please select a wallet to connect:")) {
            window.location.href = metamaskAppDeepLink;
        } else {
            window.location.href = trustWalletDeepLink;
        }
    };

    const switchToBscTestnet = async () => {
        const provider = getEthereumProvider();
        if (!provider) {
            setError('No wallet found. Please install MetaMask or use a Web3-enabled browser.');
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

    const connectWallet = async () => {
        setError('');
        if (isMobile) {
            openMobileWallet();
            return;
        }

        const provider = getEthereumProvider();
        if (!provider) {
            setError('No wallet found. Please install MetaMask or use a Web3-enabled browser.');
            return;
        }

        try {
            await provider.request({ method: 'eth_requestAccounts' });
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);

            await checkNetwork();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            setError("Failed to connect wallet: " + error.message);
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            const provider = getEthereumProvider();
            if (provider) {
                try {
                    const ethersProvider = new ethers.BrowserProvider(provider);
                    const accounts = await ethersProvider.listAccounts();
                    if (accounts.length > 0) {
                        setAccount(accounts[0].address);
                        await checkNetwork();
                    }
                } catch (error) {
                    console.error("Failed to check existing connection:", error);
                }
            }
        };

        checkConnection();

        const provider = getEthereumProvider();
        if (provider) {
            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    checkNetwork();
                } else {
                    setAccount('');
                    setIsCorrectNetwork(false);
                }
            };

            const handleChainChanged = () => {
                checkNetwork();
            };

            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);

            return () => {
                if (provider.removeListener) {
                    provider.removeListener('accountsChanged', handleAccountsChanged);
                    provider.removeListener('chainChanged', handleChainChanged);
                }
            };
        }
    }, [checkNetwork]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="bg-primary text-gray-900 px-4 py-2 rounded hover:bg-secondary w-full"
                >
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p className="text-primary mb-2">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                    {!isCorrectNetwork && (
                        <button
                            onClick={switchToBscTestnet}
                            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600 w-full"
                        >
                            Switch to BSC Testnet
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConnectWallet;


// import React from 'react';
// import '@rainbow-me/rainbowkit/styles.css';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
//
// function ConnectWallet() {
//     return (
//         <div className="bg-gray-800 p-4 rounded-lg mb-4">
//             <ConnectButton />
//         </div>
//     );
// }
//
// export default ConnectWallet;