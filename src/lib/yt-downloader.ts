import { spawn } from "child_process";
import { UTApi, UTFile } from "uploadthing/server";
import { v4 as uuidv4 } from "uuid";

const utapi = new UTApi();

export async function downloadAndUpload(url: string) {
  const name = uuidv4();
  return new Promise<string>((resolve, reject) => {
    const process = spawn(
      "yt-dlp",
      [
        "-f",
        "18",
        "-o",
        "-",
        "--no-part",
        "--no-playlist",
        "--quiet",
        "--no-warnings",
        url,
      ],
      {
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    const chunks: Buffer[] = [];

    process.stdout.on("data", (chunk) => {
      chunks.push(chunk);
    });

    process.on("close", async (code) => {
      if (code !== 0) {
        return reject(new Error("yt-dlp failed"));
      }

      const buffer = Buffer.concat(chunks);

      if (!buffer.length) {
        return reject(new Error("Empty buffer"));
      }

      try {
        // ✅ FIX HERE
        const file = new UTFile([buffer], `${name}.mp4`, {
          type: "video/mp4",
        });

        const res = await utapi.uploadFiles([file]); // ✅ ARRAY

        console.log("UPLOADTHING RESPONSE:", res);

        const uploadedUrl = res?.[0]?.data?.ufsUrl;

        if (!uploadedUrl) {
          console.error("Upload failed:", res);
          return reject(new Error("UploadThing failed"));
        }

        resolve(uploadedUrl);
      } catch (err) {
        reject(err);
      }
    });
  });
}
