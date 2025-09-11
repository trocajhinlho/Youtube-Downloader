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
    const { contentLength, filename } = await this.getVideoDetails(videoId);

    return {
      filename,
      contentLength,
      readableStream: ytdl(url, { filter: "audioonly" }),
    };
  }

  public async getVideoDetails(videoId: string): Promise<VideoDetails> {
    const getLargestThumbnail = (thumbnails: YtdlThumbnail[]) => thumbnails[thumbnails.length - 1];

    const info = await ytdl.getInfo("https://youtube.com/watch?v=" + videoId);
    const videoFormat = ytdl.chooseFormat(info.formats, { filter: "audioonly" });

    return {
      title: info.videoDetails.title,
      thumbnailUrl: getLargestThumbnail(info.videoDetails.thumbnails).url,
      filename: sanitizeFilename(info.videoDetails.title) + ".mp3",
      author: info.videoDetails.author.name,
      publishDate: info.videoDetails.publishDate,
      contentLength: videoFormat.contentLength,
      fileSize: formatBytes(videoFormat.contentLength),
      duration: formatDuration(info.videoDetails.lengthSeconds),
    };
  }
}
