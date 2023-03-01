import type { OnDrop } from "@/types";
import { DownloadCloud, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

type FileInputProps = {
  onDrop: OnDrop;
  maxSize: number;
  isUploading: boolean;
};

const FileInput = ({ onDrop, maxSize, isUploading }: FileInputProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize,
    onDrop,
  });

  return (
    <button
      {...getRootProps()}
      className={`grid h-60 w-full min-w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed p-2 text-center text-base text-gray-300 transition hover:bg-gray-700/80 disabled:cursor-not-allowed ${
        isDragActive ? "border-gray-500" : "border-gray-500"
      }`}
      disabled={isUploading}
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
          <p>Drag {`'n'`} drop image here, or click to select image</p>
          <p className="text-sm text-gray-400">
            Please upload image with size less than 5MB
          </p>
        </div>
      )}
    </button>
  );
};

export default FileInput;
