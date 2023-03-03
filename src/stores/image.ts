import { OriginalImage } from "@/types/globals";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type ImageState = {
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  originalImage: OriginalImage | null;
  setOriginalImage: (image: OriginalImage | null) => void;
  generatedImage: string | null;
  setGeneratedImage: (image: string | null) => void;
};

const useImageStore = create<ImageState>()(
  devtools(
    persist(
      (set) => ({
        previewImage: null,
        setPreviewImage: (image: string | null) =>
          set(() => ({ previewImage: image })),
        originalImage: null,
        setOriginalImage: (image: OriginalImage | null) =>
          set(() => ({ originalImage: image })),
        generatedImage: null,
        setGeneratedImage: (image: string | null) =>
          set(() => ({ generatedImage: image })),
      }),
      {
        name: "image-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useImageStore;
