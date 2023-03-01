import type { OnDrop } from "@/types";
import { Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

type FileInputProps = {
  onDrop: OnDrop;
  isUploading: boolean;
};

const FileInput = ({ onDrop, isUploading }: FileInputProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1000000,
    onDrop: onDrop,
  });

  return (
    <button
      {...getRootProps()}
      className={`grid h-52 w-full max-w-md cursor-pointer place-items-center rounded-md border-2 border-dashed p-2 text-center text-base disabled:cursor-not-allowed ${
        isDragActive
          ? "border-blue-300 text-blue-300"
          : "border-gray-400 text-white"
      }`}
      disabled={isUploading}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : isUploading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <p>Drag {`'n'`} drop image here, or click to select image</p>
      )}
    </button>
  );
};

export default FileInput;
