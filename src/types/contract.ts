
export interface TransactionData {
  beneficiaryName: string;
  beneficiaryId: string;
  itemType: string;
  quantity: number;
  shopId: string;
  officerName: string;
}

export interface ContractTransaction {
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

export interface ContractStats {
  totalTransactions: number;
  removedTransactions: number;
}
