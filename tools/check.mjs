import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const args = process.argv.slice(2);
const includeArchives = args.includes('--local-evidence');
const root = path.resolve(args.find(arg => arg !== '--local-evidence') || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
let checked = 0; const errors = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const full = path.join(dir, item.name);
    const relative = path.relative(root, full).split(path.sep).join('/');
    if (!includeArchives && (relative === 'docs/acceptance' || (relative.startsWith('docs/plans/') && relative !== 'docs/plans/README.md'))) continue;
    if (item.isSymbolicLink()) continue;
    if (item.isDirectory()) walk(full);
    else if (item.name.endsWith('.md')) {
      checked++;
      const text = fs.readFileSync(full, 'utf8').replace(/```[\s\S]*?```/g, '');
      for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
        const ref = match[1];
        if (/^(https?:|mailto:|#)/.test(ref)) continue;
        const name = ref.split('#')[0];
        if (name && !fs.existsSync(path.resolve(dir, decodeURIComponent(name)))) errors.push(`${path.relative(root, full)} -> ${ref}`);
      }
    }
  }
}
walk(root);
for (const error of errors) console.error(error);
console.log(`${checked} Markdown files; ${errors.length} missing local link targets. Historical archives ${includeArchives ? 'included' : 'excluded (use --local-evidence to include)'}. Does not validate remote URLs, anchors, or semantic correctness.`);
process.exitCode = errors.length ? 1 : 0;
