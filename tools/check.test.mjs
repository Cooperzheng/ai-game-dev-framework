import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const tools = path.dirname(fileURLToPath(import.meta.url));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'game-framework-check-'));
// The fixtures are kept for inspection only when a test fails.
process.on('exit', code => { if (code === 0) fs.rmSync(temp, { recursive: true, force: true }); else console.log(`Fixtures kept: ${temp}`); });
const check = target => spawnSync(process.execPath, [path.join(tools, 'check.mjs'), target], { encoding: 'utf8' });
function project(name, files) {
  const root = path.join(temp, name);
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  }
  return root;
}

test('heading anchors follow GitHub slugs, including Chinese, punctuation, code and repeats', () => {
  const root = project('anchors', {
    'docs/a.md': '# 文档\n## 工具链（`tools/`）\n## 结果\n## 结果\n## Delivery and closeout\n<a id="custom"></a>\n',
    'README.md': '[a](docs/a.md#工具链tools) [b](docs/a.md#结果-1) [c](docs/a.md#delivery-and-closeout) [d](docs/a.md#custom) [e](#本页)\n## 本页\n',
  });
  const result = check(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('a missing heading fails, in another file or the same one', () => {
  assert.equal(check(project('missing heading', { 'a.md': '# A\n', 'README.md': '[a](a.md#nothing)\n' })).status, 1);
  assert.equal(check(project('missing same-file heading', { 'README.md': '# A\n[a](#nothing)\n' })).status, 1);
});

test('headings and links inside code do not count', () => {
  assert.equal(check(project('fenced heading', { 'a.md': '```markdown\n## Hidden\n```\n', 'README.md': '[a](a.md#hidden)\n' })).status, 1);
  assert.equal(check(project('code link', { 'README.md': 'Write links as `[text](missing.md)`.\n```\n[x](missing.md)\n```\n' })).status, 0);
});

test('README.md and README.en.md keep the same heading structure', () => {
  assert.equal(check(project('same readmes', { 'README.md': '# 框架\n## 接入\n', 'README.en.md': '# Framework\n## Adopt\n' })).status, 0);
  const result = check(project('different readmes', { 'README.md': '# 框架\n## 接入\n', 'README.en.md': '# Framework\n## Adopt\n## Extra\n' }));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /heading structure/);
  assert.equal(check(project('only chinese readme', { 'README.md': '# 框架\n## 接入\n' })).status, 0);
});
