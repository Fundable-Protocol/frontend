"use client";

import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenDistributionWallet from "@/components/ui/distribute/TokenDistributionWallet";
import { StreamsTable } from "@/components/ui/dashboard/StreamsTable";
import { DistributionsTable } from "@/components/ui/dashboard/DistributionsTable";
import { DashboardHeader } from "@/components/ui/dashboard/DashboardHeader";
import { StreamingStats } from "@/components/ui/dashboard/StreamingStats";
import { DistributionStats } from "@/components/ui/dashboard/DistributionStats";

export default function DashboardPage() {
  const { address, status } = useAccount();

  if (status !== "connected" || !address) {
    return <TokenDistributionWallet />;
  }

  return (
    <>
      <DashboardHeader />
      
      <Tabs defaultValue="streams" className="space-y-4">
        <TabsList className="bg-[#1a1a1a]">
          <TabsTrigger value="distributions" className="text-white data-[state=active]:bg-[#5b21b6]">
            Distributions
          </TabsTrigger>
          <TabsTrigger value="streams" className="text-white data-[state=active]:bg-[#5b21b6]">
            Streams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-4">
          <StreamingStats />
          <StreamsTable />
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          <DistributionStats />
          <DistributionsTable />
        </TabsContent>
      </Tabs>
    </>
  );
} 