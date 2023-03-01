import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import type { OnDrop, OriginalImage, Prediction, UploadedFile } from "@/types";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FileRejection } from "react-dropzone";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";

type Inputs = {
  image: File;
  target: string;
};

export default function Home() {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(
    null
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedLoaded, setGeneratedLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // react-hook-form
  const { register, handleSubmit, formState, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    await uploadImage(data.image);
    if (!originalImage) return;
    // await generateImage(originalImage.url, data.target);
    setIsUploading(false);
  };

  const onDrop: OnDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach(async (file) => {
        if (!file) return;
        setValue("image", file, {
          shouldValidate: true,
        });
        setPreviewImage(URL.createObjectURL(file));
      });
      rejectedFiles.forEach((file) => {
        if (file.errors[0]?.code === "file-too-large") {
          const size = Math.round(file.file.size / 1000000);
          toast.error(
            `Please upload a image smaller than 1MB. Current size: ${size}MB`
          );
        } else {
          toast.error(toast.error(file.errors[0]?.message));
        }
      });
    },
    [setValue]
  );

  useEffect(() => {
    if (!previewImage) return;
    return () => URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  const uploadImage = async (image: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      const base64 = reader.result;
      if (typeof base64 !== "string") return;
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64,
        }),
      });

      if (!response.ok) {
        toast.error("Network response was not ok");
        setIsUploading(false);
      }
      if (response.status === 500) {
        toast.error("Server error");
        setIsUploading(false);
      }
      const data: UploadedFile = await response.json();

      if (!data) return;
      setOriginalImage({
        name: image.name,
        url: data.secure_url,
      });
      setIsUploading(false);
    };
  };

  const generateImage = async (imageUrl: string, target: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(true);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        target,
      }),
    });
    let prediction: Prediction = await response.json();

    if (response.status !== 201) {
      toast.error(prediction.error);
      return;
    }
    setGeneratedImage(prediction.output);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        toast.error(prediction.error);
        return;
      }
      setGeneratedImage(prediction.output);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>PhotoTweak</title>
      </Head>
      <main className="container mx-auto mt-32 mb-16 flex max-w-7xl flex-col items-center justify-center gap-10 px-6">
        <div className="grid max-w-xl gap-5">
          <h1 className="text-center text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight">
            Edit portraits from text commands
          </h1>
          <p className="text-center text-lg text-gray-300 sm:text-xl">
            Want to edit portrait with only text commands? Upload your photo and
            add a text command to edit your portrait.
          </p>
        </div>
        <form
          aria-label="add product form"
          className="grid gap-5 whitespace-nowrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid gap-2">
            <label
              htmlFor="image"
              className="text-title text-xs font-medium md:text-sm"
            >
              Upload your photo
            </label>
            {!previewImage ? (
              <FileInput isUploading={isUploading} onDrop={onDrop} />
            ) : (
              <Image
                src={previewImage}
                alt="preview"
                width={500}
                height={500}
                loading="eager"
              />
            )}
          </fieldset>
          <fieldset className="grid gap-2">
            <label
              htmlFor="traget"
              className="text-title text-xs font-medium md:text-sm"
            >
              Text command
            </label>
            <input
              type="text"
              id="target"
              className="w-full rounded-md border-gray-400 bg-transparent px-4 py-2.5 text-base text-gray-100 transition-colors placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Input command"
              {...register("target", { required: true })}
            />
            {formState.errors.target ? (
              <p className="text-danger text-sm font-medium">
                {formState.errors.target.message}
              </p>
            ) : null}
          </fieldset>
          <Button
            aria-label="submit"
            className="w-full"
            disabled={isUploading || isDownloading}
            isLoading={isLoading}
            loadingVariant="spinner"
          >
            Edit photo
          </Button>
        </form>
      </main>
    </>
  );
}
