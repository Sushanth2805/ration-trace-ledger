
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Transaction } from '../types/blockchain';
import { BlockchainService } from '../utils/blockchain';
import { ContractService } from '../utils/contractService';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onUpdate }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifierName, setVerifierName] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleRemovalRequest = async () => {
    if (!selectedTransaction || !verificationCode || !verifierName || !removalReason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Check if we're using Ethereum mode
      const isEthereumMode = window.ethereum && window.ethereum.isMetaMask;
      
      if (isEthereumMode) {
        // Use ContractService for Ethereum mode
        const contractService = ContractService.getInstance();
        const success = await contractService.requestRemoval(
          Number(selectedTransaction.id),
          verificationCode,
          verifierName,
          removalReason
        );
        
        if (success) {
          toast({
            title: "Transaction Removed",
            description: "Transaction has been marked as removed and recorded in audit trail",
          });
          setIsDialogOpen(false);
          // Data will refresh automatically via event listener
        } else {
          toast({
            title: "Verification Failed",
            description: "Invalid verification code or transaction not found",
            variant: "destructive"
          });
        }
      } else {
        // Use BlockchainService for local mode
        const blockchain = BlockchainService.getInstance();
        const success = blockchain.requestRemoval(
          selectedTransaction.id,
          verificationCode,
          verifierName,
          removalReason
        );
        
        if (success) {
          toast({
            title: "Transaction Removed",
            description: "Transaction has been marked as removed and recorded in audit trail",
          });
          setIsDialogOpen(false);
          onUpdate();
        } else {
          toast({
            title: "Verification Failed",
            description: "Invalid verification code or transaction not found",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error removing transaction:", error);
      toast({
        title: "Error",
        description: "Failed to process transaction removal",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setVerificationCode('');
      setVerifierName('');
      setRemovalReason('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain Transaction Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                <th className="text-left p-3 font-semibold text-gray-700">Beneficiary</th>
                <th className="text-left p-3 font-semibold text-gray-700">Item</th>
                <th className="text-left p-3 font-semibold text-gray-700">Quantity</th>
                <th className="text-left p-3 font-semibold text-gray-700">Shop ID</th>
                <th className="text-left p-3 font-semibold text-gray-700">Officer</th>
                <th className="text-left p-3 font-semibold text-gray-700">Hash</th>
                <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">No transactions found</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      {transaction.removed ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Removed
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{transaction.beneficiaryName}</div>
                        <div className="text-sm text-gray-500">{transaction.beneficiaryId}</div>
                      </div>
                    </td>
                    <td className="p-3">{transaction.itemType}</td>
                    <td className="p-3">{transaction.quantity} kg/L</td>
                    <td className="p-3">{transaction.shopId}</td>
                    <td className="p-3">{transaction.officerName}</td>
                    <td className="p-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {formatHash(transaction.hash)}
                      </code>
                    </td>
                    <td className="p-3 text-sm">{formatDate(transaction.timestamp)}</td>
                    <td className="p-3">
                      {!transaction.removed ? (
                        <Dialog open={isDialogOpen && selectedTransaction?.id === transaction.id} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (open) setSelectedTransaction(transaction);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Request Removal
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Verify Transaction Removal</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="verificationCode">Verification Code</Label>
                                <Input
                                  id="verificationCode"
                                  type="password"
                                  value={verificationCode}
                                  onChange={(e) => setVerificationCode(e.target.value)}
                                  placeholder="Enter verification code"
                                  className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">Demo code: GOVT2024</p>
                              </div>
                              <div>
                                <Label htmlFor="verifierName">Verifier Name</Label>
                                <Input
                                  id="verifierName"
                                  value={verifierName}
                                  onChange={(e) => setVerifierName(e.target.value)}
                                  placeholder="Enter your name"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="removalReason">Reason for Removal</Label>
                                <Textarea
                                  id="removalReason"
                                  value={removalReason}
                                  onChange={(e) => setRemovalReason(e.target.value)}
                                  placeholder="Enter reason for removal"
                                  className="mt-1"
                                />
                              </div>
                              <Button 
                                onClick={handleRemovalRequest}
                                className="w-full bg-red-600 hover:bg-red-700"
                              >
                                Confirm Removal
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="text-sm text-gray-500">
                          <div>Removed by: {transaction.verifierName}</div>
                          <div className="truncate max-w-[150px]">Reason: {transaction.removalReason}</div>
                          <div>Date: {transaction.removalTimestamp ? formatDate(transaction.removalTimestamp) : 'N/A'}</div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
