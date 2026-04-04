import fs from "node:fs/promises";
import path from "node:path";
import pngToIco from "png-to-ico";

const root = process.cwd();
const inputPath = path.join(root, "public", "gabi_logo.png");
const outputPath = path.join(root, "public", "favicon.ico");

const ico = await pngToIco(inputPath);
await fs.writeFile(outputPath, ico);

