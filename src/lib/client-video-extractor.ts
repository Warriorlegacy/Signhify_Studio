export async function extractFramesFromVideo(
  videoUrl: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // Important for remote URLs
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = async () => {
      try {
        const frames: string[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // We want to extract at e.g., 10 frames per second
        const fps = 10;
        const duration = video.duration;
        const totalFrames = Math.floor(duration * fps);
        
        // Scale down to a reasonable resolution for scroll performance (e.g. 720p or 480p)
        const targetWidth = 1280;
        const targetHeight = 720;
        
        // Calculate aspect-ratio-preserving dimensions
        const ratio = video.videoWidth / video.videoHeight;
        canvas.width = targetWidth;
        canvas.height = targetWidth / ratio;

        for (let i = 0; i <= totalFrames; i++) {
          const time = i / fps;
          video.currentTime = time;
          
          // Wait for the video to seek to the frame
          await new Promise<void>((resolveSeek) => {
            video.onseeked = () => resolveSeek();
          });

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to WebP for smaller size
          const frameDataUrl = canvas.toDataURL("image/webp", 0.8);
          frames.push(frameDataUrl);

          if (onProgress) {
            onProgress(Math.round((i / totalFrames) * 100));
          }
        }

        resolve(frames);
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = (err) => {
      reject(new Error(`Failed to load video: ${err}`));
    };
    
    // Trigger load
    video.load();
  });
}
