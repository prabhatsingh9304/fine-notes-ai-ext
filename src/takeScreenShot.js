async function takeScreenshot() {
  try {
    const video = document.querySelector("video");
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("No video loaded or video is not ready.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const isCanvasBlank = (canvas) => {
      const pixelBuffer = new Uint32Array(
        canvas
          .getContext("2d")
          .getImageData(0, 0, canvas.width, canvas.height).data.buffer
      );
      return !pixelBuffer.some((color) => color !== 0);
    };

    if (isCanvasBlank(canvas)) {
      console.warn("Video frame appears to be blank.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `youtube-snapshot-${timestamp}.jpg`;
    link.click();
  } catch (error) {
    console.error("Error taking screenshot:", error);
  }
}

takeScreenshot();
