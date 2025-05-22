
import React from 'react';
import AddTransactionForm from '@/components/AddTransactionForm';
import BlockchainStatus from './BlockchainStatus';
import TransactionTabs from './TransactionTabs';
import { Transaction } from '@/types/blockchain';

interface MainContentProps {
  transactions: Transaction[];
  activeTransactions: Transaction[];
  removedTransactions: Transaction[];
  refreshData: () => void;
  blockchainMode: boolean;
  ethConnected: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  transactions,
  activeTransactions,
  removedTransactions,
  refreshData,
  blockchainMode,
  ethConnected
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Add Transaction Form */}
      <div className="xl:col-span-1">
        <AddTransactionForm 
          onTransactionAdded={refreshData}
          useBlockchain={blockchainMode && ethConnected}
        />
        
        {/* Blockchain Integrity Check */}
        <BlockchainStatus 
          blockchainMode={blockchainMode}
          ethConnected={ethConnected}
          transactions={transactions}
        />
      </div>

      {/* Transactions Table */}
      <div className="xl:col-span-2">
        <TransactionTabs
          activeTransactions={activeTransactions}
          removedTransactions={removedTransactions}
          onUpdate={refreshData}
          blockchainMode={blockchainMode && ethConnected} // Pass blockchainMode and ethConnected status
        />
      </div>
    </div>
  );
};

export default MainContent;
