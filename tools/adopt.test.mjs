import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const tools = path.dirname(fileURLToPath(import.meta.url));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'game-framework-test-'));
// Preserve fixtures for inspection; every run uses its own OS temporary directory.
console.log(`Fixtures: ${temp}`);
const run = (...args) => spawnSync(process.execPath, [path.join(tools, 'adopt.mjs'), ...args], { encoding: 'utf8' });
test('preview has no filesystem effects', () => {
  const target = path.join(temp, 'preview');
  assert.equal(run('--target', target).status, 0);
  assert.equal(fs.existsSync(target), false);
});
test('new project with Unicode and spaces has complete local routes', () => {
  const target = path.join(temp, '新游戏 project');
  assert.equal(run('--target', target, '--apply').status, 0);
  const check = spawnSync(process.execPath, [path.join(tools, 'check.mjs'), target], { encoding: 'utf8' });
  assert.equal(check.status, 0, check.stdout + check.stderr);
  const project = fs.readFileSync(path.join(target, 'docs/PROJECT.md'), 'utf8');
  assert.ok(project.includes('尚待核实'));
  assert.ok(project.includes('已确认的项目方向'));
  assert.ok(project.includes('AI 当前整体方案'));
  assert.equal(project.includes('7a9cad3'), false, 'framework state must not leak into a new game');
  assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8').includes('(docs/PROJECT.md)'), true);
  assert.match(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), /交付收尾与证据一致性/);
  const agents = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
  const readme = fs.readFileSync(path.join(target, 'README.md'), 'utf8');
  assert.ok(agents.includes('(README.md#文档入口)'));
  assert.match(readme, /## 文档入口/);
  assert.ok(readme.includes('(docs/PROJECT.md)'));
  assert.ok(readme.includes('尚无游戏运行入口'));
  assert.equal(readme.includes('Cooperzheng/ai-game-dev-framework'), false, 'framework README must not leak into a new game');
  assert.ok(agents.includes('(docs/standards/ui.md)'));
  assert.ok(readme.includes('(docs/standards/README.md)'));
  assert.match(fs.readFileSync(path.join(target, 'docs/standards/ui.md'), 'utf8'), /无明确用途/);
  assert.equal(fs.existsSync(path.join(target, '.agents/skills')), false, 'standards must not install skills');
  assert.equal(fs.existsSync(path.join(target, '.codex')), false, 'adoption must not install host hooks');
  for (const obsolete of ['docs/STATUS.md', 'docs/README.md', 'docs/acceptance', 'docs/references', 'docs/plans']) {
    assert.equal(fs.existsSync(path.join(target, obsolete)), false, obsolete);
  }
  assert.equal(fs.existsSync(path.join(target, '.git')), false);
  assert.equal(fs.existsSync(path.join(target, 'LICENSE')), false);
  assert.ok(fs.existsSync(path.join(target, 'docs/FRAMEWORK-LICENSE.txt')));
  assert.equal(fs.existsSync(path.join(target, 'tools')), false);
  assert.equal(fs.existsSync(path.join(target, 'docs/references/WORKED-EXAMPLE.md')), false);
  const before = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
  assert.notEqual(run('--target', target, '--apply').status, 0);
  assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), before);
});
test('existing project is preserved byte for byte', () => {
  const target = path.join(temp, 'existing'); fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'AGENTS.md'), 'User rules\n');
  fs.writeFileSync(path.join(target, 'game.js'), 'existing code');
  fs.writeFileSync(path.join(target, 'README.md'), 'Existing project overview\n');
  assert.equal(run('--target', target).status, 0);
  assert.notEqual(run('--target', target, '--apply').status, 0);
  assert.deepEqual(fs.readdirSync(target).sort(), ['AGENTS.md', 'README.md', 'game.js']);
  assert.equal(fs.readFileSync(path.join(target, 'README.md'), 'utf8'), 'Existing project overview\n');
  assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), 'User rules\n');
  assert.equal(fs.readFileSync(path.join(target, 'game.js'), 'utf8'), 'existing code');
});
test('reject invalid arguments and a file as destination', () => {
  assert.notEqual(run('--apply').status, 0);
  assert.notEqual(run('--target', path.join(temp, 'unused'), '--force').status, 0);
  const target = path.join(temp, 'file'); fs.writeFileSync(target, 'keep');
  assert.notEqual(run('--target', target, '--apply').status, 0);
  assert.equal(fs.readFileSync(target, 'utf8'), 'keep');
});
test('refuse framework destination and junction/symlink destination', () => {
  assert.notEqual(run('--target', path.resolve(tools, '..'), '--apply').status, 0);
  const real = path.join(temp, 'real'); fs.mkdirSync(real);
  const link = path.join(temp, 'link'); fs.symlinkSync(real, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.notEqual(run('--target', path.join(link, 'child'), '--apply').status, 0);
  assert.deepEqual(fs.readdirSync(real), []);
});
