
import React, { useState, useEffect } from 'react';
import { BlockchainService } from '../utils/blockchain';
import { Transaction, SystemStats } from '../types/blockchain';
import { useToast } from '@/hooks/use-toast';

// Import our components
import Header from '@/components/dashboard/Header';
import MainContent from '@/components/dashboard/MainContent';
import SecurityFooter from '@/components/dashboard/SecurityFooter';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalTransactions: 0,
    totalBeneficiaries: 0,
    totalDistributions: 0,
    pendingVerifications: 0,
    verifiedTransactions: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setIsLoading(true);
    try {
      loadLocalData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalData = () => {
    const blockchain = BlockchainService.getInstance();
    setTransactions(blockchain.getTransactions());
    setStats(blockchain.getStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Modified: Include all transactions in activeTransactions, not just unverified ones
  const activeTransactions = transactions;
  const verifiedTransactions = transactions.filter(t => t.verified);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Refresh Button */}
        <div className="mb-6 flex items-center justify-end">
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={refreshData}
            disabled={isLoading}
          >
            <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Main Content */}
        <MainContent
          transactions={transactions}
          activeTransactions={activeTransactions}
          removedTransactions={verifiedTransactions}
          refreshData={refreshData}
          stats={stats}
        />

        {/* Footer */}
        <SecurityFooter />
      </div>
    </div>
  );
};

export default Index;
