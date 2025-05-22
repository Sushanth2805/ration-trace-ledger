
import { TransactionData } from '@/types/contract';
import { BlockchainService } from '../../utils/blockchain';
import { ContractService } from '../../utils/contractService';
import { useToast } from '@/hooks/use-toast';

interface FormSubmitProps {
  formData: {
    beneficiaryName: string;
    beneficiaryId: string;
    itemType: string;
    quantity: string;
    shopId: string;
    officerName: string;
  };
  useBlockchain: boolean;
  onSuccess: () => void;
  resetForm: () => void;
}

export const useFormSubmit = () => {
  const { toast } = useToast();

  const handleSubmit = async ({ formData, useBlockchain, onSuccess, resetForm }: FormSubmitProps) => {
    // Validation
    if (!formData.beneficiaryName || !formData.beneficiaryId || !formData.itemType || 
        !formData.quantity || !formData.shopId || !formData.officerName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

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

      resetForm();
      onSuccess();
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
      return false;
    }
  };

  return { handleSubmit };
};
