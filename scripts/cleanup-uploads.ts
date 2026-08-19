import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db/connect";
import { resolveUploadRoot } from "../src/lib/media/upload";
import MediaAsset from "../src/models/MediaAsset";

async function walkDir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else if (entry.isFile() && !entry.name.startsWith(".")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const execute = process.argv.includes("--execute");

  await connectDB();

  const uploadRoot = resolveUploadRoot();
  let diskFiles: string[] = [];

  try {
    diskFiles = await walkDir(uploadRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log(`Upload directory does not exist: ${uploadRoot}`);
      await mongoose.disconnect();
      return;
    }
    throw error;
  }

  const assets = await MediaAsset.find({}, { diskPath: 1, variants: 1 }).lean();
  const referenced = new Set<string>();

  for (const asset of assets) {
    referenced.add(path.normalize(asset.diskPath));
    for (const variant of asset.variants ?? []) {
      if (variant.diskPath) {
        referenced.add(path.normalize(variant.diskPath));
      }
    }
  }

  const orphans = diskFiles.filter((filePath) => !referenced.has(path.normalize(filePath)));

  if (orphans.length === 0) {
    console.log("No orphan files found.");
  } else {
    console.log(`${execute ? "Deleting" : "Would delete"} ${orphans.length} orphan file(s):`);
    for (const filePath of orphans) {
      const relative = path.relative(uploadRoot, filePath);
      console.log(`  ${relative}`);
      if (execute) {
        await fs.unlink(filePath);
      }
    }
  }

  if (!execute && orphans.length > 0) {
    console.log("\nDry run only. Pass --execute to delete orphan files.");
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
