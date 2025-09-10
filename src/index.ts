import express, { Request, Response } from "express";
import { join } from "path";
import YoutubeDownloaderService from "./core/services/youtube-downloader.service";
import { extractVideoIdMiddleware } from "./middleware/extract-video-id.middleware";

const app = express();
app.use(express.json());

const downloaderService = new YoutubeDownloaderService("tmp");

app.get("/", (req: Request, res: Response) => {
  const filePath = join(__dirname, "static", "index.html");
  res.sendFile(filePath);
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

app.get("/video-details", extractVideoIdMiddleware, async (req: Request, res: Response) => {
  const videoId = res.locals.videoId;

  const videoDetails = await downloaderService.getVideoDetails(videoId);
  return res.json({ data: videoDetails });
});

app.get("/download", extractVideoIdMiddleware, async (req: Request, res: Response) => {
  console.log("Received");

  const videoId = res.locals.videoId;
  const { readableStream, contentLength, filename } = await downloaderService.download(videoId);

  res.setHeader("Content-Length", contentLength);
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  return readableStream.pipe(res);
});

const port = 3000;
app.listen(port, () => {
  console.log("Listening to port", port);
});
