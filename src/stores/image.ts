import type { OriginalImage } from "@/types/globals";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ImageState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  originalImage: OriginalImage | null;
  setOriginalImage: (image: OriginalImage | null) => void;
  generatedImage: string | null;
  setGeneratedImage: (image: string | null) => void;
};

const useImageStore = create<ImageState>()(
  devtools((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set(() => ({ isLoading: isLoading })),
    isUploading: false,
    setIsUploading: (isUploading: boolean) =>
      set(() => ({ isUploading: isUploading })),
    previewImage: null,
    setPreviewImage: (image: string | null) =>
      set(() => ({ previewImage: image })),
    originalImage: null,
    setOriginalImage: (image: OriginalImage | null) =>
      set(() => ({ originalImage: image })),
    generatedImage: null,
    setGeneratedImage: (image: string | null) =>
      set(() => ({ generatedImage: image })),
  }))
);

export default useImageStore;
