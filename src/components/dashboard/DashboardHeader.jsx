import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function DashboardHeader({
  activeFeature,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <div className="border-b p-3 md:p-4 lg:p-4 flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold truncate text-foreground">
            {activeFeature?.name}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base truncate hidden sm:block">
            {activeFeature?.description}
          </p>
        </div>
        {/* Mobile menu button - visible on small and medium screens */}
        <Button
          variant="ghost"
          size="sm"
          className="flex md:flex lg:hidden xl:hidden ml-2 flex-shrink-0 hover:bg-muted/80"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
