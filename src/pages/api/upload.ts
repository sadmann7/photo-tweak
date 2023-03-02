import type { NextApiRequestCloudinary } from "@/types/globals";
import { cloudinary } from "@/utils/cloudinary";
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

  if (uploadedImage) {
    setTimeout(async () => {
      await cloudinary.uploader.destroy(uploadedImage.public_id, {
        resource_type: "image",
        invalidate: true,
      });
    }, 4 * 60 * 60 * 1000);
  }
}
