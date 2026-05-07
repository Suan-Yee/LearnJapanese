import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');

const unzip = zlib.createGunzip();
const inp = fs.createReadStream(path.join(RAW_DIR, 'JMdict_e.gz'));
const out = fs.createWriteStream(path.join(RAW_DIR, 'JMdict_e.xml'));

inp.pipe(unzip).pipe(out);

out.on('finish', () => {
  console.log('JMdict extracted');
  fs.unlinkSync(path.join(RAW_DIR, 'JMdict_e.gz'));
});
