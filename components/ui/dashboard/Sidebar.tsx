"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, LayoutDashboard, /*Banknote, FileText */} from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    // {
    //   label: "Stream Tokens",
    //   icon: <Banknote className="h-5 w-5" />,
    //   href: "/stream",
    //   active: pathname.startsWith("/stream"),
    // },
    {
      label: "Distribute",
      icon: <Wallet className="w-4 h-4" />,
      href: "/distribute",
      active: pathname.startsWith("/distribute"),
    },
    // {
    //   label: "Create Form",
    //   icon: <FileText className="h-5 w-5" />,
    //   href: "/create-form",
    //   active: pathname.startsWith("/create-form"),
    // },
  ];

  // Navigation links renderer - used for both mobile and desktop
  const renderNavLinks = () => (
    <nav className="mt-4 space-y-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu when clicking a link
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
  );

  return (
    <>
      {/* Mobile Menu Button - Visible on mobile screens */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-white bg-[#5b21b6]/50 backdrop-blur-sm"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 w-64 md:hidden`}
      >
        <div className="flex flex-col h-full bg-[#0D0019] text-white">
          <div className="p-6 pt-16"> {/* Add top padding to account for mobile menu button */}
            {renderNavLinks()}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - This is the original sidebar */}
      <div className="flex flex-col h-full bg-[#0D0019] text-white">
        <div className="p-6">
          {renderNavLinks()}
        </div>
      </div>
    </>
  );
} 