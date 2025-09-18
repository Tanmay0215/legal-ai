import React from "react";

export function DashboardContent({
  activeComponent: ActiveComponent,
  activeTab,
  hasUploadedDocument,
  uploadedDocumentInfo,
  handleDocumentUpload,
}) {
  const getComponentProps = () => {
    switch (activeTab) {
      case "upload":
        return { onFileUpload: handleDocumentUpload };
      case "chat":
        return {
          hasDocument: hasUploadedDocument,
          documentInfo: uploadedDocumentInfo,
        };
      default:
        return { hasUploadedDocument, uploadedDocumentInfo };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
      <div className="h-full p-3 sm:p-4 md:p-6 lg:p-6">
        {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
      </div>
    </div>
  );
}
