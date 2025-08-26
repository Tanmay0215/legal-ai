import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  FileSearch,
  Globe,
  Clock,
  TrendingUp,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DocumentOriginality({ document }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeDocument = async () => {
    setIsAnalyzing(true);

    // Simulate analysis process
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Mock analysis results
    setAnalysis({
      overallScore: 85,
      originalityPercentage: 92,
      sources: [
        {
          type: "Academic Database",
          matches: 3,
          similarity: 15,
          source: "Legal Research Database",
        },
        {
          type: "Web Content",
          matches: 2,
          similarity: 8,
          source: "Legal Blog Articles",
        },
        {
          type: "Legal Documents",
          matches: 1,
          similarity: 5,
          source: "Court Filing Repository",
        },
      ],
      riskLevel: "low",
      recommendations: [
        "Consider citing the academic sources found",
        "Review similarity in introduction section",
        "Add more unique analysis to strengthen originality",
      ],
      metadata: {
        totalWords: 2450,
        uniquePhrases: 1890,
        analyzedSources: 50000,
        processingTime: "2.3 seconds",
      },
    });

    setIsAnalyzing(false);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Document Originality Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!analysis ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <FileSearch className="h-8 w-8 text-muted-foreground" />
            </div>

            <div>
              <p className="font-medium mb-2">
                Ready to verify document originality
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a document to check for plagiarism and verify originality
                against our database
              </p>

              <Button
                onClick={analyzeDocument}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <FileSearch className="h-4 w-4 mr-2" />
                    Start Originality Check
                  </>
                )}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={75} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Scanning against 50,000+ legal documents...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto relative">
                <svg
                  className="w-20 h-20 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-muted stroke-current"
                    strokeWidth="2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary stroke-current"
                    strokeWidth="2"
                    strokeDasharray={`${analysis.originalityPercentage}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {analysis.originalityPercentage}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Originality Score</p>
                <div className="flex items-center justify-center gap-2">
                  {getRiskIcon(analysis.riskLevel)}
                  <Badge
                    variant={
                      analysis.riskLevel === "low" ? "default" : "destructive"
                    }
                  >
                    {analysis.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Source Analysis */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Source Analysis
              </h3>

              {analysis.sources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{source.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {source.source}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {source.similarity}% similarity
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {source.matches} matches
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">Document Stats</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>
                    Total Words: {analysis.metadata.totalWords.toLocaleString()}
                  </p>
                  <p>
                    Unique Phrases:{" "}
                    {analysis.metadata.uniquePhrases.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Analysis Info</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>
                    Sources Checked:{" "}
                    {analysis.metadata.analyzedSources.toLocaleString()}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {analysis.metadata.processingTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAnalysis(null)}
                className="flex-1"
              >
                New Analysis
              </Button>
              <Button className="flex-1">Download Report</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
