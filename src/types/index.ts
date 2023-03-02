import { NextApiRequest } from "next";
import type { DropEvent, FileRejection } from "react-dropzone";

// next api request
export interface NextApiRequestReplicate extends NextApiRequest {
  body: {
    image: string;
    command: string;
  };
}

export interface NextApiRequestCloudinary extends NextApiRequest {
  body: {
    base64: string;
  };
}

// file input
export type OriginalImage = {
  name: string;
  url: string;
};

export type OnDrop =
  | (<T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => void)
  | undefined;

export type UploadedFile = {
  secure_url: string;
};

// replicate prediction
export type PredictionBody = {
  version: string;
  input: {
    input: string;
    neutral: string;
    target: string;
    manipulation_strength: number;
    disentanglement_threshold: number;
  };
};

export type PredictionResult = {
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
