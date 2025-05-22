
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionTable from '@/components/TransactionTable';
import { CheckCircle, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/blockchain';

interface TransactionTabsProps {
  activeTransactions: Transaction[];
  removedTransactions: Transaction[];
  onUpdate: () => void;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({
  activeTransactions,
  removedTransactions,
  onUpdate
}) => {
  return (
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
          onUpdate={onUpdate} 
        />
      </TabsContent>
      
      <TabsContent value="removed" className="mt-6">
        <TransactionTable 
          transactions={removedTransactions} 
          onUpdate={onUpdate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TransactionTabs;
