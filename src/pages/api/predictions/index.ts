import { NextApiRequestWithBody } from "@/types";
import type { NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

export default async function handler(
  req: NextApiRequestWithBody,
  res: NextApiResponse
) {
  const { imageUrl, target } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "7af9a66f36f97fee2fece7dcc927551a951f0022cbdd23747b9212f23fc17021",
      input: {
        image: imageUrl,
        // Neutral image description
        neutral: "a face",
        // Target image description
        target,
        // The higher the manipulation strength, the closer the generated image
        // becomes to the target description. Negative values moves the
        // generated image further from the target description
        // Range: -10 to 10
        manipulation_strength: 4.1,
        // The higher the disentanglement threshold, the more specific the
        // changes are to the target attribute. Lower values mean that broader
        // changes are made to the input image
        // Range: 0.08 to 0.3
        disentanglement_threshold: 0.15,
      },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
