
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormFieldProps {
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
}

export const itemTypes = ['Rice', 'Wheat', 'Sugar', 'Oil', 'Dal', 'Kerosene'];

export const BeneficiaryFields: React.FC<FormFieldProps> = ({ formData, setFormData }) => {
  return (
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
  );
};

export const ItemFields: React.FC<FormFieldProps> = ({ formData, setFormData }) => {
  return (
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
  );
};

export const DistributionFields: React.FC<FormFieldProps> = ({ formData, setFormData }) => {
  return (
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
  );
};
