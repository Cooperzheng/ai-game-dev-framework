# AI Game Dev Framework

[简体中文](README.md) | English

**Keep AI-assisted development aligned with the game you want to make.**

Once the prototype runs, keeping the design on track gets harder: a new session needs another explanation, temporary AI decisions become assumed requirements, and finished features still fall short of the intended feel or visuals.

This lightweight set of documents and collaboration rules keeps game goals, confirmed design, and current AI proposals in the project. It gives ongoing development a reference to reduce drift and repeated explanations. Built for solo developers and small teams iterating on games with AI, it supports new and existing projects without tying you to an engine or model.

[Adopt into a project](#adopt-into-a-project) · [Adoption guide](docs/ADOPTION.md) · [Example](docs/references/WORKED-EXAMPLE.md)

## When to use it

| Situation | Common problem | What the framework provides |
| --- | --- | --- |
| Iterating beyond the prototype | Rewards, values, and rules added to make the prototype run become assumed design decisions | A distinction between confirmed requirements and provisional proposals, leaving room to refine the design |
| Starting a new session or switching agents | Design decisions are scattered through chats; constraints get missed and discussions repeat | An entry point to the current design for the next round of work |
| Refining gameplay, feel, and visuals | Features and tests pass, but the experience still falls short | Explicit experience goals and reference scope, with delivery checked against actual results and remaining gaps |

## Adopt into a project

Open the target game project and send this to your AI agent:

> Integrate https://github.com/Cooperzheng/ai-game-dev-framework into this project. Read BOOTSTRAP.md first. Preserve valid design, engineering knowledge, and historical records. Keep game goals and user requirements in PROJECT, each module's design and implementation together under docs/modules, and distinguish confirmed design from current AI proposals. Check and report the adoption result and whether the host loads the rules. Only integrate the framework; do not commit or push.

For existing projects, follow the [adoption guide](docs/ADOPTION.md) and preserve their constraints. Initial adoption requires organizing existing design material. Afterward, the agent is instructed to maintain changes while the designer mainly confirms goals and important tradeoffs.

## How it works

| Location | Responsibility |
| --- | --- |
| [AGENTS.md](AGENTS.md) | When to read design, how to maintain requirements, and how to judge completion |
| docs/PROJECT.md | The game's core experience, overall direction, and user requirements |
| docs/modules/<module>/DESIGN.md | Player experience, rules, controls, and confirmed scope |
| IMPLEMENTATION.md in the same module (when needed) | Implementation, parameters, authoring, module checks, and current results |
| docs/engineering/, standards/, references/, release/, local/ | Shared engineering, standards, references, release inputs, and local records |

PROJECT and module design documents distinguish:

- **Confirmed design:** what you explicitly requested or approved, with its source and scope. Changes to its meaning require alignment.
- **Current AI proposal:** design details the agent can refine within its authorized scope. Implementation, passing tests, and silence do not imply approval.

For example, you require active dodging without stamina management. The agent can propose dodges and rolls and tune unconfirmed cooldowns, but cannot introduce stamina on its own. Subsequent work reads these requirements first and writes design changes back to the documents.

Create module documents once they have content, with design and implementation in the same folder (names may be localized). Plans remain optional. See the [organization rules](docs/standards/README.md#按模块组织项目文档).

## Check delivery against the experience

If you request thick clouds like those in a reference image, integrating volumetric clouds is implementation progress. The agent should also compare shape, depth, and texture against the reference and explain remaining gaps. Approving cloud texture does not authorize redesigning terrain or the entire color palette.

The [fictional example](docs/references/WORKED-EXAMPLE.md) illustrates the rules; it is not evidence of measured results. [Delivery and closeout](AGENTS.md#交付与收尾) covers playable entry checks, and the [acceptance standard](docs/standards/acceptance.md#交付) separates tested versions from historical results.

The [acceptance standard](docs/standards/acceptance.md) covers validation, delivery, retention, and cleanup. Routine delivery stays brief. After a round, keep only the user's material and what the round's plan says to keep (the plan sets how much); everything else is temporary and is listed and deleted at closeout. Checks follow the change; snapshots, copies, and reports are not defaults.

## Optional: initialize an empty project

Requires Git and Node.js 18+, with no third-party dependencies:

```sh
git clone https://github.com/Cooperzheng/ai-game-dev-framework.git
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game --apply
```

The first Node command previews changes; `--apply` accepts only an absent or empty target. Paths are relative to the terminal directory. Quote paths containing spaces and keep the framework checkout separate from the game. Agents merge nonempty projects using the adoption guide; manual adoption is available without Node.

The tool generates document scaffolding from the templates in `tools/templates/`, not game code or an engine installation. Fill in real design requirements to complete adoption. This repository's [PROJECT](docs/PROJECT.md) describes the framework itself and must not be used as the game's design brief.

## Document entry points

Use the [shared framework directory](README.md#文档入口) for adoption, module templates, standards, references, and version information. Generated games receive their own README with links to their actual modules.

## Limits and maintenance

The framework provides accessible design context; it cannot guarantee that every agent follows it. If the host does not automatically load AGENTS, explicitly request it or reference it from the host's rules. Check document adoption and rule loading separately, as the [adoption guide](docs/ADOPTION.md#完成检查) describes. Operational documents are currently Chinese-first.

Maintenance checks: `node tools/check.mjs` (local links, heading anchors, and matching headings in the Chinese and English READMEs) and `node --test tools/adopt.test.mjs tools/check.test.mjs`. These verify document links and initializer behavior, not gameplay quality or long-term design consistency.

[Version](VERSION) · [Changes and verification](CHANGELOG.md) · [MIT License](LICENSE). Merge upgrades by comparing changes. Third-party references and game assets retain their own licenses.

If this framework helps you, consider giving it a star so you can find it again.
