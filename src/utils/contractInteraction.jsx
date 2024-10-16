import { ethers } from 'ethers';

const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"AddressInsufficientBalance","type":"error"},{"inputs":[],"name":"FailedInnerCall","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Contributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"successful","type":"bool"}],"name":"PoolFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"participant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RefundClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"participant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"claimRefund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finalizePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasWithdrawn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_endTime","type":"uint256"},{"internalType":"uint256","name":"_tokenPrice","type":"uint256"},{"internalType":"uint256","name":"_softCap","type":"uint256"},{"internalType":"uint256","name":"_hardCap","type":"uint256"},{"internalType":"uint256","name":"_minContribution","type":"uint256"},{"internalType":"uint256","name":"_maxContribution","type":"uint256"},{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"poolInfo","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"tokenPrice","type":"uint256"},{"internalType":"uint256","name":"softCap","type":"uint256"},{"internalType":"uint256","name":"hardCap","type":"uint256"},{"internalType":"uint256","name":"minContribution","type":"uint256"},{"internalType":"uint256","name":"maxContribution","type":"uint256"},{"internalType":"contract IERC20","name":"token","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"softCapReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const CONTRACT_ADDRESS = "0xb6e230e066c3B1A6E65242d2F5da0bD702735ae5"; // Replace with your actual contract address

const getContract = (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const contribute = async (amount) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = getContract(signer);

            const tx = await contract.contribute({ value: ethers.parseEther(amount) });
            await tx.wait();

            return true;
        } catch (error) {
            console.error("Error contributing:", error);
            throw error;
        }
    } else {
        throw new Error("Ethereum object not found, install MetaMask.");
    }
};

export const getPresaleInfo = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);
        const info = await contract.poolInfo();
        return {
            tokenPrice: ethers.formatEther(info.tokenPrice),
            softCap: ethers.formatEther(info.softCap),
            hardCap: ethers.formatEther(info.hardCap),
            minContribution: ethers.formatEther(info.minContribution),
            maxContribution: ethers.formatEther(info.maxContribution),
            startTime: info.startTime.toString(),
            endTime: info.endTime.toString()
        };
    }
    throw new Error("Ethereum object not found, install MetaMask.");
};

export const getTotalRaised = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);
        const totalRaised = await contract.totalRaised();
        return ethers.formatEther(totalRaised);
    }
    throw new Error("Ethereum object not found, install MetaMask.");
};

export const getTokensSold = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);
        const tokensSold = await contract.tokensSold();
        return ethers.formatEther(tokensSold);
    }
    throw new Error("Ethereum object not found, install MetaMask.");
};

export const getSoftCapReached = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);
        return await contract.softCapReached();
    }
    throw new Error("Ethereum object not found, install MetaMask.");
};

export const getPresaleStatus = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);
        const info = await contract.poolInfo();
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime < info.startTime) {
            return "Not started";
        } else if (currentTime > info.endTime) {
            return "Ended";
        } else {
            return "Active";
        }
    }
    throw new Error("Ethereum object not found, install MetaMask.");
};

// You may need to implement additional functions based on your specific needs