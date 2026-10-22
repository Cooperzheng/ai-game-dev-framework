import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const args = process.argv.slice(2);
const includeArchives = args.includes('--local-evidence');
const root = path.resolve(args.find(arg => arg !== '--local-evidence') || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
let checked = 0; const errors = [];
const withoutCode = text => text.replace(/```[\s\S]*?```/g, '');
// Heading anchors as GitHub makes them: lower case, punctuation dropped (CJK kept), spaces to hyphens, repeats numbered.
const anchorCache = new Map();
function anchors(file) {
  if (!anchorCache.has(file)) {
    const found = new Set(); const seen = new Map();
    for (const match of withoutCode(fs.readFileSync(file, 'utf8')).matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)) {
      const slug = match[1].replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim().toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/\s/g, '-');
      const count = seen.get(slug) ?? 0; seen.set(slug, count + 1);
      found.add(count ? `${slug}-${count}` : slug);
    }
    for (const match of fs.readFileSync(file, 'utf8').matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) found.add(match[1]);
    anchorCache.set(file, found);
  }
  return anchorCache.get(file);
}
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const full = path.join(dir, item.name);
    const relative = path.relative(root, full).split(path.sep).join('/');
    if (!includeArchives && (relative === 'docs/local' || relative === 'docs/本地资料' || relative === 'docs/acceptance' || (relative.startsWith('docs/plans/') && relative !== 'docs/plans/README.md'))) continue;
    if (item.isSymbolicLink()) continue;
    if (item.isDirectory()) walk(full);
    else if (item.name.endsWith('.md')) {
      checked++;
      const text = withoutCode(fs.readFileSync(full, 'utf8')).replace(/`[^`\n]*`/g, '');
      for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
        const ref = match[1];
        if (/^(https?:|mailto:)/.test(ref)) continue;
        const [name, anchor] = ref.split('#');
        const target = name ? path.resolve(dir, decodeURIComponent(name)) : full;
        if (name && !fs.existsSync(target)) errors.push(`${path.relative(root, full)} -> ${ref}`);
        else if (anchor && target.endsWith('.md') && !anchors(target).has(decodeURIComponent(anchor).toLowerCase())) errors.push(`${path.relative(root, full)} -> ${ref} (no such heading)`);
      }
    }
  }
}
walk(root);
// A project with an English README keeps both READMEs on the same heading structure.
const pair = ['README.md', 'README.en.md'].map(name => path.join(root, name));
let paired = false;
if (pair.every(file => fs.existsSync(file))) {
  paired = true;
  const levels = file => [...withoutCode(fs.readFileSync(file, 'utf8')).matchAll(/^(#{1,6})[ \t]/gm)].map(match => match[1].length).join(' ');
  if (levels(pair[0]) !== levels(pair[1])) errors.push(`README.md and README.en.md differ in heading structure: ${levels(pair[0])} | ${levels(pair[1])}`);
}
for (const error of errors) console.error(error);
console.log(`${checked} Markdown files; ${errors.length} problems (local link targets and heading anchors${paired ? ', README.md / README.en.md headings' : ''}). Historical archives ${includeArchives ? 'included' : 'excluded (use --local-evidence to include)'}. Does not validate remote URLs or semantic correctness.`);
process.exitCode = errors.length ? 1 : 0;
