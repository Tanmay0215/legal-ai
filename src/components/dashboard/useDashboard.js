import { useState, useEffect } from "react";
import {
  Upload,
  MessageSquare,
  Mic,
  Shield,
  GitCompare,
  Calendar,
  Clock,
  BarChart3,
} from "lucide-react";

// Import all feature components
import { FileUpload } from "../features/FileUpload";
import Chat from "../Chat";
import { VoiceInteraction } from "../features/VoiceInteraction";
import { DocumentOriginality } from "../features/DocumentOriginality";
import { DocumentComparison } from "../features/DocumentComparison";
import { DeadlineTracker } from "../features/DeadlineTracker";
import { TimelineView } from "../features/TimelineView";
import { RiskScoring } from "../features/RiskScoring";

export function useDashboard() {
  const [activeTab, setActiveTab] = useState("upload"); // Start with upload tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
  const [hasUploadedDocument, setHasUploadedDocument] = useState(false);
  const [uploadedDocumentInfo, setUploadedDocumentInfo] = useState(null);

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
  const activeComponent = activeFeature?.component;

  // Handle successful document upload
  const handleDocumentUpload = (file, result) => {
    if (result.success) {
      setHasUploadedDocument(true);
      setUploadedDocumentInfo({
        fileName: file.name,
        documentType: result.document_type,
        confidence: result.confidence,
        uploadTime: new Date().toISOString(),
      });
      // Automatically switch to chat tab after successful upload
      setActiveTab("chat");
    }
  };

  return {
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    features,
    activeFeature,
    activeComponent,
    hasUploadedDocument,
    uploadedDocumentInfo,
    handleDocumentUpload,
  };
}
