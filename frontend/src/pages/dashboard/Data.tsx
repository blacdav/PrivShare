import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileUp,
  File,
  Lock,
  Share2,
  Trash2,
  Download,
  Eye,
  Search,
  Filter,
} from "lucide-react";

interface DataFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  encrypted: boolean;
  sharedWith: number;
  status: "active" | "archived";
}

export function DataManagement() {
  const [files, _setFiles] = useState<DataFile[]>([
    {
      id: "1",
      name: "financial_report_2025.pdf",
      size: "2.4 MB",
      uploadedAt: "2025-10-22",
      encrypted: true,
      sharedWith: 2,
      status: "active",
    },
    {
      id: "2",
      name: "medical_records.zip",
      size: "5.1 MB",
      uploadedAt: "2025-10-21",
      encrypted: true,
      sharedWith: 1,
      status: "active",
    },
    {
      id: "3",
      name: "contract_draft.docx",
      size: "1.2 MB",
      uploadedAt: "2025-10-20",
      encrypted: true,
      sharedWith: 0,
      status: "active",
    },
    {
      id: "4",
      name: "audit_logs_q3.csv",
      size: "3.8 MB",
      uploadedAt: "2025-10-19",
      encrypted: true,
      sharedWith: 3,
      status: "active",
    },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          My Data
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Upload, manage, and share your encrypted files
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition ${
          dragActive ? "border-accent bg-accent/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent/10 mb-3 sm:mb-4">
              <FileUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              Upload Your Files
            </h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base max-w-md">
              Drag and drop your files here or click to browse. Files are
              encrypted locally before upload.
            </p>
            <Button className="w-full sm:w-auto">
              <FileUp className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="flex-1 bg-input border-border pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2 sm:hidden" />
          <span className="hidden sm:inline">Filter</span>
          <span className="sm:hidden">Filter Files</span>
        </Button>
      </div>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Your Files</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            All your encrypted files and their sharing status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      File Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Uploaded
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Encryption
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Shared With
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground text-sm">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {file.size}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {file.uploadedAt}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <Lock className="h-4 w-4" />
                          <span>AES-256</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                          {file.sharedWith}{" "}
                          {file.sharedWith === 1 ? "entity" : "entities"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      File Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Uploaded
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium text-foreground text-sm block">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-green-600 text-xs">
                                <Lock className="h-3 w-3" />
                                <span>Encrypted</span>
                              </div>
                              <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                                {file.sharedWith}{" "}
                                {file.sharedWith === 1 ? "share" : "shares"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {file.size}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {file.uploadedAt}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {files.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <File className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground text-sm truncate">
                          {file.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <Lock className="h-3 w-3" />
                        <span>Encrypted</span>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                        {file.sharedWith}{" "}
                        {file.sharedWith === 1 ? "share" : "shares"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-red-600"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
