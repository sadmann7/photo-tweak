import { NextApiRequestCloudinary } from "@/types";
import { cloudinary } from "@/utils/cloudinary";
import type { NextApiResponse } from "next";

const handler = async (req: NextApiRequestCloudinary, res: NextApiResponse) => {
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
  res.status(200).json({ secure_url: uploadedImage.secure_url });
};

export default handler;
