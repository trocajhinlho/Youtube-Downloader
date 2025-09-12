import ytdl, { thumbnail as YtdlThumbnail } from "@distube/ytdl-core";
import { formatBytes } from "../helpers/format-bytes";
import { formatDuration } from "../helpers/format-duration";
import sanitizeFilename from "../helpers/sanitize-filename";
import { DownloadResult } from "../types/download-result.interface";
import { VideoDetails } from "../types/video-details.interface";

export default class YoutubeDownloaderService {
  public constructor() {}

  public async download(videoId: string): Promise<DownloadResult> {
    const url = "https://youtube.com/watch?v=" + videoId;
    const { info, videoFormat } = await this.getVideoRawDetails(videoId);

    return {
      filename: sanitizeFilename(info.videoDetails.title) + ".mp3",
      contentLength: videoFormat.contentLength,
      readableStream: ytdl(url, { filter: "audioonly" }),
    };
  }

  public async getVideoDetails(videoId: string): Promise<VideoDetails> {
    const getLargestThumbnail = (thumbnails: YtdlThumbnail[]) => thumbnails[thumbnails.length - 1];

    const url = "https://youtube.com/watch?v=" + videoId;
    const { info, videoFormat } = await this.getVideoRawDetails(url);

    return {
      title: info.videoDetails.title,
      thumbnailUrl: getLargestThumbnail(info.videoDetails.thumbnails).url,
      author: info.videoDetails.author.name,
      publishDate: info.videoDetails.publishDate,
      contentLength: videoFormat.contentLength,
      fileSize: formatBytes(videoFormat.contentLength),
      duration: formatDuration(info.videoDetails.lengthSeconds),
    };
  }

  private async getVideoRawDetails(videoUrl: string) {
    try {
      const info = await ytdl.getInfo(videoUrl);
      const videoFormat = ytdl.chooseFormat(info.formats, { filter: "audioonly" });
      return { info, videoFormat };
    } catch (error) {
      throw new Error("Video not found");
    }
  }
}
