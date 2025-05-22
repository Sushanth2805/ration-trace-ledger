
import React from 'react';
import AddTransactionForm from '@/components/AddTransactionForm';
import BlockchainStatus from './BlockchainStatus';
import TransactionTabs from './TransactionTabs';
import { Transaction } from '@/types/blockchain';
import StatsDisplay from './StatsDisplay';
import { SystemStats } from '@/types/blockchain';

interface MainContentProps {
  transactions: Transaction[];
  activeTransactions: Transaction[];
  removedTransactions: Transaction[];
  refreshData: () => void;
  blockchainMode: boolean;
  ethConnected: boolean;
  stats: SystemStats;
}

const MainContent: React.FC<MainContentProps> = ({
  transactions,
  activeTransactions,
  removedTransactions,
  refreshData,
  blockchainMode,
  ethConnected,
  stats
}) => {
  // If we're in Ethereum mode, only show the transaction form and stats
  if (blockchainMode && ethConnected) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mb-8">
          {/* Show stats in Ethereum mode too */}
          <div className="mb-8">
            <StatsDisplay stats={stats} />
          </div>
          
          <AddTransactionForm 
            onTransactionAdded={refreshData}
            useBlockchain={blockchainMode && ethConnected}
          />
        </div>
      </div>
    );
  }
  
  // Otherwise show the normal layout
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
          blockchainMode={blockchainMode && ethConnected}
        />
      </div>
    </div>
  );
};

export default MainContent;
