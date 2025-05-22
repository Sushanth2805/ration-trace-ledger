
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BlockchainModeToggleProps {
  blockchainMode: boolean;
  setBlockchainMode: (mode: boolean) => void;
  onRefreshData: () => void;
  isLoading: boolean;
}

const BlockchainModeToggle: React.FC<BlockchainModeToggleProps> = ({
  blockchainMode,
  setBlockchainMode,
  onRefreshData,
  isLoading
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Label htmlFor="blockchain-mode" className="text-sm font-medium">
          Use Ethereum Blockchain
        </Label>
        <Switch
          id="blockchain-mode"
          checked={blockchainMode}
          onCheckedChange={setBlockchainMode}
        />
        {blockchainMode && (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Ethereum Mode
          </Badge>
        )}
      </div>
      
      {/* Refresh Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefreshData} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh Data
      </Button>
    </div>
  );
};

export default BlockchainModeToggle;
