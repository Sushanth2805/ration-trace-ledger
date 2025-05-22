
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Link } from 'lucide-react';
import { Transaction } from '@/types/blockchain';
import { BlockchainService } from '@/utils/blockchain';

interface BlockchainStatusProps {
  transactions: Transaction[];
}

const BlockchainStatus: React.FC<BlockchainStatusProps> = ({
  transactions
}) => {
  // Check chain integrity
  const chainIsValid = transactions.length > 0 
    ? BlockchainService.getInstance().verifyChainIntegrity()
    : true;
    
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
          <Badge variant="outline" className={`${chainIsValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <CheckCircle className="h-4 w-4 mr-1" />
            {chainIsValid ? "Verified" : "Invalid"}
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
        
        {/* Visual Blockchain Chain */}
        {transactions.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium mb-2">Chain Visualization:</div>
            <div className="flex items-center overflow-x-auto pb-2">
              {transactions.slice(0, 5).map((tx, index) => (
                <React.Fragment key={tx.id}>
                  <div className={`rounded-lg py-1 px-2 text-xs flex-shrink-0 ${
                    index === 0 ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    {index === 0 ? "Genesis" : `Block ${index}`}
                  </div>
                  {index < Math.min(transactions.length, 5) - 1 && (
                    <Link className="h-3 w-3 mx-1 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
              {transactions.length > 5 && (
                <>
                  <Link className="h-3 w-3 mx-1 flex-shrink-0" />
                  <div className="rounded-lg py-1 px-2 bg-gray-100 text-xs flex-shrink-0">
                    ... {transactions.length - 5} more
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainStatus;
