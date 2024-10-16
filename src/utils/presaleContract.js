import { ethers } from 'ethers';

const PRESALE_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with your contract address

const PRESALE_CONTRACT_ABI = [
    // Replace with your contract ABI
    "function buyTokens(uint256 amount) payable",
    "function tokenPrice() view returns (uint256)",
    "function tokensAvailable() view returns (uint256)",
    "function presaleEndTime() view returns (uint256)"
];

export const getPresaleContract = (providerOrSigner) => {
    return new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_CONTRACT_ABI, providerOrSigner);
};

export const buyTokens = async (signer, amount) => {
    const contract = getPresaleContract(signer);
    const price = await contract.tokenPrice();
    const value = price.mul(amount);
    const tx = await contract.buyTokens(amount, { value });
    return tx.wait();
};

export const getTokenPrice = async (provider) => {
    const contract = getPresaleContract(provider);
    return contract.tokenPrice();
};

export const getTokensAvailable = async (provider) => {
    const contract = getPresaleContract(provider);
    return contract.tokensAvailable();
};

export const getPresaleEndTime = async (provider) => {
    const contract = getPresaleContract(provider);
    return contract.presaleEndTime();
};