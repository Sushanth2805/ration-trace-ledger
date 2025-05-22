
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Link } from 'lucide-react';

const Header: React.FC = () => {
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
              Immutable Verification System
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Visual Blockchain Chain */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-4">
        <div className="flex items-center space-x-1 text-xs text-blue-600 overflow-x-auto pb-1">
          <div className="bg-blue-100 rounded px-2 py-1 whitespace-nowrap">
            Genesis Block
          </div>
          <Link className="h-3 w-3 flex-shrink-0" />
          <div className="bg-blue-100 rounded px-2 py-1 whitespace-nowrap flex items-center">
            <span>Each transaction links to previous hash</span>
          </div>
          <Link className="h-3 w-3 flex-shrink-0" />
          <div className="bg-blue-100 rounded px-2 py-1 whitespace-nowrap">
            Creating immutable chain
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
