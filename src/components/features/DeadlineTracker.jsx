import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  AlertTriangle,
  Plus,
  Bell,
  CheckCircle,
  Calendar as CalendarIcon,
  FileText,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DeadlineTracker() {
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      title: "Patent Application Filing",
      description: "Submit final patent application for new technology",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: "high",
      category: "Patent Law",
      assignee: "Sarah Johnson",
      location: "USPTO Office",
      status: "pending",
      documents: ["Patent_Draft_v3.pdf", "Technical_Drawings.pdf"],
    },
    {
      id: 2,
      title: "Contract Review Deadline",
      description: "Complete review of vendor agreement",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      priority: "medium",
      category: "Contract Law",
      assignee: "Mike Chen",
      location: "Client Office",
      status: "in-progress",
      documents: ["Vendor_Contract_v2.pdf"],
    },
    {
      id: 3,
      title: "Court Filing Response",
      description: "Submit response to motion for summary judgment",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      priority: "high",
      category: "Litigation",
      assignee: "Emily Rodriguez",
      location: "District Court",
      status: "pending",
      documents: ["Motion_Response.pdf", "Evidence_Package.pdf"],
    },
    {
      id: 4,
      title: "Compliance Audit Report",
      description: "Submit annual compliance audit to regulatory body",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
      priority: "high",
      category: "Compliance",
      assignee: "David Kim",
      location: "Regulatory Office",
      status: "overdue",
      documents: ["Audit_Report_2024.pdf"],
    },
  ]);

  const [filter, setFilter] = useState("all");

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return `${hours} hours remaining`;
    if (days === 1) return "Due tomorrow";
    return `${days} days remaining`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "overdue":
        return "text-red-600";
      case "pending":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Calendar className="h-4 w-4 text-gray-600" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const isUrgent = (dueDate) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days <= 3 && days >= 0;
  };

  const filteredDeadlines = deadlines.filter((deadline) => {
    if (filter === "all") return true;
    if (filter === "urgent")
      return isUrgent(deadline.dueDate) || deadline.status === "overdue";
    if (filter === "overdue") return deadline.status === "overdue";
    if (filter === "completed") return deadline.status === "completed";
    return true;
  });

  const markAsCompleted = (id) => {
    setDeadlines((prev) =>
      prev.map((deadline) =>
        deadline.id === id ? { ...deadline, status: "completed" } : deadline
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Deadline Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters and Stats */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All", count: deadlines.length },
              {
                key: "urgent",
                label: "Urgent",
                count: deadlines.filter(
                  (d) => isUrgent(d.dueDate) || d.status === "overdue"
                ).length,
              },
              {
                key: "overdue",
                label: "Overdue",
                count: deadlines.filter((d) => d.status === "overdue").length,
              },
              {
                key: "completed",
                label: "Completed",
                count: deadlines.filter((d) => d.status === "completed").length,
              },
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key)}
              >
                {filterOption.label} ({filterOption.count})
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-red-600">
                {deadlines.filter((d) => d.status === "overdue").length}
              </p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-yellow-600">
                {deadlines.filter((d) => isUrgent(d.dueDate)).length}
              </p>
              <p className="text-sm text-muted-foreground">Due Soon</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {deadlines.filter((d) => d.status === "completed").length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Deadline List */}
        <div className="space-y-3">
          {filteredDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={cn(
                "border rounded-lg p-4 space-y-3 transition-colors",
                deadline.status === "overdue" && "border-red-200 bg-red-50/50",
                isUrgent(deadline.dueDate) &&
                  deadline.status !== "overdue" &&
                  "border-yellow-200 bg-yellow-50/50"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{deadline.title}</h3>
                    <Badge variant={getPriorityColor(deadline.priority)}>
                      {deadline.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {deadline.description}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(deadline.status)}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getStatusColor(deadline.status)
                    )}
                  >
                    {deadline.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{deadline.dueDate.toLocaleDateString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {getTimeRemaining(deadline.dueDate)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{deadline.assignee}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{deadline.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{deadline.location}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {deadline.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Related Documents:</p>
                  <div className="flex flex-wrap gap-1">
                    {deadline.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {deadline.status !== "completed" && (
                  <Button
                    size="sm"
                    onClick={() => markAsCompleted(deadline.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-1" />
                  Set Reminder
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {filteredDeadlines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No deadlines found for the selected filter.
            </div>
          )}
        </div>

        {/* Add New Deadline */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Deadline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deadline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Deadline creation form would go here...
              </p>
              <Button className="w-full">Create Deadline</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
