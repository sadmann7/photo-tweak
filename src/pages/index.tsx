import DemoModal from "@/components/DemoModal";
import ImageTabs from "@/components/ImageTabs";
import Button from "@/components/ui/Button";
import FileInput from "@/components/ui/FileInput";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import useImageStore from "@/stores/image";
import type { PredictionResult, UploadedFile } from "@/types/globals";
import { downloadFile } from "@/utils/download";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Download,
  Loader2,
  Upload,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ErrorCode, FileRejection } from "react-dropzone";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
z;
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
  const [generatedLoaded, setGeneratedLoaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const imageFieldRef = useRef<HTMLFieldSetElement>(null);
  const imageTabsRef = useRef<HTMLDivElement>(null);

  // image store
  const {
    isLoading,
    setIsLoading,
    isUploading,
    setIsUploading,
    previewImage,
    setPreviewImage,
    originalImage,
    setOriginalImage,
    generatedImage,
    setGeneratedImage,
  } = useImageStore((state) => state);

  // react-hook-form
  const { register, handleSubmit, formState, watch, setValue, reset } =
    useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (!(data.image instanceof File)) return;
    await uploadImage(data.image, data.command);
    setSelectedTabIndex(1);
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
            const size = (file.file.size / 1024 / 1024).toFixed(2);
            toast.error(
              `Please select a image smaller than 4MB. Current size: ${size}MB`
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
    [setPreviewImage, setValue]
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

      if (response.status !== 200) {
        toast.error("Something went wrong");
        setIsUploading(false);
      } else {
        const uploadedFile: UploadedFile = await response.json();
        if (!uploadedFile) return;
        setOriginalImage({
          name: image.name,
          url: uploadedFile.secureUrl,
        });
        // setGeneratedImage is called to reduce transition time
        setGeneratedImage(uploadedFile.secureUrl);
        setIsUploading(false);
        setIsLoading(false);
        generateImage(uploadedFile.secureUrl, command);
      }
    };
  };

  // generate image from replicate
  const generateImage = async (image: string, command: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(true);
    // const response = await fetch("/api/predictions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     image,
    //     command,
    //   }),
    // });
    // let prediction: PredictionResult = await response.json();

    // if (response.status !== 201) {
    //   toast.error(prediction.error);
    //   return;
    // }
    // setGeneratedImage(prediction.output);

    // while (
    //   prediction.status !== "succeeded" &&
    //   prediction.status !== "failed"
    // ) {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   const response = await fetch("/api/predictions/" + prediction.id);
    //   prediction = await response.json();
    //   if (response.status !== 200) {
    //     toast.error(prediction.error);
    //     return;
    //   }
    //   setGeneratedImage(prediction.output);
    // }

    setIsLoading(false);
  };

  // reset form on image generation
  useEffect(() => {
    if (!generatedImage) return;
    reset();
    setPreviewImage(null);
  }, [generatedImage, reset, setPreviewImage]);

  // scroll to image tabs on image generation
  useEffect(() => {
    if (!imageTabsRef.current) return;
    const offset = imageTabsRef.current.offsetTop - 85;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, [generatedImage]);

  // headlessui tabs
  const tabs = [
    {
      name: "Original",
      content: (
        <Image
          src={originalImage?.url ?? "/images/placeholder.webp"}
          alt="original"
          width={576}
          height={576}
          loading="lazy"
          className="aspect-square w-[36rem] rounded-md object-cover"
        />
      ),
    },
    {
      name: "Edited",
      content:
        isLoading && !generatedImage ? (
          <div className="relative aspect-square rounded-md">
            <SkeletonLoading />
            <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center">
              <p className="text-2xl font-bold text-gray-100">
                Generating image...
              </p>
              <p className="text-sm text-gray-200">
                This may take a few minutes
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-3 right-3 z-10 flex transform items-center gap-2">
              <button
                aria-label="reset image and start over"
                className={twMerge(
                  "rounded-full bg-gray-900/50 p-2 text-white",
                  "transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                )}
                onClick={() => {
                  reset();
                  setPreviewImage(null);
                  setOriginalImage(null);
                  setGeneratedImage(null);
                  setSelectedTabIndex(0);
                  setIsLoading(false);
                  setIsUploading(false);
                  setIsDownloading(false);
                }}
              >
                <Upload aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                aria-label="download edited image"
                className={twMerge(
                  "rounded-full bg-gray-900/50 p-2 text-white",
                  "transition duration-300 ease-in-out hover:scale-105 active:scale-95",
                  isDownloading && "pointer-events-none animate-pulse"
                )}
                onClick={() => {
                  if (!generatedImage || originalImage?.name === undefined)
                    return;
                  setIsDownloading(true);
                  downloadFile(
                    generatedImage,
                    originalImage?.name.replace(/(\.[^/.]+)$/, "-edited$1") ??
                      "edited.png",
                    setIsDownloading
                  );
                }}
              >
                {isDownloading ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin"
                  />
                ) : (
                  <Download aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
            <Image
              src={generatedImage ?? "/images/placeholder.webp"}
              alt="edited"
              width={576}
              height={576}
              loading="lazy"
              className="aspect-square w-[36rem] rounded-md object-cover"
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
      <main className="container mx-auto mt-32 mb-16 flex flex-col items-center justify-center gap-12 px-6">
        {generatedImage || isLoading ? (
          <Fragment>
            <div className="grid max-w-xl place-items-center gap-5">
              <h1 className="text-center text-4xl font-bold leading-tight text-gray-50 sm:text-6xl sm:leading-tight">
                Your edited photo
              </h1>
              <p className="text-center text-lg text-gray-400 sm:text-xl">
                Your photos will be deleted from our server after 4 hours
              </p>
            </div>
            <div ref={imageTabsRef} className="w-full max-w-xl">
              <ImageTabs
                selectedIndex={selectedTabIndex}
                setSelectedIndex={setSelectedTabIndex}
                tabs={tabs}
              />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="grid max-w-xl place-items-center gap-5">
              <h1 className="text-center text-4xl font-bold leading-tight text-gray-50 sm:text-6xl sm:leading-tight">
                Edit portraits with text commands
              </h1>
              <p className="text-center text-lg text-gray-400 sm:text-xl">
                Want to edit portrait with only text commands? Upload your
                portrait and edit it with text commands
              </p>
              <DemoModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            </div>
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
                    maxSize={4 * 1024 * 1024}
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
                          <p className="text-base font-medium">
                            Image selected
                          </p>
                        </div>
                        <p className="text-sm text-gray-400">
                          Click to select another image, or drag and drop
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0">
                      <FileInput
                        maxSize={4 * 1024 * 1024}
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
          </Fragment>
        )}
      </main>
    </>
  );
}
