import React, { useRef, useState } from "react";
import IconComponent from "../../assets/icons/IconComponent";

interface FileUploadProps {
  label?: string;
  onFilesSelected?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  handleSelectFile: (file: string, name: string) => void;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  uploadProgress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  multiple = true,
  accept = "*/*",
  handleSelectFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const clean = file.name?.replace(/[^a-zA-Z0-9]/g, "-");
    handleSelectFile(URL.createObjectURL(file), clean);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files[0];
    handleFile(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`
    relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 cursor-pointer
    ${
      isDragging
        ? "border-primary-purple bg-primary-purple/5 border-solid"
        : "border-muted-foreground bg-muted-background/50 hover:border-primary-purple/50 hover:bg-muted-foreground/10"
    }
  `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* File Input spans entire div */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex items-center justify-center space-x-4 pointer-events-none">
        <div className="w-10 h-10 bg-primary-purple/5 rounded-full flex items-center justify-center">
          <IconComponent iconName={"upload"} className="text-primary-purple" />
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Drag and drop your files here
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            or{" "}
            <span className="text-primary-purple font-medium">
              browse files
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
