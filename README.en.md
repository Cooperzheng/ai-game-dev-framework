# AI Game Dev Framework

[简体中文](README.md) | English

A lightweight project documentation and agent workflow starter for AI-assisted game development.

Keep confirmed design decisions distinct from provisional scaffolding. Let your agent choose implementation methods within an agreed scope. Keep each major delivery tied to its tested revision, outcome, and evidence.

## What it helps with

An agent builds a playable framework and fills in missing rules. Later, those placeholders can be mistaken for decisions you approved. As iterations accumulate, test results and design notes can also become difficult to trace to a particular version.

This repository provides a working structure for those problems:

- **Design boundaries:** distinguish explicit constraints, approved design, provisional proposals, and placeholders. Implementation status is tracked separately.
- **Autonomous execution:** agents continue from planning through implementation, inspection, fixes, and necessary documentation updates within the authorized scope.
- **Proportionate process:** small fixes need relevant checks, not a full document set. Complex work can use a plan. Major deliveries receive a dated review folder.
- **Traceable outcomes:** record what was tested, the revision and configuration, what passed, and what remains unverified.

It is a documentation and workflow starter. It does not run an AI model, install a game engine, or generate a complete game on its own.

## Ask your agent to integrate it

Open your target game project in an agent that can read and edit local files, then send:

> Integrate https://github.com/Cooperzheng/ai-game-dev-framework into this project. Read BOOTSTRAP.md in the repository first and follow its adoption workflow. Preserve existing design decisions and project rules. For an existing project, map and merge documentation rather than overwriting it. Complete the relevant checks and adoption record, then report the actual entry points and missing information. Only integrate the framework for this task; do not commit or push.

[BOOTSTRAP.md](BOOTSTRAP.md) gives the agent the complete procedure. The operational documents are currently Chinese-first; your agent can translate them while preserving the rules and decision boundaries.

If your agent does not automatically load AGENTS.md, explicitly ask it to read the target project's AGENTS.md or reference it from the agent's supported project instructions. Avoid maintaining separate, conflicting copies. Host permissions and your explicit instructions remain authoritative.

## Initialize a new project manually

Requirements: Git to clone; Node.js 18+ for the optional initializer. There are no third-party Node dependencies. The tests have been run on Windows with Node.js 24.11.1; other platforms and Node.js 18 have not been verified in this release.

```sh
git clone https://github.com/Cooperzheng/ai-game-dev-framework.git
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game
node ai-game-dev-framework/tools/adopt.mjs --target ../my-game --apply
```

The first Node command previews the files. The second writes only to an absent or empty directory. Target paths are relative to your terminal's current directory; quote paths containing spaces. Keep the framework checkout separate from the target project.

The initializer creates documentation, not a game project. It does not initialize Git, install engines, create game code, commit, or push. Fill in the project goals, actual engineering entry points, document mapping, and known constraints before declaring adoption complete.

Without Node.js, follow the manual copy instructions in [the adoption guide](docs/ADOPTION.md). Preserve the framework's license notice separately; do not replace the target project's license or assume its game assets are MIT-licensed.

## Adopt into an existing project

The initializer refuses to write into a nonempty directory, including a directory containing only `.git`. Your agent performs the merge:

1. Read the project's existing rules, design documents, current status, and relevant engineering files.
2. Map framework responsibilities to existing documents. A current design document can fulfill PROJECT; an existing handoff page can fulfill STATUS.
3. Merge applicable agent rules and update their links to the actual paths. Preserve user work and project-specific constraints.
4. Add only missing responsibilities. Do not create a second design authority or status page.
5. Verify the links and record the adopted version, actual entry points, unresolved information, and next step.

An empty game codebase may be ready for documentation-based collaboration while still lacking an engine or runnable build. Report those states separately. See [ADOPTION.md](docs/ADOPTION.md) for the complete procedure and upgrade policy.

## Document structure

```text
AGENTS.md                    # Agent behavior and reading routes
docs/
  PROJECT.md                 # Vision and cross-system design constraints
  STATUS.md                  # Current state and engineering entry points
  systems/                   # Design first; implementation notes second
  plans/
    active/                  # Active and blocked work
    completed/               # Completed, closed-out, or cancelled plans
  acceptance/
    STANDARD.md              # Review and archiving rules
    README.md                # Major delivery index
    YYYY-MM-DD_feature/      # Created for an actual major delivery
      REPORT.md
      REVIEW.md              # Optional independent review
      evidence/
  references/                # Sources and their intended scope
```

Each category has one primary place of maintenance; other documents link to it. Copyable System, Plan, and Report outlines live in the relevant directory guides. Omit sections that do not apply.

## Development workflow

**State the branch approach and design boundaries → plan when needed → implement with matching documentation and early checks → review and close out the delivery → integrate and check the result as agreed.**

Before editing, state whether the work uses a development branch or goes directly onto the mainline, and why. Follow existing agreements without asking again; otherwise, multi-step optimizations default to a development branch, while small fixes may use the mainline. Plans and proposals may precede implementation if clearly marked unimplemented. Commits that change documented behavior include the corresponding documentation updates. Merge code, assets, and documents together, resolve semantic conflicts, and check the integrated result. Being merged, enabled in the normal game entry point, and verified are separate facts. See [AGENTS.md](AGENTS.md) for the operative rules.

| Work | Expected process |
| --- | --- |
| Small, well-defined fix | Execute and run relevant checks; no mandatory standalone plan or delivery folder. |
| Complex internal work | Use a plan when useful; preserve necessary results and handoff information. A plan does not automatically require a major-delivery report. |
| Major feature or explicit stage delivery | Plan, verify the intended experience, and save a dated report with the tested revision and evidence. |

After a major delivery review and documentation sync, create a local commit containing only that work in an existing Git repository, unless the user explicitly says not to. This adopted rule authorizes the local commit, not a push or release. A commit may record a partial or unsuccessful outcome; it is not proof of acceptance. The no-commit instruction in the onboarding prompt applies to that onboarding task only.

Blocked plans remain active with a recovery condition. Closed-out work may be partially successful or unsuccessful; archiving is not a claim that the goal was met. Independent review is required only when the project or user calls for it, and must not be fabricated.

## What has been checked

- Five initializer tests covering preview-only behavior, Unicode/space paths, existing-file preservation and repeat execution, invalid targets, and symlink/junction rejection.
- Local Markdown link checks.
- An independent agent's document review and integration into a temporary existing-project fixture, preserving its original design and license without creating duplicate PROJECT/STATUS pages.
- A fresh GitHub clone of the initial published version passed the initializer tests.

These checks do not demonstrate a complete real-game production cycle or guaranteed compliance by every agent. The [worked example](docs/references/WORKED-EXAMPLE.md) is explicitly fictional. See [current status](docs/STATUS.md) for verification boundaries.

## Updates and contributions

Record the version or commit you adopt. Compare [CHANGELOG.md](CHANGELOG.md) when upgrading, then merge relevant changes; never overwrite project design or historical delivery records with a fresh scaffold.

To check a contribution:

```sh
node tools/check.mjs
node --test tools/adopt.test.mjs
```

Explain the concrete collaboration problem your change addresses. Keep rules conditional and concise; avoid adding mandatory artifacts for every task. The link checker checks ordinary local Markdown targets, not remote URLs, anchors, or semantic consistency.

## License

[MIT](LICENSE). Third-party references and downstream project assets retain their respective licenses.
