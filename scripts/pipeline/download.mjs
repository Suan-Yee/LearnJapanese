import fs from 'fs';
import https from 'https';
import zlib from 'zlib';
import path from 'path';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');

function downloadAndUnzip(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${res.statusCode}`));
      }
      
      const file = fs.createWriteStream(dest);
      let stream = res;
      
      if (url.endsWith('.gz')) {
        const unzip = zlib.createGunzip();
        stream = res.pipe(unzip);
      }
      
      stream.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Saved to ${dest}`);
        resolve();
      });
      
      stream.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
  }

  try {
    await downloadAndUnzip('https://www.edrdg.org/kanjidic/kanjidic2.xml.gz', path.join(RAW_DIR, 'kanjidic2.xml'));
    console.log("kanjidic2 done.");
  } catch (e) {
    console.error("kanjidic2 failed:", e);
  }

  // JMDict is big, maybe we only download if it's not too big or just wait.
  try {
    await downloadAndUnzip('https://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz', path.join(RAW_DIR, 'JMdict_e.xml'));
    console.log("JMdict done.");
  } catch (e) {
    console.error("JMdict failed:", e);
  }
}

main();
