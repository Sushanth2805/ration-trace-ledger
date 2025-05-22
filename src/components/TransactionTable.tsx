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
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: () => void;
  blockchainMode?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onUpdate, blockchainMode = false }) => {
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
      // Check if verification code matches the demo code
      const demoCode = "GOVT2024";
      
      if (verificationCode !== demoCode) {
        toast({
          title: "Verification Failed",
          description: "Invalid verification code",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
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
          title: "Removal Failed",
          description: "Failed to remove transaction",
          variant: "destructive"
        });
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

  // Show message when in ethereum mode and no transactions
  if (blockchainMode && transactions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Blockchain Transaction Records
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            No transactions found in the blockchain.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please add a transaction using the form on the left.
          </p>
        </CardContent>
      </Card>
    );
  }

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Shop ID</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4 text-gray-500">No transactions found</TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.beneficiaryName}</div>
                        <div className="text-sm text-gray-500">{transaction.beneficiaryId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.itemType}</TableCell>
                    <TableCell>{transaction.quantity} kg/L</TableCell>
                    <TableCell>{transaction.shopId}</TableCell>
                    <TableCell>{transaction.officerName}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {formatHash(transaction.hash)}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell>
                      {!transaction.removed && !blockchainMode ? (
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
                      ) : transaction.removed ? (
                        <div className="text-sm text-gray-500">
                          <div>Removed by: {transaction.verifierName}</div>
                          <div className="truncate max-w-[150px]">Reason: {transaction.removalReason}</div>
                          <div>Date: {transaction.removalTimestamp ? formatDate(transaction.removalTimestamp) : 'N/A'}</div>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
