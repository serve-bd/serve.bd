/**
 * Copy the installer and the files it downloads from a checkout of the Serve repository into
 * public/, so serve.bd serves them itself (no GitHub on the way, even when GitHub is down).
 * Run it after the installer changes, then deploy the site.
 *
 *   bun scripts/sync-installer.ts ../serve
 */
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const from = process.argv[2];
if (!from) {
  console.error("Usage: bun scripts/sync-installer.ts <path to the serve repository>");
  process.exit(1);
}

const files: [string, string][] = [
  ["install.sh", "public/install.sh"],
  // The CLI installer, at serve.bd/cli.sh.
  ["install-cli.sh", "public/cli.sh"],
  ["docker/compose.yml", "public/install/compose.yml"],
  ["scripts/restore-instance.sh", "public/install/restore-instance.sh"],
];
await mkdir("public/install", { recursive: true });
for (const [src, dest] of files) {
  await copyFile(path.join(from, src), dest);
  console.log(`${src} -> ${dest}`);
}
