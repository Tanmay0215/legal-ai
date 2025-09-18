import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BarChart3, FileText } from "lucide-react";

export function RiskScoring({ hasUploadedDocument }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  const analyzeRisk = async () => {
    if (!hasUploadedDocument) {
      setRiskAnalysis({
        error: true,
        message: "Please upload a document first to analyze risk.",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // This feature would require additional backend endpoints
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setRiskAnalysis({
        error: true,
        message:
          "Risk scoring analysis is not yet implemented in the backend API. This feature would require additional endpoints for legal risk assessment and compliance checking.",
      });
    } catch (error) {
      setRiskAnalysis({
        error: true,
        message: "Failed to analyze document risk: " + error.message,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Risk Scoring Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!riskAnalysis ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>

            <div>
              <p className="font-medium mb-2">Ready to analyze document risk</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a document to assess legal, financial, and operational
                risks
              </p>

              <Button
                onClick={analyzeRisk}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Risk...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Start Risk Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {riskAnalysis.error ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">
                    Feature Not Available
                  </h3>
                </div>
                <p className="text-sm text-yellow-700">
                  {riskAnalysis.message}
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setRiskAnalysis(null)}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
