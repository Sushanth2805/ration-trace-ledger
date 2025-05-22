
import React from 'react';
import { Shield, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const SecurityFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center text-gray-600">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold">Blockchain Security Features</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Immutable Records</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Cryptographic Hashing</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span>Audit Trail Preserved</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span>Smart Contract Compatible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityFooter;
