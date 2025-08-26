import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Calculator,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RiskScoring({ document }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  const analyzeRisk = async () => {
    setIsAnalyzing(true);

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock risk analysis results
    setRiskAnalysis({
      overallScore: 6.7,
      riskLevel: "medium",
      confidence: 85,
      categories: [
        {
          name: "Legal Compliance",
          score: 7.2,
          level: "medium",
          factors: [
            { name: "Regulatory Adherence", score: 8.0, status: "good" },
            {
              name: "Documentation Completeness",
              score: 6.5,
              status: "warning",
            },
            { name: "Licensing Requirements", score: 7.0, status: "good" },
          ],
        },
        {
          name: "Financial Risk",
          score: 5.8,
          level: "medium",
          factors: [
            { name: "Payment Terms", score: 4.5, status: "poor" },
            { name: "Liability Caps", score: 7.0, status: "good" },
            { name: "Penalty Clauses", score: 6.0, status: "warning" },
          ],
        },
        {
          name: "Operational Risk",
          score: 7.5,
          level: "low",
          factors: [
            { name: "Performance Standards", score: 8.0, status: "good" },
            { name: "Delivery Timelines", score: 7.0, status: "good" },
            { name: "Quality Metrics", score: 7.5, status: "good" },
          ],
        },
        {
          name: "Contractual Risk",
          score: 6.0,
          level: "medium",
          factors: [
            { name: "Termination Clauses", score: 5.0, status: "warning" },
            { name: "Force Majeure", score: 7.0, status: "good" },
            { name: "Dispute Resolution", score: 6.0, status: "warning" },
          ],
        },
      ],
      trends: [
        { period: "Last 30 days", change: "+0.3", direction: "up" },
        { period: "Last 90 days", change: "-0.5", direction: "down" },
        { period: "Last 180 days", change: "+1.2", direction: "up" },
      ],
      recommendations: [
        {
          priority: "high",
          category: "Financial Risk",
          issue: "Payment terms are unfavorable",
          action: "Negotiate shorter payment periods or add late fees",
        },
        {
          priority: "medium",
          category: "Legal Compliance",
          issue: "Missing compliance documentation",
          action: "Add required regulatory compliance certificates",
        },
        {
          priority: "low",
          category: "Contractual Risk",
          issue: "Termination clause needs clarification",
          action: "Define clear termination procedures and notice periods",
        },
      ],
      historicalScores: [
        { date: "Jan 2024", score: 5.5 },
        { date: "Feb 2024", score: 6.0 },
        { date: "Mar 2024", score: 6.2 },
        { date: "Apr 2024", score: 6.7 },
        { date: "May 2024", score: 6.7 },
      ],
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

  const getRiskBadgeVariant = (level) => {
    switch (level) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "poor":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Scoring System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!riskAnalysis ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Calculator className="h-8 w-8 text-muted-foreground" />
            </div>

            <div>
              <p className="font-medium mb-2">Ready to analyze risk factors</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a legal document to get comprehensive risk scoring and
                analysis
              </p>

              <Button
                onClick={analyzeRisk}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Risk Factors...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Start Risk Analysis
                  </>
                )}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={60} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Evaluating compliance, financial, and operational risks...
                </p>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overall Risk Score */}
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-muted stroke-current"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={cn(
                        "stroke-current",
                        getRiskColor(riskAnalysis.riskLevel)
                      )}
                      strokeWidth="3"
                      strokeDasharray={`${
                        (riskAnalysis.overallScore / 10) * 100
                      }, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {riskAnalysis.overallScore}
                      </div>
                      <div className="text-xs text-muted-foreground">/ 10</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge
                    variant={getRiskBadgeVariant(riskAnalysis.riskLevel)}
                    className="text-sm"
                  >
                    {riskAnalysis.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {riskAnalysis.confidence}%
                  </p>
                </div>
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {riskAnalysis.categories.map((category, index) => (
                  <div key={index} className="text-center space-y-2">
                    <p className="font-medium text-sm">{category.name}</p>
                    <div className="text-lg font-bold">{category.score}</div>
                    <Badge
                      variant={getRiskBadgeVariant(category.level)}
                      className="text-xs"
                    >
                      {category.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              {riskAnalysis.categories.map((category, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{category.score}</span>
                      <Badge variant={getRiskBadgeVariant(category.level)}>
                        {category.level}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.factors.map((factor, factorIndex) => (
                      <div
                        key={factorIndex}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(factor.status)}
                          <span className="text-sm">{factor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={factor.score * 10}
                            className="w-16 h-2"
                          />
                          <span className="text-sm font-medium w-8">
                            {factor.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Risk Score Trends</h3>

                {/* Trend Cards */}
                <div className="grid gap-3">
                  {riskAnalysis.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{trend.period}</span>
                      <div className="flex items-center gap-2">
                        {trend.direction === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={cn(
                            "font-medium",
                            trend.direction === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {trend.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Historical Chart Placeholder */}
                <div className="border rounded-lg p-4 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Historical risk score chart would be displayed here
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Recommended Actions</h3>

                {riskAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(rec.priority)}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{rec.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rec.issue}
                        </p>
                      </div>
                      <Target className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recommended Action:</p>
                      <p className="text-sm">{rec.action}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {riskAnalysis && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setRiskAnalysis(null)}
              className="flex-1"
            >
              New Analysis
            </Button>
            <Button className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
