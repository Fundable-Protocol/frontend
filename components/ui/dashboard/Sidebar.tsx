"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, LayoutDashboard, Banknote, FileText } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Stream Tokens",
      icon: <Banknote className="h-5 w-5" />,
      href: "/stream",
      active: pathname.startsWith("/stream"),
    },
    {
      label: "Distribute",
      icon: <Wallet className="w-4 h-4" />,
      href: "/distribute",
      active: pathname.startsWith("/distribute"),
    },
    {
      label: "Create Form",
      icon: <FileText className="h-5 w-5" />,
      href: "/create-form",
      active: pathname.startsWith("/create-form"),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0D0019] text-white">
      <div className="p-6">
        {/* <h2 className="text-sm font-medium text-white/90">
          Navigation
        </h2> */}
        <nav className="mt-4 space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-sm",
                route.active 
                  ? "text-white bg-[#5b21b6]" 
                  : "text-white/60 hover:text-white/80"
              )}
            >
              <span className="text-white/60">{route.icon}</span>
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 