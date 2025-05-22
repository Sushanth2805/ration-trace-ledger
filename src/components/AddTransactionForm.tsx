
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockchainService } from '../utils/blockchain';
import { ContractService } from '../utils/contractService';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionFormProps {
  onTransactionAdded: () => void;
  useBlockchain: boolean;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onTransactionAdded, useBlockchain }) => {
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryId: '',
    itemType: '',
    quantity: '',
    shopId: '',
    officerName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const itemTypes = ['Rice', 'Wheat', 'Sugar', 'Oil', 'Dal', 'Kerosene'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beneficiaryName || !formData.beneficiaryId || !formData.itemType || !formData.quantity || !formData.shopId || !formData.officerName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let transactionId;
      
      if (useBlockchain) {
        // Use the smart contract service for blockchain
        const contractService = ContractService.getInstance();
        const connected = await contractService.isConnected();
        
        if (!connected) {
          const initialized = await contractService.init();
          if (!initialized) {
            throw new Error("Failed to initialize blockchain connection");
          }
        }
        
        transactionId = await contractService.addTransaction({
          beneficiaryName: formData.beneficiaryName,
          beneficiaryId: formData.beneficiaryId,
          itemType: formData.itemType,
          quantity: parseInt(formData.quantity),
          shopId: formData.shopId,
          officerName: formData.officerName
        });
      } else {
        // Use the local blockchain service
        const blockchain = BlockchainService.getInstance();
        const transaction = blockchain.addTransaction({
          beneficiaryName: formData.beneficiaryName,
          beneficiaryId: formData.beneficiaryId,
          itemType: formData.itemType,
          quantity: parseInt(formData.quantity),
          shopId: formData.shopId,
          officerName: formData.officerName
        });
        transactionId = transaction.id;
      }
      
      let successMessage = "Transaction recorded successfully";
      if (useBlockchain) {
        successMessage += " on the blockchain";
      }
      
      if (transactionId) {
        successMessage += ` with ID: ${typeof transactionId === 'string' ? transactionId.substring(0, 8) : transactionId}...`;
      }
      
      toast({
        title: "Transaction Added",
        description: successMessage,
      });

      setFormData({
        beneficiaryName: '',
        beneficiaryId: '',
        itemType: '',
        quantity: '',
        shopId: '',
        officerName: ''
      });

      onTransactionAdded();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          Add New Distribution Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
              <Input
                id="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                placeholder="Enter beneficiary name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="beneficiaryId">Beneficiary ID</Label>
              <Input
                id="beneficiaryId"
                value={formData.beneficiaryId}
                onChange={(e) => setFormData({ ...formData, beneficiaryId: e.target.value })}
                placeholder="Enter beneficiary ID"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemType">Item Type</Label>
              <Select value={formData.itemType} onValueChange={(value) => setFormData({ ...formData, itemType: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity (kg/liters)</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
                className="mt-1"
                min="0.1"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shopId">Shop ID</Label>
              <Input
                id="shopId"
                value={formData.shopId}
                onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                placeholder="Enter shop ID"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="officerName">Distribution Officer</Label>
              <Input
                id="officerName"
                value={formData.officerName}
                onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                placeholder="Enter officer name"
                className="mt-1"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full ${useBlockchain ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : useBlockchain ? 'Add Transaction to Ethereum Blockchain' : 'Add Transaction to Local Blockchain'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
