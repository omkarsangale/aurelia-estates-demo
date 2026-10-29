import sharp from 'sharp';
import {mkdir, writeFile} from 'node:fs/promises';

await mkdir('dist/assets/optimized', {recursive:true});
const images = {hero:'hero',living:'living',pool:'pool',residences:'residences-new',commercial:'commercial-new'};
const manifest = {};
for (const [name, source] of Object.entries(images)) {
  const meta = await sharp(`dist/assets/${source}.jpg`).metadata();
  manifest[name] = {width:meta.width,height:meta.height};
  for (const width of [480,800,1200,1600].filter(w=>w<=meta.width)) {
    await sharp(`dist/assets/${source}.jpg`).resize({width}).webp({quality:79}).toFile(`dist/assets/optimized/${name}-${width}.webp`);
  }
}
await writeFile('review/image-dimensions.json', JSON.stringify(manifest,null,2));
console.log('Responsive WebP photographs generated.');
