import React from "react";
import { cn } from "@/lib/utils";

export function DashboardNavigation({
  features,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const handleFeatureClick = (featureId) => {
    setActiveTab(featureId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
      <div className="space-y-1">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeTab === feature.id;

          return (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                "hover:bg-muted/80 focus:bg-muted/80 focus:outline-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "text-foreground hover:text-foreground",
                // Icon only mode on collapsed sidebar
                !isSidebarOpen && "justify-center md:px-2 lg:px-2"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {/* Text content - shown when sidebar is open */}
              <div
                className={cn(
                  "min-w-0 transition-all duration-200",
                  isSidebarOpen ? "block" : "hidden"
                )}
              >
                <p className="font-medium truncate text-sm md:text-base">
                  {feature.name}
                </p>
                <p className="text-xs opacity-70 truncate hidden sm:block">
                  {feature.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
