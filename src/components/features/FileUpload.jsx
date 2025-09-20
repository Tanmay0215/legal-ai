import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import legalApiService from "@/services/legalApi";

export function FileUpload({ onFileUpload }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: "pending",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false, // API only supports single file upload
  });

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    setUploading(true);

    for (let fileItem of files) {
      if (fileItem.status === "pending") {
        try {
          // Update status to uploading
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, status: "uploading", progress: 0 }
                : f
            )
          );

          // Simulate progress while uploading
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id && f.progress < 90
                  ? { ...f, progress: f.progress + 10 }
                  : f
              )
            );
          }, 200);

          // Upload file using real API
          const result = await legalApiService.uploadPdf(fileItem.file);

          clearInterval(progressInterval);

          // Update file status based on result
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? {
                    ...f,
                    progress: 100,
                    status: result.success ? "completed" : "error",
                  }
                : f
            )
          );

          // Store upload result
          setUploadResults((prev) => ({
            ...prev,
            [fileItem.id]: result,
          }));

          // Call the callback if provided and upload was successful
          if (result.success) {
            onFileUpload?.(fileItem.file, result);
          }
        } catch (error) {
          console.error("Upload failed:", error);

          // Update file status to error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id ? { ...f, status: "error", progress: 0 } : f
            )
          );

          // Store error result
          setUploadResults((prev) => ({
            ...prev,
            [fileItem.id]: {
              success: false,
              message: error.message || "Upload failed",
              error: true,
            },
          }));
        }
      }
    }

    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 md:p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-base sm:text-lg font-medium">
              Drop the files here...
            </p>
          ) : (
            <div>
              <p className="text-sm sm:text-base md:text-lg font-medium mb-2">
                <span className="hidden sm:inline">
                  Drag & drop PDF documents here
                </span>
                <span className="sm:hidden">Drag & drop PDF</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                or click to select PDF file (single file only)
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                Choose Files
              </Button>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm sm:text-base">
              <span className="hidden sm:inline">
                Uploaded Files ({files.length})
              </span>
              <span className="sm:hidden">Files ({files.length})</span>
            </h3>
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-2 md:gap-3 p-3 border rounded-lg"
              >
                <File className="h-6 w-6 md:h-8 md:w-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm md:text-base">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileItem.status === "uploading" && (
                    <Progress value={fileItem.progress} className="mt-2" />
                  )}
                </div>
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <Badge
                    variant={
                      fileItem.status === "completed"
                        ? "default"
                        : fileItem.status === "uploading"
                        ? "secondary"
                        : fileItem.status === "error"
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {fileItem.status === "completed" && (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {fileItem.status === "error" && (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    <span className="hidden sm:inline">{fileItem.status}</span>
                    <span className="sm:hidden">
                      {fileItem.status === "completed"
                        ? "✓"
                        : fileItem.status === "uploading"
                        ? "..."
                        : fileItem.status === "error"
                        ? "✗"
                        : "⏳"}
                    </span>
                  </Badge>
                  {(fileItem.status === "pending" ||
                    fileItem.status === "error") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileItem.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Upload Results */}
            {files.some(
              (f) => f.status === "completed" || f.status === "error"
            ) && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Upload Results</h4>
                {files
                  .filter(
                    (f) => f.status === "completed" || f.status === "error"
                  )
                  .map((fileItem) => {
                    const result = uploadResults[fileItem.id];
                    if (!result) return null;

                    return (
                      <div
                        key={`result-${fileItem.id}`}
                        className={cn(
                          "p-3 rounded-lg border text-sm",
                          result.success
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-red-50 border-red-200 text-red-800"
                        )}
                      >
                        <p className="font-medium mb-1">{fileItem.file.name}</p>
                        {result.success ? (
                          <>
                            <p>Document Type: {result.document_type}</p>
                            <p>
                              Confidence: {(result.confidence).toFixed(1)}
                              %
                            </p>
                            <p className="text-xs mt-1">{result.message}</p>
                          </>
                        ) : (
                          <p>{result.message}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {files.some((f) => f.status === "pending") && (
              <Button
                onClick={uploadFiles}
                disabled={uploading}
                className="w-full text-xs sm:text-sm md:text-base"
              >
                <span className="hidden sm:inline">
                  {uploading ? "Uploading..." : "Upload File"}
                </span>
                <span className="sm:hidden">
                  {uploading ? "Uploading..." : "Upload"}
                </span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
