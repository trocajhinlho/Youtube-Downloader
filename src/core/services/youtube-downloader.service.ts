import ytdl from "@distube/ytdl-core";
import fs from "fs";
import { join } from "path";
import { VideoDetails } from "../types/video-details.interface";

export default class YoutubeDownloaderService {
  private readonly dir: string;

  public constructor(dir: string) {
    console.log("Veryfing download directory...");
    if (!fs.existsSync(dir)) {
      console.log("Creating required dir... ");
      fs.mkdirSync(dir, { recursive: true });
    }
    this.dir = dir;
  }

  public async download(url: URL) {
    // TODO: validate URL

    const rawUrl = url.toString();
    const videoDetails = await this.getVideoDetails(rawUrl);

    const downloadPath = join(this.dir, "file.mp3");
    const req = ytdl(rawUrl, { filter: "audioonly" });
    const buffer: Uint8Array[] = [];

    req.on("");

    return videoDetails;
  }

  private async getVideoDetails(url: string): Promise<VideoDetails> {
    const info = await ytdl.getInfo(url);
    const videoFormat = ytdl.chooseFormat(info.formats, { filter: "audioonly" });

    return {
      title: info.videoDetails.title,
      thumbnailUrl: info.thumbnail_url,
      author: info.videoDetails.author.name,
      uploadDate: info.videoDetails.uploadDate,
    };
  }
}
