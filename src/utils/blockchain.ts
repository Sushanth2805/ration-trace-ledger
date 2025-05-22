
import crypto from 'crypto-js';
import { Transaction, Block, SystemStats } from '../types/blockchain';

export class BlockchainService {
  private static instance: BlockchainService;
  private chain: Block[] = [];
  private pendingTransactions: Transaction[] = [];
  private transactions: Transaction[] = [];

  private constructor() {
    this.createGenesisBlock();
    this.loadFromStorage();
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), [], '0', 0),
      nonce: 0
    };
    this.chain.push(genesisBlock);
  }

  private calculateHash(index: number, timestamp: number, transactions: Transaction[], previousHash: string, nonce: number): string {
    return crypto.SHA256(index + timestamp + JSON.stringify(transactions) + previousHash + nonce).toString();
  }

  private calculateTransactionHash(transaction: Omit<Transaction, 'hash'>): string {
    const data = `${transaction.id}${transaction.beneficiaryName}${transaction.beneficiaryId}${transaction.itemType}${transaction.quantity}${transaction.shopId}${transaction.officerName}${transaction.timestamp}${transaction.previousHash}`;
    return crypto.SHA256(data).toString();
  }

  public addTransaction(transactionData: Omit<Transaction, 'id' | 'hash' | 'previousHash' | 'timestamp' | 'verified'>): Transaction {
    const lastTransaction = this.transactions[this.transactions.length - 1];
    const previousHash = lastTransaction ? lastTransaction.hash : '0';
    
    const transaction: Omit<Transaction, 'hash'> = {
      ...transactionData,
      id: crypto.lib.WordArray.random(16).toString(),
      timestamp: Date.now(),
      previousHash,
      verified: false
    };

    const hash = this.calculateTransactionHash(transaction);
    
    const completeTransaction: Transaction = {
      ...transaction,
      hash
    };

    this.transactions.push(completeTransaction);
    this.saveToStorage();
    
    console.log('New transaction added to blockchain:', completeTransaction);
    return completeTransaction;
  }

  public verifyTransaction(transactionId: string, verificationCode: string, verifierName: string, reason: string): boolean {
    if (verificationCode !== 'GOVT2024') {
      console.log('Invalid verification code');
      return false;
    }

    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      console.log('Transaction not found');
      return false;
    }

    if (transaction.verified) {
      console.log('Transaction already verified');
      return false;
    }

    transaction.verified = true;
    transaction.verificationReason = reason;
    transaction.verifierName = verifierName;
    transaction.verificationTimestamp = Date.now();

    this.saveToStorage();
    console.log('Transaction verified:', transaction);
    return true;
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  public getUnverifiedTransactions(): Transaction[] {
    return this.transactions.filter(t => !t.verified);
  }

  public getVerifiedTransactions(): Transaction[] {
    return this.transactions.filter(t => t.verified);
  }

  public getStats(): SystemStats {
    const totalTransactions = this.transactions.length;
    const verifiedTransactions = this.transactions.filter(t => t.verified).length;
    const totalBeneficiaries = new Set(this.transactions.map(t => t.beneficiaryId)).size;
    const totalDistributions = this.transactions.reduce((sum, t) => sum + t.quantity, 0);

    return {
      totalTransactions,
      totalBeneficiaries,
      totalDistributions,
      pendingVerifications: 0, // For demo purposes
      verifiedTransactions
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rationBlockchain', JSON.stringify(this.transactions));
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rationBlockchain');
      if (stored) {
        this.transactions = JSON.parse(stored);
      }
    }
  }

  public verifyChainIntegrity(): boolean {
    for (let i = 1; i < this.transactions.length; i++) {
      const currentTransaction = this.transactions[i];
      const previousTransaction = this.transactions[i - 1];

      if (currentTransaction.previousHash !== previousTransaction.hash) {
        return false;
      }

      // Create a new object without the hash property
      const { hash, ...transactionWithoutHash } = currentTransaction;
      
      // Calculate the hash using the transaction data without the hash
      const calculatedHash = this.calculateTransactionHash(transactionWithoutHash);

      if (currentTransaction.hash !== calculatedHash) {
        return false;
      }
    }
    return true;
  }
}
