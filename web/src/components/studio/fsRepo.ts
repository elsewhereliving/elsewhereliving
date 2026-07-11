// Save to the local repo via the File System Access API (Chrome/Edge). The
// owner picks their repo clone once per session; Save then writes the per-property
// JSON (+ any uploaded photos) straight into web/src/content + assets, ready to
// review in GitHub Desktop and push. No backend, no tokens.
import type { Rec } from "./store";

let root: any = null;

export const fsSupported = () => typeof (globalThis as any).showDirectoryPicker === "function";
export const fsConnected = () => !!root;

// Verify we actually hold read-write access; re-prompt (needs a user gesture,
// e.g. the Save click) if the grant lapsed or the folder was opened view-only.
async function ensureWritable(h: any): Promise<void> {
  if (!h || typeof h.queryPermission !== "function") return;
  const opts = { mode: "readwrite" } as any;
  if ((await h.queryPermission(opts)) === "granted") return;
  if ((await h.requestPermission(opts)) === "granted") return;
  throw new Error("Write access to the repo folder was declined — re-connect it and choose “Edit files” when Chrome asks.");
}
async function getDir(base: any, parts: string[], create = false) {
  let d = base;
  for (const p of parts) d = await d.getDirectoryHandle(p, { create });
  return d;
}
async function writeFile(parts: string[], name: string, data: string | Uint8Array) {
  const d = await getDir(root, parts, true);
  const fh = await d.getFileHandle(name, { create: true });
  const w = await fh.createWritable();
  await w.write(data);
  await w.close();
}
// Remove a file or directory. Tolerates the entry (or its parent) already
// being gone, but surfaces real failures — callers must not report success
// on a delete that didn't happen.
async function removeEntry(parts: string[], name: string, opts?: { recursive?: boolean }) {
  let d: any;
  try { d = await getDir(root, parts); } catch { return; }
  try { await d.removeEntry(name, opts); }
  catch (e: any) { if (e?.name !== "NotFoundError") throw e; }
}
function dataUrlBytes(u: string) {
  const m = u.match(/^data:image\/([\w+.-]+);base64,(.*)$/);
  const ext = (m ? m[1] : "jpg").replace("jpeg", "jpg").replace("svg+xml", "svg");
  const bin = atob(m ? m[2] : "");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, ext };
}

export async function connect(): Promise<string> {
  const h = await (globalThis as any).showDirectoryPicker({ mode: "readwrite", id: "ew-repo" });
  try { await getDir(h, ["web", "src", "content", "listings"]); }
  catch { throw new Error("That folder isn't the site repo (no web/src/content/listings)."); }
  await ensureWritable(h);
  root = h;
  return h.name;
}

// Build-computed fields are regenerated at build time — don't write them to disk.
const COMPUTED = ["price", "priceNum", "priceOriginal", "nightly", "nightlyNum", "nightlyOriginal"];
const folderOf = (c: string) => (c === "rentals" ? "rentals" : "listings");

// Write one record. Returns the cleaned record (gallery rewritten to /assets
// paths) so the in-memory copy can be synced.
export async function saveRecord(collection: string, rec: Rec): Promise<Rec> {
  if (!root) throw new Error("Connect your repo folder first");
  await ensureWritable(root);
  const id = rec.id;
  const stamp = Date.now().toString(36);
  const gallery: string[] = [];
  // Focal points are keyed by image src. Uploads get rewritten from data: URLs
  // to /assets paths below, so their focals must be re-keyed with them — and no
  // data: key may ever reach the JSON (it embeds the whole base64 image).
  const focals: Record<string, string> = {};
  for (const [k, v] of Object.entries((rec.focals as Record<string, string>) || {})) {
    if (!k.startsWith("data:")) focals[k] = v;
  }
  let i = 0;
  for (const g of rec.gallery || []) {
    if (typeof g === "string" && g.startsWith("data:")) {
      i++;
      const { bytes, ext } = dataUrlBytes(g);
      const name = `up-${stamp}-${i}.${ext}`;
      await writeFile(["assets", "listings", id], name, bytes);
      const path = `/assets/listings/${id}/${name}`;
      if (rec.focals && rec.focals[g]) focals[path] = rec.focals[g];
      gallery.push(path);
    } else gallery.push(g);
  }
  const out: any = { ...rec, gallery, focals, image: gallery[0] || rec.image || "" };
  out.imageFocal = focals[out.image] || rec.imageFocal || "";
  COMPUTED.forEach((k) => delete out[k]);
  await writeFile(["web", "src", "content", folderOf(collection)], id + ".json", JSON.stringify(out, null, 2) + "\n");
  return out;
}

// Delete a record's JSON plus its photo folders under assets/listings.
// `photoDirs` must contain only folders no other record references — photo
// folders are shared between related properties, so the caller (which can see
// every record) decides what is safe to remove.
export async function deleteRecord(collection: string, id: string, photoDirs: string[] = []) {
  if (!root) throw new Error("Connect your repo folder first");
  await ensureWritable(root);
  await removeEntry(["web", "src", "content", folderOf(collection)], id + ".json");
  for (const dir of photoDirs) await removeEntry(["assets", "listings"], dir, { recursive: true });
}

export async function writeHome(count: number) {
  if (!root) throw new Error("Connect your repo folder first");
  await ensureWritable(root);
  await writeFile(["web", "src", "data"], "home.json", JSON.stringify({ count }, null, 2) + "\n");
}
