import React from "react";

export function DashboardFooter() {
  return (
    <div className="border-t p-3 sm:p-4 md:p-4 bg-muted/30 backdrop-blur-sm flex-shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
        <p className="text-center sm:text-left order-2 sm:order-1">
          © 2024 Legal AI Suite. All rights reserved.
        </p>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm order-1 sm:order-2">
          <span className="hover:text-foreground cursor-pointer transition-colors hover:underline">
            <span className="hidden sm:inline">Privacy Policy</span>
            <span className="sm:hidden">Privacy</span>
          </span>
          <span className="hover:text-foreground cursor-pointer transition-colors hover:underline">
            <span className="hidden sm:inline">Terms of Service</span>
            <span className="sm:hidden">Terms</span>
          </span>
          <span className="hover:text-foreground cursor-pointer transition-colors hover:underline">
            <span className="hidden sm:inline">Help & Support</span>
            <span className="sm:hidden">Help</span>
          </span>
        </div>
      </div>
    </div>
  );
}
