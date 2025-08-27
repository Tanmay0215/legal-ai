import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DashboardFooter } from "./DashboardFooter";

export function DashboardLayout({
  isSidebarOpen,
  setIsSidebarOpen,
  features,
  activeTab,
  setActiveTab,
  activeFeature,
  activeComponent,
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        features={features}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Mobile Sidebar Overlay - only on small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Header Bar */}
        <DashboardHeader
          activeFeature={activeFeature}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Feature Content */}
        <DashboardContent activeComponent={activeComponent} />

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
