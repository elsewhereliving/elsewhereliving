import { mkdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
const __dir = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dir, "../..");
const [,, id, pathsArg] = process.argv;
const paths = readFileSync(pathsArg,"utf8").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
const dest = join(REPO,"assets/listings",id);
if (existsSync(dest)) rmSync(dest,{recursive:true,force:true});
mkdirSync(dest,{recursive:true});
const gallery=[];
for (let i=0;i<paths.length;i++){ const n=String(i+1).padStart(2,"0");
  try{ await sharp(paths[i]).rotate().resize({width:2200,withoutEnlargement:true}).jpeg({quality:86,mozjpeg:true}).toFile(join(dest,`${n}.jpg`)); gallery.push(`/assets/listings/${id}/${n}.jpg`);}catch(e){console.error(n,e.message);} }
console.log(`${id}: ${gallery.length} photos`);
