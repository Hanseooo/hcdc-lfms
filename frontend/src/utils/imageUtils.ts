// utils/imageUtils.ts

/**
 * Compresses and resizes an image file to around 480p (max 854px on longest side),
 * while keeping the original aspect ratio and transparency (for PNGs).
 *
 * Automatically detects image type (JPEG or PNG).
 */
export async function compressImage(
  file: File,
  maxDimension = 854, // 480p width for landscape or height for portrait
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.crossOrigin = "anonymous"; // avoid CORS issues with blobs

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Maintain aspect ratio
      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }

      canvas.width = Math.round(width);
      canvas.height = Math.round(height);

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported");

      // Preserve transparency for PNGs
      if (file.type === "image/png") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#fff"; // white background for JPEGs
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Image compression failed");
          const compressedFile = new File([blob], file.name, {
            type: outputType,
          });
          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = (err) => reject(`Failed to load image: ${err}`);
  });
}
