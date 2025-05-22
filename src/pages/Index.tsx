
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle, Package, Users, BarChart3, Trash2 } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryId: '',
    itemType: 'Rice',
    quantity: '',
    shopId: '',
    officerName: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is just a simple demo functionality
    toast({
      title: "Transaction Added",
      description: "Your transaction has been recorded in the blockchain",
    });
    // Reset form
    setFormData({
      beneficiaryName: '',
      beneficiaryId: '',
      itemType: 'Rice',
      quantity: '',
      shopId: '',
      officerName: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600 rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                  Government Ration Distribution
                </h1>
                <p className="text-blue-600 mt-1">
                  Blockchain-Secured Distribution System
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-4 w-4 mr-1" />
                Blockchain Secured
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 text-blue-600 border-blue-200 border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <BarChart3 className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 text-green-600 border-green-200 border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
              <Users className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 text-blue-600 border-blue-200 border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distributions</CardTitle>
              <Package className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0 kg/L</div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 text-red-600 border-red-200 border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Removed Records</CardTitle>
              <Trash2 className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="lg:col-span-1">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  Add New Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div>
                    <Label htmlFor="itemType">Item Type</Label>
                    <select 
                      id="itemType"
                      value={formData.itemType}
                      onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1"
                    >
                      <option value="Rice">Rice</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Sugar">Sugar</option>
                      <option value="Oil">Oil</option>
                      <option value="Dal">Dal</option>
                      <option value="Kerosene">Kerosene</option>
                    </select>
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

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    Add Transaction to Blockchain
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <div className="lg:col-span-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Blockchain Transaction Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Active Transactions (0)
                    </TabsTrigger>
                    <TabsTrigger value="removed" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Audit Trail (0)
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="mt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Beneficiary</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Item</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Quantity</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Shop ID</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              No transactions recorded yet
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="removed" className="mt-6">
                    <div className="text-center py-8 text-gray-500">
                      No removed transactions in the audit trail
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">Blockchain Security Features</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Immutable Records</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Cryptographic Hashing</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Trash2 className="h-4 w-4 text-orange-600" />
                <span>Audit Trail Preserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
