// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
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
        rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
        blockExplorerUrls: ['https://testnet.bscscan.com']
    };

    const switchToBscTestnet = async () => {
        const { ethereum } = window;
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_TESTNET_CHAIN_ID }],
            });
            setIsCorrectNetwork(true);
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
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

    const checkNetwork = async () => {
        if (window.ethereum) {
            try {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                setIsCorrectNetwork(chainId === BSC_TESTNET_CHAIN_ID);
            } catch (error) {
                console.error("Failed to get network chain ID:", error);
            }
        }
    };

    const connectWallet = async () => {
        setError('');
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);

                await checkNetwork();
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                setError("Failed to connect wallet: " + error.message);
            }
        } else {
            setError("Please install MetaMask!");
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                try {
                    const accounts = await provider.listAccounts();
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

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    checkNetwork();
                } else {
                    setAccount('');
                    setIsCorrectNetwork(false);
                }
            });

            window.ethereum.on('chainChanged', () => {
                checkNetwork();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
                window.ethereum.removeListener('chainChanged', () => {});
            }
        };
    }, []);

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