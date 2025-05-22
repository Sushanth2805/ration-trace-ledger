
import React from 'react';
import StatsCard from '@/components/StatsCard';
import { BarChart3, Users, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { SystemStats } from '@/types/blockchain';

interface StatsDisplayProps {
  stats: SystemStats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatsCard
        title="Total Transactions"
        value={stats.totalTransactions}
        icon={BarChart3}
        color="blue"
      />
      <StatsCard
        title="Beneficiaries"
        value={stats.totalBeneficiaries}
        icon={Users}
        color="green"
      />
      <StatsCard
        title="Total Distributions"
        value={`${stats.totalDistributions} kg/L`}
        icon={Package}
        color="blue"
      />
      <StatsCard
        title="Verified Records"
        value={stats.verifiedTransactions}
        icon={CheckCircle}
        color="green"
      />
      <StatsCard
        title="Pending Verification"
        value={stats.totalTransactions - stats.verifiedTransactions}
        icon={AlertCircle}
        color="amber"
      />
    </div>
  );
};

export default StatsDisplay;
