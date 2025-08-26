import React, { useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const activeFeature = features.find((f) => f.id === activeTab);
  const ActiveComponent = activeFeature?.component;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-card border-r transition-all duration-300",
          isSidebarOpen ? "w-80" : "w-16"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Legal AI</h1>
                <p className="text-sm text-muted-foreground">
                  Professional Suite
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                  onClick={() => setActiveTab(feature.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <div className="min-w-0">
                      <p className="font-medium truncate">{feature.name}</p>
                      <p className="text-xs opacity-70 truncate">
                        {feature.description}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <Badge variant="default" className="text-xs">
                Online
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <p className="font-medium">8</p>
                <p className="text-muted-foreground">Features</p>
              </div>
              <div className="text-center">
                <p className="font-medium">24/7</p>
                <p className="text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activeFeature?.name}</h2>
              <p className="text-muted-foreground">
                {activeFeature?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl mx-auto">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 Legal AI Suite. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Help & Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
