import { Skeleton } from "@/components/ui/skeleton";

export default function DistributeSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[rgb(91,33,182)] via-[#0d0019] to-[#0d0019]  px-4 py-16 flex flex-col gap-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4 rounded-sm bg-[#2e2d40]" />
        <Skeleton className="h-4 w-1/4 rounded-sm bg-[#2e2d40]" />
        <Skeleton className="h-4 w-1/4 rounded-sm bg-[#2e2d40]" />
      </div>

      <div className="space-y-8 mt-10">
        <Skeleton className="h-32  rounded-xl bg-[#2e2d40]" />
        <Skeleton className="h-32  rounded-xl bg-[#2e2d40]" />
      </div>

      <Skeleton className="h-8  rounded-xl bg-[#2e2d40]" />
      <Skeleton className="h-20  rounded-md bg-[#2e2d40] mt-14" />

      <Skeleton className="h-8 w-32 rounded-md bg-[#2e2d40]" />
    </div>
  );
}
