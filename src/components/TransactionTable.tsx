
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
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle, AlertCircle, Link } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onUpdate }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifierName, setVerifierName] = useState('');
  const [verificationReason, setVerificationReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleVerification = async () => {
    if (!selectedTransaction || !verificationCode || !verifierName || !verificationReason) {
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
      const success = blockchain.verifyTransaction(
        selectedTransaction.id,
        verificationCode,
        verifierName,
        verificationReason
      );
      
      if (success) {
        toast({
          title: "Transaction Verified",
          description: "Transaction has been verified and recorded in audit trail",
        });
        setIsDialogOpen(false);
        onUpdate();
      } else {
        toast({
          title: "Verification Failed",
          description: "Failed to verify transaction",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      toast({
        title: "Error",
        description: "Failed to process transaction verification",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setVerificationCode('');
      setVerifierName('');
      setVerificationReason('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  // Show message when no transactions
  if (transactions.length === 0) {
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
                <TableHead>Chain</TableHead>
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
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-xs text-blue-600">
                    {index > 0 ? (
                      <div className="flex flex-col items-center">
                        <Link className="h-3 w-3 mb-1" />
                        <div className="text-center">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200">
                            #{index}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 border-green-200">Genesis</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.verified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Pending
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
                    {index > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Link className="h-3 w-3 mr-1" />
                          {formatHash(transaction.previousHash)}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(transaction.timestamp)}</TableCell>
                  <TableCell>
                    {!transaction.verified ? (
                      <Dialog open={isDialogOpen && selectedTransaction?.id === transaction.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) setSelectedTransaction(transaction);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify Record
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Verify Transaction Record</DialogTitle>
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
                              <Label htmlFor="verificationReason">Verification Notes</Label>
                              <Textarea
                                id="verificationReason"
                                value={verificationReason}
                                onChange={(e) => setVerificationReason(e.target.value)}
                                placeholder="Enter verification notes"
                                className="mt-1"
                              />
                            </div>
                            <Button 
                              onClick={handleVerification}
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Confirm Verification'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <div>Verified by: {transaction.verifierName}</div>
                        <div className="truncate max-w-[150px]">Notes: {transaction.verificationReason}</div>
                        <div>Date: {transaction.verificationTimestamp ? formatDate(transaction.verificationTimestamp) : 'N/A'}</div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
