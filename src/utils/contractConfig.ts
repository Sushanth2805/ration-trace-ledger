
import { ethers } from "ethers";

export class ContractConfig {
  private static instance: ContractConfig;
  
  // For demo purposes, you could update this to your deployed contract address
  // This address is just a placeholder
  private DEMO_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  private constructor() {}
  
  public static getInstance(): ContractConfig {
    if (!ContractConfig.instance) {
      ContractConfig.instance = new ContractConfig();
    }
    return ContractConfig.instance;
  }
  
  public async determineContractAddress(provider: ethers.providers.Web3Provider): Promise<string> {
    try {
      // If in development, use hardhat network
      const network = await provider.getNetwork();
      
      // Default to local hardhat contract address
      let contractAddress = this.DEMO_CONTRACT_ADDRESS;
      
      // Use local hardhat contract in development
      if (network.chainId === 31337 || network.chainId === 1337) {
        // Local hardhat node - use demo address
      } else if (network.chainId === 80001) {
        // Mumbai testnet
        contractAddress = process.env.MUMBAI_CONTRACT_ADDRESS || this.DEMO_CONTRACT_ADDRESS;
      }
      
      // Ensure we have a valid contract address
      if (!contractAddress) {
        console.error("No contract address specified");
        contractAddress = this.DEMO_CONTRACT_ADDRESS;
      }
      
      console.log("Using contract address:", contractAddress);
      return contractAddress;
    } catch (error) {
      console.error("Error determining contract address:", error);
      return this.DEMO_CONTRACT_ADDRESS;
    }
  }
  
  public getDemoContractAddress(): string {
    return this.DEMO_CONTRACT_ADDRESS;
  }
}
