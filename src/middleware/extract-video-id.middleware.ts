import { NextFunction, Request, Response } from "express";

export function extractVideoIdMiddleware(req: Request, res: Response, next: NextFunction) {
  let urlObj: URL;
  try {
    urlObj = new URL(req.query.url as string);
  } catch {
    return res.status(400).json({ error: "Invalid YouTube video URL" });
  }

  let videoId: string | null = null;
  const pathname = urlObj.pathname.substring(1);

  if (
    (urlObj.hostname === "www.youtube.com" || urlObj.hostname === "music.youtube.com") &&
    pathname === "watch"
  ) {
    videoId = urlObj.searchParams.get("v");
  } else if (urlObj.hostname === "youtu.be") {
    videoId = pathname !== "" ? pathname : null;
  }
  if (!videoId) {
    return res.status(400).json({ error: "Video ID not found in URL" });
  }

  console.log("Passed");
  res.locals.videoId = videoId;
  next();
}
