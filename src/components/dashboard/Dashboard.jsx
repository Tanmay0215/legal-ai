import React from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useDashboard } from "./useDashboard";

export default function Dashboard() {
  const {
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    features,
    activeFeature,
    activeComponent,
  } = useDashboard();

  return (
    <DashboardLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      features={features}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeFeature={activeFeature}
      activeComponent={activeComponent}
    />
  );
}
