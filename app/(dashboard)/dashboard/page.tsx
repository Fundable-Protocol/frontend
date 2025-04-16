"use client";

import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenDistributionWallet from "@/components/ui/distribute/TokenDistributionWallet";
// import { StreamsTable } from "@/components/ui/dashboard/StreamsTable";
import { DistributionsTable } from "@/components/ui/dashboard/DistributionsTable";
import { DashboardHeader } from "@/components/ui/dashboard/DashboardHeader";
// import { StreamingStats } from "@/components/ui/dashboard/StreamingStats";
import { DistributionStats } from "@/components/ui/dashboard/DistributionStats";

export default function DashboardPage() {
  const { address, status } = useAccount();

  if (status !== "connected" || !address) {
    return <TokenDistributionWallet />;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-full overflow-x-hidden">
      <DashboardHeader />
      
      <Tabs defaultValue="distributions" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="bg-[#1a1a1a] w-full sm:w-auto">
            <TabsTrigger 
              value="distributions" 
              className="text-white data-[state=active]:bg-[#5b21b6] text-sm sm:text-base flex-1 sm:flex-none"
            >
              Distributions
            </TabsTrigger>
            {/* <TabsTrigger value="streams" className="text-white data-[state=active]:bg-[#5b21b6] text-sm sm:text-base flex-1 sm:flex-none">
              Streams
            </TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="distributions" className="space-y-4">
          <div className="overflow-x-auto">
            <DistributionStats />
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full sm:min-w-0 px-4 sm:px-0">
              <DistributionsTable />
            </div>
          </div>
        </TabsContent>

        {/* <TabsContent value="streams" className="space-y-4">
          <div className="overflow-x-auto">
            <StreamingStats />
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full sm:min-w-0 px-4 sm:px-0">
              <StreamsTable />
            </div>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
} 