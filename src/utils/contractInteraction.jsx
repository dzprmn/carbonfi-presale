import { ethers } from 'ethers';

const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"AddressInsufficientBalance","type":"error"},{"inputs":[],"name":"FailedInnerCall","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"Contributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"successful","type":"bool"}],"name":"PoolFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"participant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RefundClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"UnsoldTokensWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"participant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[{"internalType":"uint256","name":"_contributionAmount","type":"uint256"}],"name":"calculateTokenAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRefund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finalizePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_contributionAmount","type":"uint256"}],"name":"getTokenAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserTokenAllocation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasWithdrawn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_endTime","type":"uint256"},{"internalType":"uint256","name":"_tokenPrice","type":"uint256"},{"internalType":"uint256","name":"_softCap","type":"uint256"},{"internalType":"uint256","name":"_hardCap","type":"uint256"},{"internalType":"uint256","name":"_minContribution","type":"uint256"},{"internalType":"uint256","name":"_maxContribution","type":"uint256"},{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolInfo","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"tokenPrice","type":"uint256"},{"internalType":"uint256","name":"softCap","type":"uint256"},{"internalType":"uint256","name":"hardCap","type":"uint256"},{"internalType":"uint256","name":"minContribution","type":"uint256"},{"internalType":"uint256","name":"maxContribution","type":"uint256"},{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokensDeposited","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"softCapReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawRaisedFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawUnsoldTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const CONTRACT_ADDRESS = "0xB3B2BFd67C157D1B52030b0168b3E219480fE60A"; // Replace with your actual contract address
const RPC_URL = "https://bsc-testnet-rpc.publicnode.com"; // e.g., "https://bsc-dataseed.binance.org/" for BSC mainnet

// Create a provider that always connects to the correct network
const provider = new ethers.JsonRpcProvider(RPC_URL);

const getContract = (signerOrProvider = provider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const getPresaleInfo = async () => {
    try {
        const contract = getContract();
        const poolInfo = await contract.poolInfo();
        return {
            owner: poolInfo.owner,
            startTime: poolInfo.startTime.toString(),
            endTime: poolInfo.endTime.toString(),
            tokenPrice: ethers.formatUnits(poolInfo.tokenPrice, 'ether'),
            softCap: ethers.formatUnits(poolInfo.softCap, 'ether'),
            hardCap: ethers.formatUnits(poolInfo.hardCap, 'ether'),
            minContribution: ethers.formatUnits(poolInfo.minContribution, 'ether'),
            maxContribution: ethers.formatUnits(poolInfo.maxContribution, 'ether'),
            token: poolInfo.token,
            tokensDeposited: ethers.formatUnits(poolInfo.tokensDeposited, 'ether')
        };
    } catch (error) {
        console.error("Error in getPresaleInfo:", error);
        throw error;
    }
};

export const getTokensSold = async () => {
    try {
        const contract = getContract();
        const sold = await contract.tokensSold();
        return ethers.formatUnits(sold, 'ether');
    } catch (error) {
        console.error("Error in getTokensSold:", error);
        throw error;
    }
};

export const getPresaleStatus = async () => {
    try {
        const contract = getContract();
        const info = await contract.poolInfo();
        const currentTime = Math.floor(Date.now() / 1000);
        const finalized = await contract.finalized();

        if (finalized) {
            return "Ended";
        } else if (currentTime < info.startTime) {
            return "Not started";
        } else if (currentTime > info.endTime) {
            return "Ended";
        } else {
            return "Active";
        }
    } catch (error) {
        console.error("Error in getPresaleStatus:", error);
        throw error;
    }
};

export const getSoftCapReached = async () => {
    try {
        const contract = getContract();
        return await contract.softCapReached();
    } catch (error) {
        console.error("Error in getSoftCapReached:", error);
        throw error;
    }
};

export const getTotalRaised = async () => {
    try {
        const contract = getContract();
        const totalRaised = await contract.totalRaised();
        return ethers.formatUnits(totalRaised, 'ether');
    } catch (error) {
        console.error("Error in getTotalRaised:", error);
        throw error;
    }
};

// Function to check if the user is on the correct network (for transactions)
export const isCorrectNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const userProvider = new ethers.BrowserProvider(window.ethereum);
            const network = await userProvider.getNetwork();
            const correctNetwork = await provider.getNetwork();
            return network.chainId === correctNetwork.chainId;
        } catch (error) {
            console.error("Error checking network:", error);
            return false;
        }
    }
    return false;
};

// Function to switch to the correct network (for transactions)
export const switchToCorrectNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const correctNetwork = await provider.getNetwork();
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${correctNetwork.chainId.toString(16)}` }],
            });
            return true;
        } catch (error) {
            console.error("Failed to switch network:", error);
            return false;
        }
    }
    return false;
};

// For transactions, we still need to use the user's connected provider
export const contribute = async (amount) => {
    if (!(await isCorrectNetwork())) {
        throw new Error("Please switch to the correct network to contribute");
    }

    if (typeof window.ethereum !== 'undefined') {
        try {
            const userProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await userProvider.getSigner();
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

export const claimTokens = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Check if the function exists in the contract
            if (typeof contract.claimTokens === 'function') {
                const tx = await contract.claimTokens();
                await tx.wait();
                return true;
            } else {
                throw new Error("claimTokens function not found in the contract");
            }
        } catch (error) {
            console.error("Error claiming tokens:", error);
            throw error;
        }
    } else {
        throw new Error("Ethereum object not found, install MetaMask.");
    }
};

export const withdrawContribution = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Check for different possible function names
            let withdrawFunction;
            if (typeof contract.withdrawContribution === 'function') {
                withdrawFunction = contract.withdrawContribution;
            } else if (typeof contract.claimRefund === 'function') {
                withdrawFunction = contract.claimRefund;
            } else if (typeof contract.withdraw === 'function') {
                withdrawFunction = contract.withdraw;
            } else {
                throw new Error("Withdraw function not found in the contract");
            }

            const tx = await withdrawFunction();
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error withdrawing contribution:", error);
            // Rethrow the error with more details
            throw new Error(error.reason || error.message);
        }
    } else {
        throw new Error("Ethereum object not found, install MetaMask.");
    }
};

export const canWithdraw = async (userAddress) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            const contribution = await contract.contributions(userAddress);
            return contribution > 0;
        } catch (error) {
            console.error("Error checking withdrawal eligibility:", error);
            return false;
        }
    } else {
        throw new Error("Ethereum object not found, install MetaMask.");
    }
};

export const canClaimTokens = async (userAddress) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            // Check if the user has contributed and hasn't claimed yet
            const contribution = await contract.contributions(userAddress);
            const hasClaimed = await contract.hasWithdrawn(userAddress);
            return contribution > 0 && !hasClaimed;
        } catch (error) {
            console.error("Error checking token claim eligibility:", error);
            return false;
        }
    } else {
        throw new Error("Ethereum object not found, install MetaMask.");
    }
};

export const getUserContribution = async (userAddress) => {
    try {
        const contract = await getContract();
        const contribution = await contract.contributions(userAddress);
        return ethers.formatEther(contribution);
    } catch (error) {
        console.error("Error getting user contribution:", error);
        throw error;
    }
};