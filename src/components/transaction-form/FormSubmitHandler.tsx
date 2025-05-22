
import { BlockchainService } from '../../utils/blockchain';
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
  onSuccess: () => void;
  resetForm: () => void;
}

export const useFormSubmit = () => {
  const { toast } = useToast();

  const handleSubmit = async ({ formData, onSuccess, resetForm }: FormSubmitProps) => {
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
      
      const transactionId = transaction.id;
      const successMessage = "Transaction recorded successfully";
      
      if (transactionId) {
        toast({
          title: "Transaction Added",
          description: `${successMessage} with ID: ${transactionId.substring(0, 8)}...`,
        });
      } else {
        toast({
          title: "Transaction Added",
          description: successMessage,
        });
      }

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
