import sharp from "sharp"; import fs from "fs"; import path from "path";
async function aHash(buf){const px=await sharp(buf).grayscale().resize(8,8,{fit:"fill"}).raw().toBuffer();let s=0;for(const v of px)s+=v;const m=s/px.length;let b=0n;for(let i=0;i<64;i++)b=(b<<1n)|(px[i]>=m?1n:0n);return b;}
const ham=(a,b)=>{let x=a^b,c=0;while(x){c+=Number(x&1n);x>>=1n;}return c;};
const SRC=path.join(process.env.HOME,"Downloads","1412.");
const ID="r-samui-a49-glasshouse";
const OUT=path.join("..","assets","listings",ID); fs.mkdirSync(OUT,{recursive:true});
let files=fs.readdirSync(SRC).filter(f=>/\.(jpe?g|png)$/i.test(f)&&!f.startsWith("."));
const num=f=>{const m=f.match(/_(\d+)_/);return m?Number(m[1]):999;};
files.sort((a,b)=>num(a)-num(b)||a.localeCompare(b));
const kept=[],gallery=[];let i=0,dups=0;
for(const f of files){const raw=fs.readFileSync(path.join(SRC,f));let h;try{h=await aHash(raw);}catch{continue;}
 if(kept.some(k=>ham(k,h)<=5)){dups++;continue;}kept.push(h);i++;
 const n=String(i).padStart(2,"0")+".jpg";
 await sharp(raw).rotate().resize({width:2200,height:2200,fit:"inside",withoutEnlargement:true}).jpeg({quality:84,mozjpeg:true}).toFile(path.join(OUT,n));
 gallery.push(`/assets/listings/${ID}/${n}`);}
fs.writeFileSync("/tmp/kh-gallery.json",JSON.stringify(gallery));
console.log(`${gallery.length} photos, ${dups} dup(s) dropped`);
