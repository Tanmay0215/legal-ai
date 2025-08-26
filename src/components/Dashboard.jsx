import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  MessageSquare,
  Mic,
  Shield,
  GitCompare,
  Calendar,
  Clock,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import all feature components
import { FileUpload } from "./features/FileUpload";
import Chat from "./Chat";
import { VoiceInteraction } from "./features/VoiceInteraction";
import { DocumentOriginality } from "./features/DocumentOriginality";
import { DocumentComparison } from "./features/DocumentComparison";
import { DeadlineTracker } from "./features/DeadlineTracker";
import { TimelineView } from "./features/TimelineView";
import { RiskScoring } from "./features/RiskScoring";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile

  const features = [
    {
      id: "chat",
      name: "AI Chat",
      icon: MessageSquare,
      description: "Interactive legal AI assistant",
      component: Chat,
    },
    {
      id: "upload",
      name: "File Upload",
      icon: Upload,
      description: "Upload legal documents",
      component: FileUpload,
    },
    {
      id: "voice",
      name: "Voice Interaction",
      icon: Mic,
      description: "Voice commands and speech",
      component: VoiceInteraction,
    },
    {
      id: "originality",
      name: "Document Verification",
      icon: Shield,
      description: "Check document originality",
      component: DocumentOriginality,
    },
    {
      id: "comparison",
      name: "Document Comparison",
      icon: GitCompare,
      description: "Compare legal documents",
      component: DocumentComparison,
    },
    {
      id: "deadlines",
      name: "Deadline Tracker",
      icon: Calendar,
      description: "Track important deadlines",
      component: DeadlineTracker,
    },
    {
      id: "timeline",
      name: "Timeline View",
      icon: Clock,
      description: "Document process timeline",
      component: TimelineView,
    },
    {
      id: "risk",
      name: "Risk Scoring",
      icon: BarChart3,
      description: "Analyze document risks",
      component: RiskScoring,
    },
  ];

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Open on md screens and up
      } else {
        setIsSidebarOpen(false); // Close on sm screens and below
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeFeature = features.find((f) => f.id === activeTab);
  const ActiveComponent = activeFeature?.component;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
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
              className="md:flex lg:hidden"
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
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeTab === feature.id;

              return (
                <button
                  key={feature.id}
                  onClick={() => {
                    setActiveTab(feature.id);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    "hover:bg-muted focus:bg-muted",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
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

        {/* Status Footer - responsive visibility */}
        <div
          className={cn(
            "p-4 border-t space-y-3 transition-all duration-200",
            isSidebarOpen ? "block" : "hidden lg:hidden"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium hidden sm:inline">
              System Status
            </span>
            <span className="text-xs font-medium sm:hidden">Status</span>
            <Badge variant="default" className="text-xs">
              Online
            </Badge>
          </div>
          {/* Stats grid - hidden on small screens */}
          <div className="grid grid-cols-2 gap-2 text-xs hidden sm:grid">
            <div className="text-center">
              <p className="font-medium">8</p>
              <p className="text-muted-foreground">Features</p>
            </div>
            <div className="text-center">
              <p className="font-medium">24/7</p>
              <p className="text-muted-foreground">Support</p>
            </div>
          </div>
          {/* Compact stats for small screens */}
          <div className="text-center text-xs sm:hidden">
            <span className="font-medium">8 Features • 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Sidebar Overlay - only on small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Header Bar */}
        <div className="border-b p-3 md:p-4 lg:p-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold truncate">
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
              className="flex md:flex lg:hidden xl:hidden ml-2 flex-shrink-0"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Feature Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-3 sm:p-4 md:p-6 lg:p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Footer - responsive layout and visibility */}
        <div className="border-t p-3 sm:p-4 md:p-4 bg-muted/30 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <p className="text-center sm:text-left order-2 sm:order-1">
              © 2024 Legal AI Suite. All rights reserved.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm order-1 sm:order-2">
              <span className="hover:text-foreground cursor-pointer transition-colors">
                <span className="hidden sm:inline">Privacy Policy</span>
                <span className="sm:hidden">Privacy</span>
              </span>
              <span className="hover:text-foreground cursor-pointer transition-colors">
                <span className="hidden sm:inline">Terms of Service</span>
                <span className="sm:hidden">Terms</span>
              </span>
              <span className="hover:text-foreground cursor-pointer transition-colors">
                <span className="hidden sm:inline">Help & Support</span>
                <span className="sm:hidden">Help</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
