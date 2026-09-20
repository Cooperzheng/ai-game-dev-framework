# AI Game Dev Framework

[简体中文](README.md) | English

**Keep core goals, user requirements, and current game design clear and accessible throughout AI-assisted development.**

The framework provides design context for consistent decisions across tasks, sessions, and agents. The agent chooses how to plan, implement, and verify the work. Plans are entirely optional; there is no mandatory task workflow, acceptance archive, branch policy, or automatic commit requirement.

## Experience defines completion

The requested gameplay, visuals, feel, and explicitly approved reference qualities determine whether the work is complete. Integrating a technology or passing technical tests is not sufficient.

If the user wants thick, layered clouds like a reference image, installing volumetric clouds is only progress. Compare the actual scene under comparable viewing and lighting conditions, then adjust until the requested effect is met. If a constraint prevents success, explain the gap and tradeoffs instead of silently lowering the goal.

A reference applies only within the user's approved scope. Approval of cloud texture does not authorize redesigning terrain or the entire color palette. See the [fictional example](docs/references/WORKED-EXAMPLE.md).

## Documentation entry

| Location | Responsibility |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Working rules, authority boundaries, and required reading triggers |
| [PROJECT](docs/PROJECT.md) | This framework's direction and current state; downstream games keep their own design brief at this path |
| [System guide](docs/systems/README.md) | How to document pure system design |
| [Adoption guide](docs/ADOPTION.md) | Initialization, existing projects, and upgrades |
| [Experience example](docs/references/WORKED-EXAMPLE.md) | Judging completion against actual experience |
| [Changelog](CHANGELOG.md) | Version changes and historical verification scope |

The README documentation entry serves both people and agents. Reuse an equivalent existing overview instead of adding an AI-only duplicate. AGENTS keeps reading triggers and working rules; detailed catalogs, project state, commands, templates, and engineering cases belong in their relevant documents. Preserve applicable constraints when moving content. Technical architecture governs interfaces and engineering limits, not design authorization.

PROJECT and System documents distinguish:

- **Confirmed design:** requirements explicitly approved by the user, with their source and scope. Changes to meaning require alignment.
- **Current AI proposal:** currently adopted design details that the agent can adjust within confirmed boundaries and the authorized task. Explain significant experience changes and their results.

Implementation, technical test success, partial approval, and silence do not imply full design approval. Retain confirmed requirements that are not yet implemented and state the gap honestly. Technical implementation details belong in code comments, existing engineering documentation, or optional work notes.

For example, the user may require active dodging without stamina management. The agent can implement short dodges and longer rolls and tune unconfirmed cooldown values, but cannot introduce stamina on its own.

## Reading and maintenance

Read PROJECT when context is missing or overall direction matters. Before changing design or player-visible behavior, locate and read the relevant System through its project entry; search existing materials if the entry is missing. Reuse only previously read, still-valid content or complete design context already supplied in the conversation.

Update changed requirements and current gameplay in the relevant design location before delivery, including project links for new Systems. Purely technical changes need no design rewrite, and explicit no-write instructions take precedence. Explain outcomes against the original experience goal with observations and remaining gaps. Keep historical work records when useful, but never let them override current design authority. Plans, reports, and evidence folders are optional rather than generated obligations.

If the host does not automatically load AGENTS, explicitly request it or reference it from its supported instructions. Report document adoption separately from verified host loading; if not exercised, mark loading unverified. Initializer and link tests do not prove agent behavior. The framework cannot guarantee automatic compliance by every agent.

At delivery, check the existing documentation entry points against the affected design, running behavior, and evidence scope. Distinguish current passes, failures, unrun checks, historical results, and stale results. Identify tested files and configuration rather than citing HEAD alone for a dirty working tree; retain earlier attempts and recheck affected inputs after changes. Exercise the launch and main entry before handing over a playable build, and explain save implications when data locations change. See the [closeout rules](AGENTS.md#交付收尾与证据一致性).

Checks and hooks remain project choices. Start with reliable scripts before adding advice or limited blocking; do not treat tool errors as passes or force ordinary discussions, honest failure reports, or user interruptions into repeated continuation. The initializer still creates core documents only, without host hooks.

## Adopt into a project

Open the target game project and send:

> Integrate https://github.com/Cooperzheng/ai-game-dev-framework into this project. Read BOOTSTRAP.md first. Focus on experience goals and design consistency: keep project direction and user requirements in PROJECT, pure system design in systems, and distinguish confirmed design from current AI proposals. Preserve valid content, engineering knowledge, and historical records; update references without introducing mandatory Plans or a development workflow. Check the result and report entry points and gaps. Only integrate the framework; do not commit or push.

The [adoption guide](docs/ADOPTION.md) covers new projects, existing projects, and upgrades. Unify core design locations while preserving explicit project agreements. Historical Plans and acceptance records are retained, not rewritten. The framework's own [PROJECT](docs/PROJECT.md) must not become a game's design brief.

## Optional initializer

Git is needed to obtain the repository. The initializer requires Node.js 18+ and has no third-party dependencies.

```sh
git clone https://github.com/Cooperzheng/ai-game-dev-framework.git
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game --apply
```

The first Node command previews changes. Apply accepts only an absent or empty target. Nonempty projects, including one containing only .git, are merged by the agent. Paths are relative to the terminal directory; quote spaces and keep the framework checkout separate.

The tool generates a short project README with documentation links, core documents, the System guide, adoption instructions, and a separate framework license. It does not create Plans, acceptance folders, a reference library, game code, engines, Git repositories, or commits. Fill in actual requirements before declaring adoption complete. Manual adoption is available without Node.

## Maintenance and verification

See [VERSION](VERSION) and [CHANGELOG](CHANGELOG.md). Compare and merge upgrades instead of overwriting design requirements or automatically updating downstream projects.

Framework checks: `node tools/check.mjs`, `node --test tools/adopt.test.mjs`, and a Git diff check. These verify local links and initializer behavior, not gameplay quality, long-term design consistency, or real-project migration.

[MIT License](LICENSE). Third-party references and downstream game assets retain their respective licenses.
