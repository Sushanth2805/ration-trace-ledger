
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
  stats: SystemStats;
}

const MainContent: React.FC<MainContentProps> = ({
  transactions,
  activeTransactions,
  removedTransactions,
  refreshData,
  stats
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Stats Display */}
      <div className="xl:col-span-3">
        <StatsDisplay stats={stats} />
      </div>
      
      {/* Add Transaction Form */}
      <div className="xl:col-span-1">
        <AddTransactionForm 
          onTransactionAdded={refreshData}
        />
        
        {/* Blockchain Integrity Check */}
        <BlockchainStatus 
          transactions={transactions}
        />
      </div>

      {/* Transactions Table */}
      <div className="xl:col-span-2">
        <TransactionTabs
          activeTransactions={activeTransactions}
          removedTransactions={removedTransactions}
          onUpdate={refreshData}
        />
      </div>
    </div>
  );
};

export default MainContent;
