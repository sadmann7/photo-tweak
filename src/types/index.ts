import { NextApiRequest } from "next";

export interface NextApiRequestWithBody extends NextApiRequest {
  body: {
    imageUrl: string;
    target: string;
  };
}

export type UploadedFile = {
  secure_url: string;
};

export type Prediction = {
  completed_at: string;
  created_at: string;
  error: string | null;
  id: string;
  input: {
    image: string;
    target_age: string;
  };
  logs: string;
  metrics: {
    predict_time: number;
  };
  output: string;
  started_at: string;
  status: "succeeded" | "failed";
  urls: {
    cancel: string;
    get: string;
  };
  version: string;
  webhook_completed: null;
};
