
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import { ContractService } from '../utils/contractService';
import { ethers } from 'ethers';

const BlockchainConnection: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Not connected');
  const [network, setNetwork] = useState('Unknown');
  const [address, setAddress] = useState('');
  const contractService = ContractService.getInstance();
  
  const connectToBlockchain = async () => {
    try {
      const connected = await contractService.init();
      setIsConnected(connected);
      setStatus(contractService.getConnectionStatus());
      
      if (connected && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network.name === 'unknown' ? (network.chainId === 1337 ? 'Hardhat' : network.chainId === 80001 ? 'Mumbai' : 'Unknown') : network.name);
        
        const accounts = await provider.listAccounts();
        setAddress(accounts[0] || 'No account detected');
      }
    } catch (error) {
      console.error('Error connecting to blockchain:', error);
      setStatus('Connection error');
    }
  };
  
  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      const connected = await contractService.isConnected();
      setIsConnected(connected);
      setStatus(contractService.getConnectionStatus());
    };
    
    checkConnection();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            {isConnected ? (
              <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Network:</span>
            <span>{network}</span>
          </div>
          
          {address && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Account:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </code>
            </div>
          )}
          
          <Button 
            onClick={connectToBlockchain} 
            className={`w-full ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isConnected}
          >
            {isConnected ? 'Connected to Blockchain' : 'Connect to Blockchain'}
          </Button>
          
          {!window.ethereum && (
            <div className="text-center text-sm text-red-500 mt-2">
              MetaMask or another compatible wallet is required to connect to the blockchain.
              <a 
                href="https://metamask.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                Install MetaMask
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainConnection;
