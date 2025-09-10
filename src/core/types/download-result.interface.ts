import { Readable } from "stream";

export interface DownloadResult {
  filename: string;
  contentLength: string;
  readableStream: Readable;
}
