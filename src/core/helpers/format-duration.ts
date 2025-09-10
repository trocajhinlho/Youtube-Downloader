export function formatDuration(duration: string | number): string {
  const pad = (value: number) => value.toString().padStart(2, "0");
  duration = Number(duration);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}
