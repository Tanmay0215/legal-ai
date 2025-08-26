import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TimelineView() {
  const [timelineData] = useState([
    {
      id: 1,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: "document",
      title: "Contract Amendment Filed",
      description: "Updated vendor agreement with new payment terms",
      actor: "Sarah Johnson",
      status: "completed",
      documents: ["Amendment_v1.pdf"],
      category: "Contract Law",
    },
    {
      id: 2,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: "milestone",
      title: "Client Review Meeting",
      description: "Discussed case strategy and next steps with client",
      actor: "Mike Chen",
      status: "completed",
      location: "Client Office",
      category: "Litigation",
    },
    {
      id: 3,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: "deadline",
      title: "Patent Application Submitted",
      description: "Final patent application submitted to USPTO",
      actor: "Emily Rodriguez",
      status: "completed",
      documents: ["Patent_App_Final.pdf", "Claims.pdf"],
      category: "Patent Law",
    },
    {
      id: 4,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: "document",
      title: "Discovery Documents Received",
      description: "Received documents from opposing counsel",
      actor: "David Kim",
      status: "completed",
      documents: ["Discovery_Package.pdf"],
      category: "Litigation",
    },
    {
      id: 5,
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      type: "deadline",
      title: "Response Brief Due",
      description: "Submit response to motion for summary judgment",
      actor: "Sarah Johnson",
      status: "pending",
      documents: ["Draft_Response.pdf"],
      category: "Litigation",
    },
    {
      id: 6,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      type: "milestone",
      title: "Court Hearing Scheduled",
      description: "Oral arguments for preliminary injunction",
      actor: "Mike Chen",
      status: "pending",
      location: "District Court Room 3",
      category: "Litigation",
    },
    {
      id: 7,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      type: "deadline",
      title: "Compliance Report Due",
      description: "Submit quarterly compliance report",
      actor: "Emily Rodriguez",
      status: "pending",
      category: "Compliance",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("chronological");

  const getTypeIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "deadline":
        return <Clock className="h-5 w-5 text-red-600" />;
      case "milestone":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString();
  };

  const getTimelinePosition = (index, total) => {
    return index === 0 ? "first" : index === total - 1 ? "last" : "middle";
  };

  const filteredData = timelineData.filter((item) => {
    if (filter === "all") return true;
    if (filter === "upcoming")
      return item.status === "pending" && item.date > new Date();
    if (filter === "completed") return item.status === "completed";
    if (filter === "documents") return item.type === "document";
    if (filter === "deadlines") return item.type === "deadline";
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (viewMode === "chronological") {
      return b.date.getTime() - a.date.getTime(); // Most recent first
    }
    return a.date.getTime() - b.date.getTime(); // Oldest first
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline View
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Events" },
              { key: "upcoming", label: "Upcoming" },
              { key: "completed", label: "Completed" },
              { key: "documents", label: "Documents" },
              { key: "deadlines", label: "Deadlines" },
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key)}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "chronological" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("chronological")}
            >
              Recent First
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              Timeline Order
            </Button>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {sortedData.map((item, index) => (
              <div key={item.id} className="relative flex gap-4">
                {/* Timeline Node */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-background border-2 border-border rounded-full flex items-center justify-center z-10 relative">
                    {getTypeIcon(item.type)}
                  </div>
                  {/* Date Badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge
                      variant="outline"
                      className="text-xs whitespace-nowrap"
                    >
                      {formatDate(item.date)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-8">
                  <div className="border rounded-lg p-4 bg-card space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className="text-xs font-medium capitalize">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{item.actor}</span>
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{item.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {item.date.toLocaleDateString()} at{" "}
                          {item.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Documents */}
                    {item.documents && item.documents.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Related Documents:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.documents.map((doc, docIndex) => (
                            <Badge
                              key={docIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {item.status === "pending" && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {item.type === "deadline" && (
                          <Button size="sm">Mark Complete</Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No events found for the selected filter.
            </div>
          )}
        </div>

        {/* Add Event */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline" className="flex-1">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
