import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

export const ROOT = process.cwd();

export function resolveFromRoot(...parts) {
  return path.join(ROOT, ...parts);
}

export async function readJson(filePath) {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text);
}

export async function writeJson(filePath, value) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function stableId(prefix, ...parts) {
  const digest = createHash("sha1")
    .update(parts.map((part) => String(part).trim()).join("|"))
    .digest("hex")
    .slice(0, 12);
  return `${prefix}_${digest}`;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export async function pathExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function readTextIfExists(filePath) {
  if (!(await pathExists(filePath))) return null;
  return readFile(filePath, "utf8");
}
