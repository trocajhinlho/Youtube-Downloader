import express, { Response } from "express";
import { join } from "path";
import YoutubeDownloaderService from "./core/services/youtube-downloader.service";
import { extractVideoIdMiddleware } from "./middleware/extract-video-id.middleware";

const app = express();
app.use(express.json());

const downloaderService = new YoutubeDownloaderService();

app.get("/", (_, res: Response) => {
  const filePath = join(__dirname, "static", "index.html");
  res.sendFile(filePath);
});

app.get("/health", (_, res: Response) => {
  res.json({ status: "healthy" });
});

app.get("/video-details", extractVideoIdMiddleware, async (_, res: Response) => {
  const videoId = res.locals.videoId;

  try {
    const videoDetails = await downloaderService.getVideoDetails(videoId);
    return res.json({ data: videoDetails });
  } catch (error) {
    return res.status(404).json({ data: (error as Error).message });
  }
});

app.get("/download", extractVideoIdMiddleware, async (_, res: Response) => {
  const videoId = res.locals.videoId;
  const downloadResult = await downloaderService.download(videoId);
  if (downloadResult === null) return res.status(404);

  try {
    const { readableStream, contentLength, filename } = downloadResult;

    res.setHeader("Content-Length", contentLength);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return readableStream.pipe(res);
  } catch (error) {
    return res.status(404).json({ data: (error as Error).message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log("Listening to port", port);
});
