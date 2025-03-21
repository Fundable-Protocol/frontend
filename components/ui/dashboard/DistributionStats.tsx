import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "@starknet-react/core";
import { Loader2 } from "lucide-react";

interface DistributionStatistics {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  totalAmountByToken?: Record<string, { amount: number, count: number }>;
  averageByToken?: Record<string, number>;
  totalRecipients?: number;
}

export function DistributionStats() {
  const [stats, setStats] = useState<DistributionStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    const fetchStats = async () => {
      if (!address) {
        setLoading(false);
        setStats(null);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/distributions/stats?user_address=${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch distribution statistics');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching distribution stats:', err);
        setError('Failed to load statistics');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [address]);

  // Helper to format token amounts
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString(undefined, { 
      maximumFractionDigits: 2 
    });
  };

  // Get primary token symbol (most used token)
  const getPrimaryToken = (): string => {
    if (!stats?.totalAmountByToken) return "STRK";
    
    let primaryToken = "STRK";
    let maxAmount = 0;
    
    Object.entries(stats.totalAmountByToken).forEach(([token, data]) => {
      if (data.amount > maxAmount) {
        maxAmount = data.amount;
        primaryToken = token;
      }
    });
    
    return primaryToken;
  };

  // Get total distributed amount for primary token
  const getTotalAmount = (): string => {
    if (!stats?.totalAmountByToken) return "0";
    const primaryToken = getPrimaryToken();
    return stats.totalAmountByToken[primaryToken]?.amount 
      ? formatAmount(stats.totalAmountByToken[primaryToken].amount) 
      : "0";
  };

  // Get average amount per distribution for primary token
  const getAverageAmount = (): string => {
    if (!stats?.averageByToken) return "0";
    const primaryToken = getPrimaryToken();
    return stats.averageByToken[primaryToken] 
      ? formatAmount(stats.averageByToken[primaryToken]) 
      : "0";
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#1a1a1a] border-[#5b21b6] border-opacity-20">
            <CardContent className="p-6 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5b21b6]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#1a1a1a] border-[#5b21b6] border-opacity-20">
            <CardContent className="p-6">
              <div className="text-white text-center">{error || "Connect wallet to view stats"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const primaryToken = getPrimaryToken();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-[#1a1a1a] border-[#5b21b6] border-opacity-20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#DADADA]">
            Total Distributions
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-[#B102CD]"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <p className="text-xs text-[#DADADA]">
            {stats.completed} completed, {stats.pending} pending
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#5b21b6] border-opacity-20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#DADADA]">
            Total Amount Distributed
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-[#B102CD]"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{getTotalAmount()} {primaryToken}</div>
          <p className="text-xs text-[#DADADA]">
            {stats.completed} completed distributions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#5b21b6] border-opacity-20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#DADADA]">
            Total Recipients
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-[#B102CD]"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalRecipients || 0}</div>
          <p className="text-xs text-[#DADADA]">
            From {stats.completed} completed distributions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#5b21b6] border-opacity-20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#DADADA]">
            Average Distribution
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-[#B102CD]"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{getAverageAmount()} {primaryToken}</div>
          <p className="text-xs text-[#DADADA]">
            Per distribution
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 