import { readFile, writeFile } from 'node:fs/promises'

const applicationCommit = '27feefffa5e88e83aa256af96e1cb37453bfcc94'
const files = [
  'README.md',
  'PLAN.md',
  'docs/ADVERSARIAL_REVIEW.md',
  'docs/DEMO_SCRIPT.md',
  'docs/JUDGE_CARD.md',
  'docs/SUBMISSION.md',
  'docs/VERIFICATION.md',
]

const replacements = [
  ['24 deterministic tests', '25 deterministic tests'],
  ['24 passing deterministic tests', '25 passing deterministic tests'],
  ['24 passing tests', '25 passing tests'],
  ['24 tests', '25 tests'],
  ['24 passed across 4 files', '25 passed across 4 files'],
  ['all 24 deterministic tests', 'all 25 deterministic tests'],
]

for (const path of files) {
  let content = await readFile(path, 'utf8')
  for (const [before, after] of replacements) content = content.replaceAll(before, after)

  if (path === 'docs/VERIFICATION.md') {
    content = content
      .replace(
        '| Verified source commit | `26a22c2be01405b64bdaf862b850e03a52803644` |',
        `| Protocol-driven application commit | \`${applicationCommit}\` |`,
      )
      .replace(
        '| Live branch source receipt | `26a22c2be01405b64bdaf862b850e03a52803644` |',
        '| Live branch source receipt | Read `live/SOURCE_COMMIT`; publication rewrites it only after all gates pass. |',
      )
      .replace(
        '| Standard verification workflow | Run `33771487027` — success |',
        '| Standard verification workflow | Latest **Verify ForkRoom** run must be green. |',
      )
      .replace(
        '| Verified live publication workflow | Run `33771487073` — success |',
        '| Verified live publication workflow | Latest **Publish live judge build** run must be green. |',
      )
      .replace(
        'At the verified source commit listed above, every term was true.',
        'For every release commit, both workflows must be green and `live/SOURCE_COMMIT` must equal that release commit before the artifact is treated as current.',
      )
  }

  if (path === 'docs/ADVERSARIAL_REVIEW.md') {
    content = content.replace(
      'At commit `26a22c2be01405b64bdaf862b850e03a52803644`, the automated code and deployment gates above passed. Documentation and final packaging are maintained as subsequent main-branch commits and are themselves required to pass the unchanged verification workflows.',
      `At application commit \`${applicationCommit}\`, the Judge demo itself was upgraded to execute the real WebMCP handlers, and a 25th integration test proved the resulting challenge remains pending. Final release commits remain acceptable only when the unchanged verification and publication workflows both pass.`,
    )
  }

  await writeFile(path, content)
}

console.log(`Updated release evidence for the 25-test protocol-driven application at ${applicationCommit}.`)
