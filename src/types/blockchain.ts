
export interface Transaction {
  id: string;
  beneficiaryName: string;
  beneficiaryId: string;
  itemType: string;
  quantity: number;
  shopId: string;
  officerName: string;
  timestamp: number;
  hash: string;
  previousHash: string;
  verified: boolean;
  verificationReason?: string;
  verifierName?: string;
  verificationTimestamp?: number;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface VerificationRequest {
  transactionId: string;
  reason: string;
  verifierName: string;
  timestamp: number;
}

export interface SystemStats {
  totalTransactions: number;
  totalBeneficiaries: number;
  totalDistributions: number;
  pendingVerifications: number;
  verifiedTransactions: number;
}
