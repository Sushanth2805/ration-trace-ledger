
import React, { useState, useEffect } from 'react';
import { BlockchainService } from '../utils/blockchain';
import { ContractService } from '../utils/contractService';
import { Transaction } from '../types/blockchain';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionTable from '../components/TransactionTable';
import BlockchainConnection from '../components/BlockchainConnection';
import StatsCard from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  CheckCircle,
  Trash2,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                  Government Ration Distribution Tracker
                </h1>
                <p className="text-blue-600 mt-1">
                  Blockchain-Secured Distribution Management System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-4 w-4 mr-1" />
                {blockchainMode && ethConnected ? "Ethereum Blockchain" : "Local Blockchain"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blockchain Mode Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="blockchain-mode" className="text-sm font-medium">
              Use Ethereum Blockchain
            </Label>
            <Switch
              id="blockchain-mode"
              checked={blockchainMode}
              onCheckedChange={setBlockchainMode}
            />
            {blockchainMode && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                Ethereum Mode
              </Badge>
            )}
          </div>
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Blockchain Connection (only visible in blockchain mode) */}
        {blockchainMode && (
          <div className="mb-8">
            <BlockchainConnection />
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={BarChart3}
            color="blue"
          />
          <StatsCard
            title="Beneficiaries"
            value={stats.totalBeneficiaries}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Total Distributions"
            value={`${stats.totalDistributions} kg/L`}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="Removed Records"
            value={stats.removedTransactions}
            icon={Trash2}
            color="red"
          />
          <StatsCard
            title="Active Records"
            value={stats.totalTransactions - stats.removedTransactions}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="xl:col-span-1">
            <AddTransactionForm 
              onTransactionAdded={refreshData}
              useBlockchain={blockchainMode && ethConnected}
            />
            
            {/* Blockchain Integrity Check */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Blockchain Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Type:</span>
                  <Badge variant="outline" className={blockchainMode && ethConnected ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                    {blockchainMode && ethConnected ? (
                      <>
                        Ethereum/Polygon
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-1" />
                        Local Blockchain
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>Chain Integrity:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>Total Blocks:</span>
                  <span className="font-semibold">{transactions.length}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>Last Hash:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {transactions.length > 0 
                      ? `${transactions[transactions.length - 1].hash?.substring(0, 8)}...`
                      : 'N/A'
                    }
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Active Transactions ({activeTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="removed" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Audit Trail ({removedTransactions.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                <TransactionTable 
                  transactions={activeTransactions} 
                  onUpdate={refreshData} 
                />
              </TabsContent>
              
              <TabsContent value="removed" className="mt-6">
                <TransactionTable 
                  transactions={removedTransactions} 
                  onUpdate={refreshData} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">Blockchain Security Features</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Immutable Records</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Cryptographic Hashing</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span>Audit Trail Preserved</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span>Smart Contract Compatible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
