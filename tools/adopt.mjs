import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function fail(message) { console.error(message); process.exit(1); }
if (args.includes('--help')) {
  console.log('node tools/adopt.mjs --target <directory> [--apply]\nDefault: preview. Apply requires an absent or empty target. Existing projects: docs/ADOPTION.md.');
  process.exit(0);
}
let targetArg; let apply = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1] && !args[i + 1].startsWith('--')) targetArg = args[++i];
  else if (args[i] === '--apply') apply = true;
  else fail(`Unknown or incomplete argument: ${args[i]}`);
}
if (!targetArg) fail('Missing --target. Use --help.');
const target = path.resolve(targetArg);
// Refuse links anywhere in the destination chain. Never follow a junction to write elsewhere.
let cursor = target;
while (true) {
  if (fs.existsSync(cursor) || (() => { try { fs.lstatSync(cursor); return true; } catch { return false; } })()) {
    const stat = fs.lstatSync(cursor);
    if (stat.isSymbolicLink()) fail(`Destination contains a symlink/junction: ${cursor}`);
    if (!stat.isDirectory()) fail(`Destination component is not a directory: ${cursor}`);
  }
  const parent = path.dirname(cursor); if (parent === cursor) break; cursor = parent;
}
const relative = path.relative(root, target);
if (relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative))) fail('Target must be outside the framework checkout.');
const occupied = fs.existsSync(target) && fs.readdirSync(target).length > 0;
const files = [
  'AGENTS.md', 'docs/README.md', 'docs/PROJECT.md', 'docs/ADOPTION.md',
  'docs/systems/README.md', 'docs/plans/README.md', 'docs/acceptance/README.md',
  'docs/acceptance/STANDARD.md'
];
// Read all sources before any mutation.
const payload = new Map(files.map(name => [name, fs.readFileSync(path.join(root, name), 'utf8')]));
payload.set('docs/FRAMEWORK-LICENSE.txt', fs.readFileSync(path.join(root, 'LICENSE'), 'utf8'));
const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
payload.set('docs/references/README.md', '# 参考资料\n\n按需记录参考资料来源、用途、许可和用户认可范围。生成参考与实机证据分别标识。\n');
payload.set('docs/STATUS.md', `# 当前状态\n\n## 框架接入\n\n- 框架版本：${version}；来源 commit/下载来源：待记录（本地未发布副本须注明）。\n- 文档接入：骨架已生成，尚待核实填写。\n- 文档映射：项目目标 [PROJECT](PROJECT.md)；系统 [systems](systems/README.md)；计划 [plans](plans/README.md)；验收 [规范](acceptance/STANDARD.md) 与 [索引](acceptance/README.md)。\n\n## 项目与工程入口\n\n- 当前阶段与运行版本：待填写。\n- 正式目录、引擎/运行时及版本：待核实。\n- 启动与检查命令：待核实；无工程时标明尚未初始化。\n- 发布/付费/审核/预算等边界：按实际授权记录，未约定不推定。\n\n## 缺口与下一步\n\n完成 PROJECT 与工程入口核实；按 [接入指南](ADOPTION.md) 检查后更新接入结论。尚未进行游戏验收。\n`);
payload.set('docs/plans/active/.gitkeep', '');
payload.set('docs/plans/completed/.gitkeep', '');
console.log(`Target: ${target}\nMode: ${apply ? 'apply' : 'preview'}\nFramework: ${version}`);
if (occupied) {
  console.log('Existing project: preserve all content. Agent must map and merge using docs/ADOPTION.md.');
  if (apply) fail('Refused: --apply only supports absent or empty targets. No files changed.');
  process.exit(0);
}
for (const name of payload.keys()) console.log(`CREATE ${name}`);
if (!apply) { console.log('Preview only; nothing written.'); process.exit(0); }
// Exclusive writes prevent overwriting any file created concurrently; a failure may leave a partial skeleton.
try {
  fs.mkdirSync(target, { recursive: true });
  if (fs.readdirSync(target).length) fail('Target became nonempty; stopped before copying.');
  for (const [name, body] of payload) {
    const dest = path.join(target, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, body, { encoding: 'utf8', flag: 'wx' });
  }
  console.log('Skeleton created. Complete docs/ADOPTION.md before claiming adoption complete. No Git/engine operations performed.');
} catch (error) { fail(`Stopped without overwriting existing files. Inspect any partial skeleton before retrying: ${error.message}`); }
