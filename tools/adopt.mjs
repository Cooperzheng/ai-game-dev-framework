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
const files = ['AGENTS.md', 'docs/ADOPTION.md', 'docs/systems/README.md'];
// Read all sources before any mutation. Never copy framework state into a game.
const payload = new Map(files.map(name => [name, fs.readFileSync(path.join(root, name), 'utf8')]));
payload.set('docs/FRAMEWORK-LICENSE.txt', fs.readFileSync(path.join(root, 'LICENSE'), 'utf8'));
const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
payload.set('README.md', `# 游戏项目

项目名称与简介待填写；当前仅生成文档骨架，尚无游戏运行入口。

## 文档入口

人和 AI 共用此入口，按任务读取，不另建重复目录。

| 内容 | 入口与职责 |
|---|---|
| 工作规则 | [AGENTS](AGENTS.md)：工作边界与阅读触发条件 |
| 项目方向 | [PROJECT](docs/PROJECT.md)：核心体验、要求与系统入口 |
| 系统设计 | [系统说明](docs/systems/README.md)：已确认设计与 AI 当前方案 |
| 框架接入 | [接入指南](docs/ADOPTION.md)：初始化、升级与完成检查 |

已有运行说明、技术架构、工程实践或验收记录时，在这里补入真实入口；不预建空文档，不在目录复制正文。
`);
payload.set('docs/PROJECT.md', `# 项目白皮书

## 已确认的项目方向
目标玩家、核心体验、核心循环、用户要求与排除项：待核实。
只记录用户明确确认的内容，注明来源与认可范围；占位不是确认设计。

## AI 当前整体方案
当前采用但未经明确确认的整体设计：待填写。
在已确认边界与任务范围内可自主调整，重要体验变化说明原因与结果。

## 系统设计入口
按需链接已有 System；每个系统区分已确认设计与 AI 当前方案，不预建空正文。

## AI 维护的接续信息
当前阶段、关键缺口和下一步：待核实，仅保留有用信息。
运行与工程入口：待核实；尚无工程时如实注明。

## 框架接入
- 框架版本：${version}；来源 commit/下载来源：待记录，本地未发布副本须注明。
- 骨架已生成，尚待核实填写；按 [接入指南](ADOPTION.md) 完成内容检查。
`);


console.log(`Target: ${target}\nMode: ${apply ? 'apply' : 'preview'}\nFramework: ${version}`);
if (occupied) {
  console.log('Existing project: Agent must migrate and merge valid content into the framework layout using docs/ADOPTION.md.');
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
