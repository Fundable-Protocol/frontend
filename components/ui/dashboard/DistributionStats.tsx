import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DistributionStats() {
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
          <div className="text-2xl font-bold text-white">24</div>
          <p className="text-xs text-[#DADADA]">+4 from last month</p>
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
          <div className="text-2xl font-bold text-white">5,678 STRK</div>
          <p className="text-xs text-[#DADADA]">+890 STRK from last month</p>
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
          <div className="text-2xl font-bold text-white">156</div>
          <p className="text-xs text-[#DADADA]">+23 since last month</p>
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
          <div className="text-2xl font-bold text-white">36.4 STRK</div>
          <p className="text-xs text-[#DADADA]">+2.8 STRK per distribution</p>
        </CardContent>
      </Card>
    </div>
  );
} 