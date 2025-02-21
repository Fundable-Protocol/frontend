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

interface StreamData {
  id: string;
  recipient: string;
  amount: string;
  token: string;
  startTime: number;
  endTime: number;
  status: 'active' | 'completed' | 'cancelled';
}

export function StreamsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data fetching
  const streams: StreamData[] = [
    {
      id: "1",
      recipient: "0x1234...5678",
      amount: "1000",
      token: "STRK",
      startTime: Date.now() - 86400000, // 1 day ago
      endTime: Date.now() + 86400000 * 30, // 30 days from now
      status: 'active',
    },
    // Add more mock data as needed
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search streams..."
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
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
              Active
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#5b21b6] cursor-pointer">
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-[#5b21b6] border-opacity-20">
        <Table>
          <TableHeader className="bg-[#1a1a1a]">
            <TableRow>
              <TableHead className="text-[#DADADA]">Recipient</TableHead>
              <TableHead className="text-[#DADADA]">Amount</TableHead>
              <TableHead className="text-[#DADADA]">Start Time</TableHead>
              <TableHead className="text-[#DADADA]">End Time</TableHead>
              <TableHead className="text-[#DADADA]">Status</TableHead>
              <TableHead className="text-[#DADADA]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {streams.map((stream) => (
              <TableRow key={stream.id} className="border-[#5b21b6] border-opacity-20">
                <TableCell className="text-white">{stream.recipient}</TableCell>
                <TableCell className="text-white">
                  {stream.amount} {stream.token}
                </TableCell>
                <TableCell className="text-white">
                  {formatDistanceToNow(stream.startTime, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-white">
                  {formatDistanceToNow(stream.endTime, { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(stream.status)} mr-2`} />
                    <span className="text-white capitalize">{stream.status}</span>
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
                        Cancel Stream
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