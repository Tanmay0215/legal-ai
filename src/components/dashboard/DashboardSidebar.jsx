import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardNavigation } from "./DashboardNavigation";

export function DashboardSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  features,
  activeTab,
  setActiveTab,
}) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r transition-all duration-300 h-full",
        // Mobile: absolute overlay, hidden when closed
        "absolute z-50 md:relative md:z-auto",
        // Width management across breakpoints
        isSidebarOpen
          ? "w-80 max-w-80 sm:w-80 md:w-80 lg:w-80"
          : "w-0 md:w-16 lg:w-16",
        // Overflow handling
        !isSidebarOpen && "overflow-hidden md:overflow-visible"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {/* Logo and title - hidden on mobile when sidebar closed, always visible on md+ */}
          <div
            className={cn(
              "transition-opacity duration-200",
              isSidebarOpen ? "block" : "hidden md:block"
            )}
          >
            <h1 className="text-lg md:text-xl lg:text-xl font-bold">
              {isSidebarOpen ? "Legal AI" : "LA"}
            </h1>
            {isSidebarOpen && (
              <p className="text-xs md:text-sm text-muted-foreground">
                Professional Suite
              </p>
            )}
          </div>
          {/* Toggle button - always visible on mobile, hidden on lg+ when sidebar is open */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:flex lg:hidden hover:bg-muted/80"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <DashboardNavigation
        features={features}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
}
