import { spawn } from "node:child_process";
import { resolveFromRoot } from "./utils.mjs";

const steps = [
  resolveFromRoot("scripts", "pipeline", "import-jmdict.mjs"),
  resolveFromRoot("scripts", "pipeline", "import-kanjidic.mjs"),
  resolveFromRoot("scripts", "pipeline", "import-tatoeba.mjs"),
  resolveFromRoot("scripts", "pipeline", "build-normalized.mjs"),
  resolveFromRoot("scripts", "pipeline", "build-lessons.mjs"),
  resolveFromRoot("scripts", "pipeline", "build-review-seeds.mjs"),
  resolveFromRoot("scripts", "pipeline", "validate-pipeline.mjs"),
];

function runStep(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Step failed (${code}): ${scriptPath}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  for (const step of steps) {
    await runStep(step);
  }
  console.log("Pipeline complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
