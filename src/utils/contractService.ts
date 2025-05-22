
import { ethers } from "ethers";
import RationDistribution from "../artifacts/contracts/RationDistribution.sol/RationDistribution.json";

interface TransactionData {
  beneficiaryName: string;
  beneficiaryId: string;
  itemType: string;
  quantity: number;
  shopId: string;
  officerName: string;
}

interface ContractTransaction {
  id: number;
  beneficiaryName: string;
  beneficiaryId: string;
  itemType: string;
  quantity: number;
  shopId: string;
  officerName: string;
  timestamp: number;
  removed: boolean;
  removalReason: string;
  verifierName: string;
  removalTimestamp: number;
}

export class ContractService {
  private static instance: ContractService;
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string = '';
  
  // For demo purposes, you could update this to your deployed contract address
  // This address is just a placeholder
  private DEMO_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Add event emitter for transactions
  private transactionListeners: Array<() => void> = [];

  private constructor() {}

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
        
        // If in development, use hardhat network
        const network = await this.provider.getNetwork();
        
        // Use local hardhat contract in development
        if (network.chainId === 31337 || network.chainId === 1337) {
          // Local hardhat node
          this.contractAddress = this.DEMO_CONTRACT_ADDRESS;
        } else if (network.chainId === 80001) {
          // Mumbai testnet
          this.contractAddress = process.env.MUMBAI_CONTRACT_ADDRESS || this.DEMO_CONTRACT_ADDRESS;
        } else {
          // For any other network, use the demo address
          this.contractAddress = this.DEMO_CONTRACT_ADDRESS;
        }

        // Ensure we have a valid contract address
        if (!this.contractAddress) {
          console.error("No contract address specified");
          this.contractAddress = this.DEMO_CONTRACT_ADDRESS;
        }

        console.log("Using contract address:", this.contractAddress);

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
      this.notifyTransactionChange();
    });
    
    // Listen for TransactionRemoved events
    this.contract.on("TransactionRemoved", (id, verifierName, removalReason, removalTimestamp) => {
      console.log("Transaction removed event received:", id.toNumber());
      // Notify all listeners that a transaction was removed
      this.notifyTransactionChange();
    });
  }

  // Add listener registration methods
  public addTransactionListener(listener: () => void): void {
    this.transactionListeners.push(listener);
  }

  public removeTransactionListener(listener: () => void): void {
    const index = this.transactionListeners.indexOf(listener);
    if (index > -1) {
      this.transactionListeners.splice(index, 1);
    }
  }

  private notifyTransactionChange(): void {
    this.transactionListeners.forEach(listener => listener());
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
      this.notifyTransactionChange();
      
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
      this.notifyTransactionChange();
      
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

  public async getStats(): Promise<{ totalTransactions: number, removedTransactions: number }> {
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
