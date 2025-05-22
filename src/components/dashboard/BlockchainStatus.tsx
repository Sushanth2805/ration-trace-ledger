
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle } from 'lucide-react';
import { Transaction } from '@/types/blockchain';

interface BlockchainStatusProps {
  transactions: Transaction[];
}

const BlockchainStatus: React.FC<BlockchainStatusProps> = ({
  transactions
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-green-900 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span>Type:</span>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Shield className="h-4 w-4 mr-1" />
            Local Blockchain
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>Chain Integrity:</span>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Verified
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>Total Blocks:</span>
          <span className="font-semibold">{transactions.length}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>Last Hash:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {transactions.length > 0 
              ? `${transactions[transactions.length - 1].hash?.substring(0, 8)}...`
              : 'N/A'
            }
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainStatus;
