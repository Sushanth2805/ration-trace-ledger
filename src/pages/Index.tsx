import React, { useState, useEffect } from 'react';
import { BlockchainService } from '../utils/blockchain';
import { ContractService } from '../utils/contractService';
import { Transaction } from '../types/blockchain';
import BlockchainConnection from '../components/BlockchainConnection';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import Header from '@/components/dashboard/Header';
import BlockchainModeToggle from '@/components/dashboard/BlockchainModeToggle';
import MainContent from '@/components/dashboard/MainContent';
import SecurityFooter from '@/components/dashboard/SecurityFooter';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalBeneficiaries: 0,
    totalDistributions: 0,
    pendingVerifications: 0,
    removedTransactions: 0
  });
  const [blockchainMode, setBlockchainMode] = useState(false);
  const [ethConnected, setEthConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setIsLoading(true);
    try {
      if (blockchainMode && window.ethereum) {
        try {
          const contractService = ContractService.getInstance();
          const connected = await contractService.isConnected();
          
          if (connected) {
            setEthConnected(true);
            const txs = await contractService.getTransactions();
            setTransactions(txs as unknown as Transaction[]);
            
            const contractStats = await contractService.getStats();
            setStats({
              totalTransactions: contractStats.totalTransactions,
              totalBeneficiaries: new Set(txs.map(t => t.beneficiaryId)).size,
              totalDistributions: txs.reduce((sum, t) => sum + t.quantity, 0),
              pendingVerifications: 0,
              removedTransactions: contractStats.removedTransactions
            });
          } else {
            // Fallback to local data
            setEthConnected(false);
            loadLocalData();
          }
        } catch (error) {
          console.error("Error fetching blockchain data:", error);
          toast({
            title: "Blockchain Error",
            description: "Failed to fetch data from blockchain. Falling back to local data.",
            variant: "destructive"
          });
          setEthConnected(false);
          // Fallback to local data
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
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
  }, [blockchainMode]);

  // Set up contract service listeners
  useEffect(() => {
    if (blockchainMode && window.ethereum) {
      const contractService = ContractService.getInstance();
      
      // Set up a transaction listener that will refresh data when transactions change
      const transactionListener = () => {
        console.log("Transaction change detected, refreshing data");
        refreshData();
      };
      
      // Add the listener
      contractService.addTransactionListener(transactionListener);
      
      // Clean up by removing the listener when the component unmounts
      return () => {
        contractService.removeTransactionListener(transactionListener);
      };
    }
  }, [blockchainMode]);

  const activeTransactions = transactions.filter(t => !t.removed);
  const removedTransactions = transactions.filter(t => t.removed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <Header blockchainMode={blockchainMode} ethConnected={ethConnected} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blockchain Mode Toggle */}
        <BlockchainModeToggle
          blockchainMode={blockchainMode}
          setBlockchainMode={setBlockchainMode}
          onRefreshData={refreshData}
          isLoading={isLoading}
        />

        {/* Blockchain Connection (only visible in blockchain mode) */}
        {blockchainMode && (
          <div className="mb-8">
            <BlockchainConnection />
          </div>
        )}

        {/* Main Content - Now contains the StatsDisplay */}
        <MainContent
          transactions={transactions}
          activeTransactions={activeTransactions}
          removedTransactions={removedTransactions}
          refreshData={refreshData}
          blockchainMode={blockchainMode}
          ethConnected={ethConnected}
          stats={stats}
        />

        {/* Footer */}
        <SecurityFooter />
      </div>
    </div>
  );
};

export default Index;
