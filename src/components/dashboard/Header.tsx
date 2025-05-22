
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield } from 'lucide-react';

interface HeaderProps {
  blockchainMode: boolean;
  ethConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ blockchainMode, ethConnected }) => {
  return (
    <div className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                Government Ration Distribution Tracker
              </h1>
              <p className="text-blue-600 mt-1">
                Blockchain-Secured Distribution Management System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="h-4 w-4 mr-1" />
              {blockchainMode && ethConnected ? "Ethereum Blockchain" : "Local Blockchain"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
