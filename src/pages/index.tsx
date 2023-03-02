import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import ImageTabs from "@/components/ImageTabs";
import type { OriginalImage, PredictionResult, UploadedFile } from "@/types";
import { downloadFile } from "@/utils/download";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, CheckCircle, Download } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ErrorCode, FileRejection } from "react-dropzone";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

const schema = z.object({
  image: z.unknown().refine((v) => v instanceof File, {
    message: "Upload an image",
  }),
  command: z
    .string()
    .refine((v) => v.length > 0, {
      message: "Enter a command",
    })
    .refine((v) => v.length >= 3, {
      message: "Command must be at least 3 characters",
    }),
});
type Inputs = z.infer<typeof schema>;

export default function Home() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(
    null
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedLoaded, setGeneratedLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const imageFieldRef = useRef<HTMLFieldSetElement>(null);

  // react-hook-form
  const { register, handleSubmit, formState, watch, setValue } =
    useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (!(data.image instanceof File)) return;
    await uploadImage(data.image, data.command);
  };

  // register image, and set preview image
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach(async (file) => {
        if (!file) return;
        setValue("image", file, {
          shouldValidate: true,
        });
        setPreviewImage(URL.createObjectURL(file));
        if (!imageFieldRef.current) return;
        imageFieldRef.current.scrollIntoView({ behavior: "smooth" });
      });
      rejectedFiles.forEach((file) => {
        setValue("image", null, {
          shouldValidate: true,
        });
        setPreviewImage(null);

        switch (file.errors[0]?.code as ErrorCode) {
          case "file-invalid-type":
            toast.error("Please select a valid image");
            break;
          case "file-too-large":
            const size = Math.round(file.file.size / 1000000);
            toast.error(
              `Please select a image smaller than 5MB. Current size: ${size}MB`
            );
            break;
          case "too-many-files":
            toast.error("Please select only one image");
            break;
          default:
            toast.error(file.errors[0]?.message);
            break;
        }
      });
    },
    [setValue]
  );

  useEffect(() => {
    if (!previewImage) return;
    return () => URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  // upload image to cloudinary
  const uploadImage = async (image: File, command: string) => {
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
      const uploadedFile: UploadedFile = await response.json();
      if (!uploadedFile) return;
      setOriginalImage({
        name: image.name,
        url: uploadedFile.secure_url,
      });
      // TODO: remove setGeneratedImage
      setGeneratedImage(uploadedFile.secure_url);
      setIsUploading(false);
      setIsLoading(false);
      generateImage(uploadedFile.secure_url, command);
    };
  };

  // generate image from replicate
  const generateImage = async (image: string, command: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(true);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        command,
      }),
    });
    let prediction: PredictionResult = await response.json();

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

    setSelectedIndex(1);
    setIsLoading(false);
  };

  // headlessui tabs
  const tabs = [
    {
      name: "Original",
      content: (
        <Image
          src={originalImage?.url ?? ""}
          alt="original"
          width={576}
          height={576}
          loading="lazy"
          className="aspect-square w-[36rem] rounded-lg object-cover"
        />
      ),
    },
    {
      name: "Edited",
      content: (
        <div className="relative">
          <button
            aria-label="download edited image"
            className={twMerge(
              "absolute top-3 right-3 z-10 transform rounded-full bg-gray-900/50 p-2",
              "transition duration-300 ease-in-out hover:scale-105 active:scale-95",
              isDownloading && "pointer-events-none animate-pulse"
            )}
            onClick={() => {
              if (!generatedImage || originalImage?.name === undefined) return;
              downloadFile(
                generatedImage,
                originalImage?.name.replace(/(\.[^/.]+)$/, "-edited$1") ??
                  "edited.png",
                setIsDownloading
              );
            }}
          >
            <Download aria-hidden="true" className="h-5 w-5 text-white" />
          </button>
          <Image
            src={generatedImage ?? ""}
            alt="edited"
            width={576}
            height={576}
            loading="lazy"
            className="aspect-square w-[36rem] rounded-lg object-cover"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>PhotoTweak</title>
      </Head>
      <main className="container mx-auto mt-32 mb-16 flex flex-col items-center justify-center gap-16 px-6">
        <div className="grid max-w-xl gap-5">
          <h1 className="text-center text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight">
            Edit portraits with text commands
          </h1>
          <p className="text-center text-lg text-gray-300 sm:text-xl">
            Want to edit portrait with only text commands? Upload your portrait
            and edit it with text commands
          </p>
        </div>
        {generatedImage ? (
          <ImageTabs
            tabs={tabs}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        ) : (
          <form
            aria-label="edit photo form"
            className="mx-auto grid w-full max-w-xl gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="grid gap-5" ref={imageFieldRef}>
              <label
                htmlFor="image"
                className="flex items-center gap-3 text-sm font-medium text-white sm:text-base"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gray-600 text-sm text-white sm:text-base">
                  {watch("image") ? (
                    <Check aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    1
                  )}
                </span>
                Select your image
              </label>
              {!previewImage ? (
                <FileInput
                  maxSize={5000000}
                  isUploading={isUploading}
                  onDrop={onDrop}
                />
              ) : (
                <div className="group relative mx-auto aspect-square w-full max-w-[30rem] rounded-lg">
                  <div className="absolute inset-0 bg-gray-900 opacity-0 transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle aria-hidden="true" className="h-4 w-4" />
                        <p className="text-base font-medium">Image selected</p>
                      </div>
                      <p className="text-sm text-gray-400">
                        Click to select another image, or drag and drop
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0">
                    <FileInput
                      maxSize={5000000}
                      isUploading={isUploading}
                      onDrop={onDrop}
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <Image
                    src={previewImage}
                    alt="preview"
                    width={480}
                    height={480}
                    className="aspect-square w-[30rem] rounded-lg object-cover"
                  />
                </div>
              )}
              {formState.errors.image?.message ? (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle aria-hidden="true" className="h-4 w-4" />
                  <p className="text-sm font-medium">
                    {formState.errors.image.message}
                  </p>
                </div>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-5">
              <label
                htmlFor="command"
                className="flex items-center gap-3 text-sm font-medium text-white sm:text-base"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gray-600 text-sm text-white sm:text-base">
                  {watch("command") && watch("command").length >= 3 ? (
                    <Check aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    2
                  )}
                </span>
                Add your command
              </label>
              <input
                type="text"
                id="target"
                className="w-full rounded-md border-gray-400 bg-transparent px-4 py-2.5 text-base text-gray-100 transition-colors placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. a face with black hair"
                {...register("command", { required: true })}
              />
              {formState.errors.command ? (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle aria-hidden="true" className="h-4 w-4" />
                  <p className="text-sm font-medium">
                    {formState.errors.command.message}
                  </p>
                </div>
              ) : null}
            </fieldset>
            <Button
              aria-label="submit"
              className="w-full"
              isLoading={isUploading || isLoading}
              loadingVariant="spinner"
              disabled={isUploading || isLoading}
            >
              Submit
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
