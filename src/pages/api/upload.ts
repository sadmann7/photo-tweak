import { cloudinary } from "@/utils/cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const base64 = req.body.base64;
  const uploadedImage = await cloudinary.uploader.upload(base64, {
    resource_type: "image",
    folder: "age-transition",
    transformation: [
      {
        width: 480,
        height: 480,
        crop: "fill",
        quality: 80,
      },
    ],
  });
  res.status(200).json({ secure_url: uploadedImage.secure_url });
};

export default handler;
