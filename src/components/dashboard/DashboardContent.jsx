import React from "react";

export function DashboardContent({ activeComponent: ActiveComponent }) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
      <div className="h-full p-3 sm:p-4 md:p-6 lg:p-6">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
