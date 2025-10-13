import React, { useRef, useState } from "react";
import { useFileProcessing } from "../../hooks/useFileProcessing";

export const FileUpload: React.FC = () => {
  const { uploadFile, isLoading, error } = useFileProcessing();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Immediately show the selected file name
    setSelectedFileName(file.name);
    setUploadResult(null);

    try {
      const result = await uploadFile(file);
      console.log("File uploaded:", result);
      setUploadResult(result);
    } catch (err) {
      console.error("Upload failed:", err);
      setSelectedFileName(null); // Clear the file name on error
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setSelectedFileName(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border border-[#A77BFF] rounded-xl p-6 hover:border-[#BCB1FF] transition-colors duration-300 cursor-pointer">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt" // Add your supported file types
      />

      <div className="flex flex-col space-y-4">
        {/* File name display */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {selectedFileName ? (
              <span className="text-[#BCB1FF] font-medium">
                {selectedFileName}
                {uploadResult && (
                  <span className="block text-green-600 text-xs mt-1">
                    ✓ Uploaded successfully!
                  </span>
                )}
              </span>
            ) : (
              "No file selected"
            )}
          </p>
        </div>

        {/* Supported files info */}
        <p className="text-sm text-gray-500 text-center">
          Supported files: Images, PDF, Documents
        </p>

        {/* Upload/Clear buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold bg-[#BCB1FF] text-white border border-[#BCB1FF] rounded-full hover:bg-white hover:text-[#BCB1FF] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Uploading..."
              : selectedFileName
              ? "Change File"
              : "Upload"}
          </button>

          {selectedFileName && !isLoading && (
            <button
              onClick={handleClearFile}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};
