import type { NextApiRequestReplicate, PredictionBody } from "@/types/globals";
import type { NextApiResponse } from "next";

// export const config = {
//   runtime: "edge",
// };

export default async function handler(
  req: NextApiRequestReplicate,
  res: NextApiResponse
) {
  const { image, command } = req.body;

  console.log(req.body);

  // const predictionBody: PredictionBody = {
  //   version: "7af9a66f36f97fee2fece7dcc927551a951f0022cbdd23747b9212f23fc17021",
  //   input: {
  //     input: image,
  //     // Neutral image description
  //     neutral: "a face",
  //     // Target image description
  //     target: command,
  //     // The higher the manipulation strength, the closer the generated image
  //     // becomes to the target description. Negative values moves the
  //     // generated image further from the target description
  //     // Range: -10 to 10
  //     manipulation_strength: 4.1,
  //     // The higher the disentanglement threshold, the more specific the
  //     // changes are to the target attribute. Lower values mean that broader
  //     // changes are made to the input image
  //     // Range: 0.08 to 0.3
  //     disentanglement_threshold: 0.15,
  //   },
  // };

  // const response = await fetch("https://api.replicate.com/v1/predictions", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     ...predictionBody,
  //   }),
  // });

  // if (response.status !== 201) {
  //   let error = await response.json();
  //   res.statusCode = 500;
  //   res.end(JSON.stringify({ detail: error.detail }));
  //   return;
  // }

  // const prediction = await response.json();
  // res.statusCode = 201;
  // res.end(JSON.stringify(prediction));
}
