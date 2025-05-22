
import React from 'react';
import StatsCard from '@/components/StatsCard';
import { BarChart3, Users, Package, Trash2, CheckCircle } from 'lucide-react';
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
        title="Removed Records"
        value={stats.removedTransactions}
        icon={Trash2}
        color="red"
      />
      <StatsCard
        title="Active Records"
        value={stats.totalTransactions - stats.removedTransactions}
        icon={CheckCircle}
        color="green"
      />
    </div>
  );
};

export default StatsDisplay;
