# AI Game Dev Framework · AI 游戏开发框架

简体中文 | [English](README.en.md)

A project documentation and agent workflow starter for AI-assisted game development.

让人决定体验与设计边界，让 Agent 自主推进实现，并为每次大功能交付留下可回查的版本、结论和证据。适用于新游戏和已有项目，不要求特定引擎、模型或插件。

## 让 AI 自动接入

在目标项目中打开你使用的 AI Agent，把下面这段话发给它：

> 请将 https://github.com/Cooperzheng/ai-game-dev-framework 接入当前项目。先读取仓库根目录 BOOTSTRAP.md，按其中流程下载、检查并实施接入；已有项目保留原规则和设计，通过映射合并，不覆盖文件。完成必要验证与接入记录，报告实际入口和仍缺少的信息。本次只接入框架，不提交或推送。

[BOOTSTRAP.md](BOOTSTRAP.md) 是 Agent 的完整接入入口。它指导 Agent 在授权范围内执行到文档接入完成，不只返回一份建议。已有项目的自动化由 Agent 完成语义合并，初始化脚本只负责新项目。

## 手动启动初始化工具

需要 Git；自动初始化可选使用 Node.js 18+，无第三方依赖。不会安装引擎、创建游戏代码、提交或推送。

```sh
git clone https://github.com/Cooperzheng/ai-game-dev-framework.git
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game --apply
```

首条 node 命令只预览；第二条只允许写入不存在或空的目标目录。已有项目会拒绝自动写入，避免生成重复文档或覆盖约束；请按 [已有项目接入](docs/ADOPTION.md) 由 Agent 映射、合并。路径含空格时加引号；目标路径相对当前终端目录解析，不相对框架目录解析。框架下载目录与目标游戏目录应分开。

没有 Node.js 时按接入指南手动复制。任一方式都必须完成项目目标、文档映射、实际运行命令与权限边界的核实，复制完成不等于完成接入。

如果 Agent 不自动加载 AGENTS.md，在其项目规则入口中显式引用或要求它先读取该文件；不要维护两份独立的通用规则副本。框架文字不能绕过宿主工具权限。

## 项目结构

```text
AGENTS.md                  # Agent 规则与文档路由
docs/
  PROJECT.md               # 项目目标与设计边界
  STATUS.md                # 当前状态与工程入口
  systems/                 # 系统设计在前，实现说明在后
  plans/active/            # 进行中与阻塞的计划
  plans/completed/         # 已结束的计划
  acceptance/              # 验收规范、索引、日期_功能交付目录
  references/              # 参考来源与适用范围
```

BOOTSTRAP、维护工具和示例属于框架分发内容，不必完整复制到游戏项目。

## 日常使用

“改善驾驶起停手感” → 确认设计边界 → 必要的 Plan → 实现和早期验证 → 大功能验收 → 更新系统、状态与索引。

小修保持轻量；框架占位不自动变成已确认设计；验收失败可以如实收束。大功能验收及文档同步后默认本地 commit，只纳入本次工作；push 另需授权。示例接入提示中的“不提交”只限制该次接入任务。

| 内容 | 入口 |
| --- | --- |
| Agent 操作规则 | [AGENTS.md](AGENTS.md) |
| 新建、已有项目与升级 | [接入指南](docs/ADOPTION.md) |
| 项目文档结构 | [文档导航](docs/README.md) |
| 完整虚构流程示例 | [示例](docs/references/WORKED-EXAMPLE.md) |
| 当前版本与验证范围 | [状态](docs/STATUS.md) |
| 更新记录 | [CHANGELOG](CHANGELOG.md) |

系统设计和实现共用主文档，设计在前；计划按 active/completed 管理；大功能验收存入 `docs/acceptance/YYYY-MM-DD_功能简介/`。各目录说明内含可直接复制的骨架，不增加另一套模板目录。

## 维护与复用

版本见 [VERSION](VERSION)。采用明确版本/commit；升级比较规则差异，保留项目内容和历史验收，不自动同步。提交贡献前运行 `node tools/check.mjs` 和 `node --test tools/adopt.test.mjs`，说明解决的实际协作问题，避免添加无触发条件的强制流程。

许可证见 [MIT License](LICENSE)。引用的第三方资料和下游项目资产按各自许可处理。
