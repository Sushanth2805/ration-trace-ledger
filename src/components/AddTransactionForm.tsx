
import React, { useState } from 'react';
import TransactionFormContainer from './transaction-form/TransactionFormContainer';
import { useFormSubmit } from './transaction-form/FormSubmitHandler';

interface AddTransactionFormProps {
  onTransactionAdded: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryId: '',
    itemType: '',
    quantity: '',
    shopId: '',
    officerName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit } = useFormSubmit();

  const resetForm = () => {
    setFormData({
      beneficiaryName: '',
      beneficiaryId: '',
      itemType: '',
      quantity: '',
      shopId: '',
      officerName: ''
    });
  };

  const processSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await handleSubmit({
      formData,
      onSuccess: onTransactionAdded,
      resetForm
    });
    
    setIsSubmitting(false);
  };

  return (
    <TransactionFormContainer
      title="Add New Distribution Transaction"
      onSubmit={processSubmit}
      isSubmitting={isSubmitting}
      formData={formData}
      setFormData={setFormData}
      submitButtonText="Add Transaction to Blockchain"
      submitButtonClass="bg-blue-600 hover:bg-blue-700"
    />
  );
};

export default AddTransactionForm;
