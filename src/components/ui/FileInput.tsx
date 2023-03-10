import type { OnDrop } from "@/types/globals";
import { DownloadCloud, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

type FileInputProps = {
  onDrop: OnDrop;
  maxSize: number;
  isUploading: boolean;
  maxFiles?: number;
  className?: string;
};

const FileInput = ({
  onDrop,
  maxSize,
  maxFiles = 1,
  isUploading,
  className,
}: FileInputProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxSize,
    onDrop,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`grid h-60 w-full min-w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed p-2 text-center text-base text-gray-300 transition hover:bg-gray-700/80 disabled:cursor-not-allowed ${
        isDragActive ? "border-gray-500" : "border-gray-500"
      } ${className ?? ""}}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="grid place-items-center gap-2 px-10">
          <DownloadCloud aria-hidden="true" className="h-8 w-8" />
          <p>Drop the image here</p>
        </div>
      ) : isUploading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <div className="grid place-items-center gap-2 px-10">
          <DownloadCloud aria-hidden="true" className="h-8 w-8" />
          <p className="font-medium">
            Drag {`'n'`} drop image here, or click to select image
          </p>
          <p className="text-sm text-gray-400">
            Please upload image with size less than{" "}
            {Math.round(maxSize / 1000000)}MB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileInput;
