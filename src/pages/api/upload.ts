import type { NextApiRequestCloudinary } from "@/types/globals";
import { cloudinary } from "@/utils/cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import type { NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",
    },
  },
};

export default async function handler(
  req: NextApiRequestCloudinary,
  res: NextApiResponse
) {
  const base64 = req.body.base64;
  const uploadedImage = await cloudinary.uploader.upload(base64, {
    resource_type: "image",
    folder: "photo-tweak",
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "fill",
        quality: 90,
      },
    ],
  });
  res.status(200).json({
    publicId: uploadedImage.public_id,
    secureUrl: uploadedImage.secure_url,
    createdAt: uploadedImage.created_at,
  });

  // delete images created more than 15 minutes ago
  const options: UploadApiOptions = {
    resource_type: "image",
    type: "upload",
    prefix: "photo-tweak",
    folder: "photo-tweak",
  };
  const result: UploadApiResponse = await cloudinary.api.resources(options);
  const images = result.resources;
  const now = new Date();
  const targetTime = new Date(now.getTime() - 15 * 60 * 1000);
  images.forEach(async (image: UploadApiResponse) => {
    const createdAt = new Date(image.created_at);
    if (createdAt < targetTime) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  });
}
