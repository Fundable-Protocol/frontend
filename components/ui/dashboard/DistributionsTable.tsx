import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getExplorerUrl } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { useAccount } from "@starknet-react/core";
import { Loader2, ExternalLink } from "lucide-react";

interface DistributionData {
  id: string;
  user_address: string;
  transaction_hash?: string | null;
  token_address: string;
  token_symbol: string;
  token_decimals: number;
  total_amount: string;
  fee_amount: string;
  total_recipients: number;
  distribution_type: 'EQUAL' | 'WEIGHTED';
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  block_number?: bigint | null;
  block_timestamp?: Date | null;
  network: 'MAINNET' | 'TESTNET';
  created_at: Date;
  metadata?: Record<string, any> | null;
}

interface DistributionResponse {
  distributions: DistributionData[];
  total: number;
}

export function DistributionsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [distributions, setDistributions] = useState<DistributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EQUAL' | 'WEIGHTED'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'FAILED' | 'PENDING'>('ALL');
  
  // Get the connected wallet address
  const { address } = useAccount();

  // Fetch distributions when wallet address changes
  useEffect(() => {
    const fetchDistributions = async () => {
      if (!address) {
        setLoading(false);
        setDistributions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/distributions?user_address=${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch distributions');
        }
        
        const data: DistributionResponse = await response.json();
        setDistributions(data.distributions);
        console.log("Distributions:", data.distributions);
        setError(null);
      } catch (err) {
        console.error('Error fetching distributions:', err);
        setError('Failed to load distributions. Please try again later.');
        setDistributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributions();
  }, [address]);

  // Filter distributions based on search query and filters
  const filteredDistributions = distributions.filter(dist => {
    const matchesSearch = 
      dist.token_symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.user_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dist.transaction_hash && dist.transaction_hash.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTypeFilter = typeFilter === 'ALL' || dist.distribution_type === typeFilter;
    const matchesStatusFilter = statusFilter === 'ALL' || dist.status === statusFilter;
    
    return matchesSearch && matchesTypeFilter && matchesStatusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'PENDING':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search distributions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-[#1a1a1a] text-white border-[#5b21b6] border-opacity-40"
        />
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#1a1a1a] text-white border-[#5b21b6] border-opacity-40">
                Type: {typeFilter === 'ALL' ? 'All' : typeFilter.toLowerCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a1a] text-white border-[#5b21b6]">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setTypeFilter('ALL')}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setTypeFilter('EQUAL')}
              >
                Equal
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setTypeFilter('WEIGHTED')}
              >
                Weighted
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#1a1a1a] text-white border-[#5b21b6] border-opacity-40">
                Status: {statusFilter === 'ALL' ? 'All' : statusFilter.toLowerCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a1a] text-white border-[#5b21b6]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setStatusFilter('ALL')}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setStatusFilter('COMPLETED')}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setStatusFilter('PENDING')}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-[#5b21b6] cursor-pointer"
                onClick={() => setStatusFilter('FAILED')}
              >
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#5b21b6]" />
          <p className="ml-2 text-white">Loading distributions...</p>
        </div>
      ) : error ? (
        <div className="w-full text-center py-10 text-red-400">{error}</div>
      ) : filteredDistributions.length === 0 ? (
        <div className="w-full text-center py-10 text-white">
          {address 
            ? "No distributions found. Create your first distribution to see it here." 
            : "Connect your wallet to view your distributions."}
        </div>
      ) : (
        <div className="rounded-md border border-[#5b21b6] border-opacity-20">
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow>
                <TableHead className="text-[#DADADA]">Recipients</TableHead>
                <TableHead className="text-[#DADADA]">Amount</TableHead>
                <TableHead className="text-[#DADADA]">Type</TableHead>
                <TableHead className="text-[#DADADA]">Time</TableHead>
                <TableHead className="text-[#DADADA]">Status</TableHead>
                <TableHead className="text-[#DADADA]">Network</TableHead>
                <TableHead className="text-[#DADADA]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDistributions.map((distribution) => (
                <TableRow key={distribution.id} className="border-[#5b21b6] border-opacity-20">
                  <TableCell className="text-white">
                    {distribution.total_recipients} addresses
                  </TableCell>
                  <TableCell className="text-white">
                    {distribution.total_amount} {distribution.token_symbol}
                  </TableCell>
                  <TableCell className="text-white capitalize">
                    {distribution.distribution_type.toLowerCase()}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatDistanceToNow(new Date(distribution.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(distribution.status)} mr-2`} />
                      <span className="text-white capitalize">{distribution.status.toLowerCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white capitalize">
                    {distribution.network.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-[#5b21b6]">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] text-white border-[#5b21b6]">
                        <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
                          Export CSV
                        </DropdownMenuItem>
                        {distribution.transaction_hash && (
                          <DropdownMenuItem 
                            className="hover:bg-[#5b21b6] cursor-pointer"
                            onClick={() => {
                              const url = getExplorerUrl(distribution.network, distribution.transaction_hash!);
                              window.open(url, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Transaction
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 