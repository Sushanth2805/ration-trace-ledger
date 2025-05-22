
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BeneficiaryFields, ItemFields, DistributionFields } from './FormFields';

interface TransactionFormContainerProps {
  children?: React.ReactNode;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formData: {
    beneficiaryName: string;
    beneficiaryId: string;
    itemType: string;
    quantity: string;
    shopId: string;
    officerName: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    beneficiaryName: string;
    beneficiaryId: string;
    itemType: string;
    quantity: string;
    shopId: string;
    officerName: string;
  }>>;
  submitButtonText: string;
  submitButtonClass?: string;
}

const TransactionFormContainer: React.FC<TransactionFormContainerProps> = ({
  title,
  onSubmit,
  isSubmitting,
  formData,
  setFormData,
  submitButtonText,
  submitButtonClass
}) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <BeneficiaryFields formData={formData} setFormData={setFormData} />
          <ItemFields formData={formData} setFormData={setFormData} />
          <DistributionFields formData={formData} setFormData={setFormData} />

          <Button 
            type="submit" 
            className={`w-full ${submitButtonClass || 'bg-blue-600 hover:bg-blue-700'} text-white py-3`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionFormContainer;
