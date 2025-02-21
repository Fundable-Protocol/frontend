import { useState } from "react";
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
import { formatDistanceToNow } from "date-fns";

interface DistributionData {
  id: string;
  recipients: string[];
  amount: string;
  token: string;
  timestamp: number;
  type: 'equal' | 'weighted';
  status: 'completed' | 'failed';
}

export function DistributionsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data fetching
  const distributions: DistributionData[] = [
    {
      id: "1",
      recipients: ["0x1234...5678", "0x8765...4321"],
      amount: "2000",
      token: "STRK",
      timestamp: Date.now() - 86400000, // 1 day ago
      type: 'equal',
      status: 'completed',
    },
    // Add more mock data as needed
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-[#1a1a1a] text-white border-[#5b21b6] border-opacity-40">
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1a1a1a] text-white border-[#5b21b6]">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
              Equal
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
              Weighted
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-[#5b21b6] border-opacity-20">
        <Table>
          <TableHeader className="bg-[#1a1a1a]">
            <TableRow>
              <TableHead className="text-[#DADADA]">Recipients</TableHead>
              <TableHead className="text-[#DADADA]">Amount</TableHead>
              <TableHead className="text-[#DADADA]">Type</TableHead>
              <TableHead className="text-[#DADADA]">Time</TableHead>
              <TableHead className="text-[#DADADA]">Status</TableHead>
              <TableHead className="text-[#DADADA]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributions.map((distribution) => (
              <TableRow key={distribution.id} className="border-[#5b21b6] border-opacity-20">
                <TableCell className="text-white">
                  {distribution.recipients.length} addresses
                </TableCell>
                <TableCell className="text-white">
                  {distribution.amount} {distribution.token}
                </TableCell>
                <TableCell className="text-white capitalize">
                  {distribution.type}
                </TableCell>
                <TableCell className="text-white">
                  {formatDistanceToNow(distribution.timestamp, { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(distribution.status)} mr-2`} />
                    <span className="text-white capitalize">{distribution.status}</span>
                  </div>
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 