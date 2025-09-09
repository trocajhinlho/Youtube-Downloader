import express, { Request, Response } from "express";
import { join } from "path";
import YoutubeDownloaderService from "./core/services/youtube-downloader.service";

const app = express();
app.use(express.json());

const downloaderService = new YoutubeDownloaderService("tmp");

const staticRoot = app.get("/", (req: Request, res: Response) => {
  const filePath = join(__dirname, "static", "index.html");
  res.sendFile(filePath);
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

app.post("/download", async (req: Request, res: Response) => {
  console.log("Received");
  console.log(req.body);

  const url = new URL(req.body.videoUrl);
  const videoDetails = await downloaderService.download(url);
  return res.json(videoDetails);
});

const port = 3000;
app.listen(port, () => {
  console.log("Listening to port", port);
});
