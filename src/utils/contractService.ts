
import { ethers } from "ethers";
import RationDistribution from "../artifacts/contracts/RationDistribution.sol/RationDistribution.json";
import { ContractConfig } from "./contractConfig";
import { ContractEventManager } from "./contractEventManager";
import { TransactionData, ContractTransaction, ContractStats } from "../types/contract";

export class ContractService {
  private static instance: ContractService;
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string = '';
  
  // Dependency references
  private contractConfig: ContractConfig;
  private eventManager: ContractEventManager;
  
  private constructor() {
    this.contractConfig = ContractConfig.getInstance();
    this.eventManager = ContractEventManager.getInstance();
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  public async init(): Promise<boolean> {
    try {
      if (window.ethereum) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get the appropriate contract address based on network
        this.contractAddress = await this.contractConfig.determineContractAddress(this.provider);

        // Ask user to connect their wallet
        await this.provider.send("eth_requestAccounts", []);
        
        const signer = this.provider.getSigner();
        this.contract = new ethers.Contract(
          this.contractAddress,
          RationDistribution.abi,
          signer
        );
        
        // Set up event listeners for the contract
        if (this.contract) {
          this.setupEventListeners();
        }
        
        console.log("Smart contract connected at:", this.contractAddress);
        return true;
      }
      console.log("No ethereum wallet detected");
      return false;
    } catch (error) {
      console.error("Failed to connect to contract:", error);
      return false;
    }
  }

  // Add event listener setup
  private setupEventListeners(): void {
    if (!this.contract) return;
    
    // Listen for TransactionAdded events from the contract
    this.contract.on("TransactionAdded", (id, beneficiaryId, itemType, quantity, timestamp) => {
      console.log("Transaction added event received:", id.toNumber());
      // Notify all listeners that a transaction was added
      this.eventManager.notifyTransactionChange();
    });
    
    // Listen for TransactionRemoved events
    this.contract.on("TransactionRemoved", (id, verifierName, removalReason, removalTimestamp) => {
      console.log("Transaction removed event received:", id.toNumber());
      // Notify all listeners that a transaction was removed
      this.eventManager.notifyTransactionChange();
    });
  }

  // Add listener registration methods
  public addTransactionListener(listener: () => void): void {
    this.eventManager.addTransactionListener(listener);
  }

  public removeTransactionListener(listener: () => void): void {
    this.eventManager.removeTransactionListener(listener);
  }

  public async isConnected(): Promise<boolean> {
    return !!this.contract && !!this.provider;
  }

  public async addTransaction(data: TransactionData): Promise<string | null> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");
      
      const tx = await this.contract.addTransaction(
        data.beneficiaryName,
        data.beneficiaryId,
        data.itemType,
        data.quantity,
        data.shopId,
        data.officerName
      );
      
      const receipt = await tx.wait();
      console.log("Transaction added to blockchain:", receipt);
      
      // Get the event from the receipt
      const event = receipt.events?.find(e => e.event === "TransactionAdded");
      const id = event?.args?.id.toNumber();
      
      // Manually notify listeners since we've waited for the receipt
      this.eventManager.notifyTransactionChange();
      
      return id !== undefined ? id.toString() : null;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return null;
    }
  }

  public async requestRemoval(
    transactionId: number, 
    verificationCode: string, 
    verifierName: string, 
    reason: string
  ): Promise<boolean> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");
      
      const tx = await this.contract.requestRemoval(
        transactionId,
        verificationCode,
        verifierName,
        reason
      );
      
      await tx.wait();
      
      // Manually notify listeners since we've waited for the receipt
      this.eventManager.notifyTransactionChange();
      
      return true;
    } catch (error) {
      console.error("Error removing transaction:", error);
      return false;
    }
  }

  public async getTransactions(): Promise<ContractTransaction[]> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");
      
      const count = await this.contract.getTransactionCount();
      console.log("Contract transaction count:", count.toNumber());
      const transactions: ContractTransaction[] = [];
      
      for (let i = 0; i < count; i++) {
        const tx = await this.contract.getTransaction(i);
        
        // Format the transaction data
        transactions.push({
          id: tx.id.toNumber(),
          beneficiaryName: tx.beneficiaryName,
          beneficiaryId: tx.beneficiaryId,
          itemType: tx.itemType,
          quantity: tx.quantity.toNumber(),
          shopId: tx.shopId,
          officerName: tx.officerName,
          timestamp: tx.timestamp.toNumber() * 1000, // Convert to milliseconds
          removed: tx.removed,
          removalReason: tx.removalReason,
          verifierName: tx.verifierName,
          removalTimestamp: tx.removalTimestamp.toNumber() * 1000 // Convert to milliseconds
        });
      }
      
      return transactions;
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  }

  public async getStats(): Promise<ContractStats> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");
      
      const stats = await this.contract.getStats();
      
      return {
        totalTransactions: stats.totalTransactions.toNumber(),
        removedTransactions: stats.removedTransactions.toNumber()
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalTransactions: 0,
        removedTransactions: 0
      };
    }
  }

  public getConnectionStatus(): string {
    if (!window.ethereum) return "No wallet detected";
    if (!this.provider) return "Wallet not connected";
    if (!this.contract) return "Contract not connected";
    return "Connected to blockchain";
  }
}
