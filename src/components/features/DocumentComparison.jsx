import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  GitCompare,
  Plus,
  Minus,
  Equal,
  AlertCircle,
  CheckCircle,
  ArrowLeftRight,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DocumentComparison() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Contract_v1.pdf", selected: false },
    { id: 2, name: "Contract_v2.pdf", selected: false },
    { id: 3, name: "Legal_Agreement.pdf", selected: false },
  ]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const selectedDocs = documents.filter((doc) => doc.selected);

  const toggleDocumentSelection = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  const compareDocuments = async () => {
    if (selectedDocs.length < 2) return;

    setIsComparing(true);

    // Simulate comparison process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock comparison results
    setComparisonResult({
      similarity: 78,
      differences: [
        {
          type: "addition",
          section: "Section 3.2",
          content: "Additional clause about intellectual property rights",
          docName: selectedDocs[1].name,
        },
        {
          type: "deletion",
          section: "Section 2.1",
          content: "Original warranty clause removed",
          docName: selectedDocs[0].name,
        },
        {
          type: "modification",
          section: "Section 5.1",
          content: "Payment terms changed from 30 to 45 days",
          before: "Payment due within 30 days",
          after: "Payment due within 45 days",
        },
      ],
      keyChanges: [
        {
          category: "Legal Terms",
          changes: 3,
          impact: "medium",
        },
        {
          category: "Financial Terms",
          changes: 2,
          impact: "high",
        },
        {
          category: "Compliance",
          changes: 1,
          impact: "low",
        },
      ],
      recommendations: [
        "Review the intellectual property clause in section 3.2",
        "Consider the impact of extended payment terms",
        "Verify compliance requirements are still met",
      ],
    });

    setIsComparing(false);
  };

  const getDifferenceIcon = (type) => {
    switch (type) {
      case "addition":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "deletion":
        return <Minus className="h-4 w-4 text-red-600" />;
      case "modification":
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
      default:
        return <Equal className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Document Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!comparisonResult ? (
          <>
            {/* Document Selection */}
            <div className="space-y-4">
              <h3 className="font-medium">Select Documents to Compare</h3>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                      doc.selected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleDocumentSelection(doc.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <div
                      className={cn(
                        "w-4 h-4 border-2 rounded",
                        doc.selected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {doc.selected && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedDocs.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedDocs.map((doc) => doc.name).join(", ")}
                </div>
              )}
            </div>

            {/* Comparison Options */}
            <div className="space-y-3">
              <h3 className="font-medium">Comparison Type</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visual Diff
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Text Analysis
                </Button>
              </div>
            </div>

            {/* Start Comparison */}
            <Button
              onClick={compareDocuments}
              disabled={selectedDocs.length < 2 || isComparing}
              className="w-full"
            >
              {isComparing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Comparing Documents...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare Selected Documents ({selectedDocs.length})
                </>
              )}
            </Button>

            {selectedDocs.length < 2 && (
              <p className="text-sm text-muted-foreground text-center">
                Select at least 2 documents to start comparison
              </p>
            )}
          </>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="differences">Differences</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Similarity Score */}
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {comparisonResult.similarity}%
                </div>
                <p className="text-muted-foreground">Similarity Score</p>
                <Badge
                  variant={
                    comparisonResult.similarity > 80 ? "default" : "secondary"
                  }
                >
                  {comparisonResult.similarity > 80
                    ? "High Similarity"
                    : "Moderate Similarity"}
                </Badge>
              </div>

              <Separator />

              {/* Key Changes Summary */}
              <div className="space-y-3">
                <h3 className="font-medium">Key Changes Summary</h3>
                {comparisonResult.keyChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{change.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {change.changes} changes detected
                      </p>
                    </div>
                    <Badge variant={getImpactColor(change.impact)}>
                      {change.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="differences" className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Detected Differences</h3>
                {comparisonResult.differences.map((diff, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {getDifferenceIcon(diff.type)}
                      <span className="font-medium capitalize">
                        {diff.type}
                      </span>
                      <Badge variant="outline">{diff.section}</Badge>
                    </div>

                    <p className="text-sm">{diff.content}</p>

                    {diff.before && diff.after && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-red-600">
                            Before:
                          </p>
                          <p className="text-xs bg-red-50 p-2 rounded">
                            {diff.before}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-green-600">
                            After:
                          </p>
                          <p className="text-xs bg-green-50 p-2 rounded">
                            {diff.after}
                          </p>
                        </div>
                      </div>
                    )}

                    {diff.docName && (
                      <p className="text-xs text-muted-foreground">
                        Source: {diff.docName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {comparisonResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setComparisonResult(null)}
                  className="flex-1"
                >
                  New Comparison
                </Button>
                <Button className="flex-1">Export Report</Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
