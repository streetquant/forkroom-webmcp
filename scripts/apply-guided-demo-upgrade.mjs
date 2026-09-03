import { readFile, writeFile } from 'node:fs/promises'

const appPath = 'src/App.tsx'
const testPath = 'src/App.test.tsx'

let app = await readFile(appPath, 'utf8')

const helperAnchor = `function activityId(): string {
  return globalThis.crypto?.randomUUID?.() ?? \`activity-\${Date.now()}-\${Math.random().toString(36).slice(2)}\`
}

function App() {
`

const helperReplacement = `function activityId(): string {
  return globalThis.crypto?.randomUUID?.() ?? \`activity-\${Date.now()}-\${Math.random().toString(36).slice(2)}\`
}

async function executeForkRoomTool(name: string, input: Record<string, unknown> = {}): Promise<unknown> {
  const developerSurface = window.__FORKROOM_DEVTOOLS__
  if (!developerSurface) throw new Error('ForkRoom tools are still starting. Try the demo again.')
  return developerSurface.execute(name, input)
}

function App() {
`

const oldDemo = `  const runGuidedDemo = useCallback(() => {
    if (demoPhase > 0) return
    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    setDemoPhase(1)
    navigate('futures')

    const phaseTwo = window.setTimeout(() => {
      setDemoPhase(2)
      const duplicate = stateRef.current.proposals.some(
        (proposal) => proposal.status === 'pending' && proposal.payload.demo_marker === 'matching-funds-challenge',
      )
      if (!duplicate) {
        stageProposal({
          kind: 'assumption-challenge',
          title: 'Challenge assumption · matching funds arrive on time',
          rationale:
            'The grid option is highly exposed to a funding event with only 42% confidence; testing this dependency could change the preferred portfolio.',
          payload: {
            assumption_id: 'matching',
            counterpoint:
              'The latest grant cycle slipped twice, so construction invoices may arrive before reimbursement and force scope reduction.',
            revised_confidence: 28,
            previous_confidence: 42,
            test:
              'Ask the grants office for a written disbursement milestone; pre-authorize a no-match fallback before procurement.',
            demo_marker: 'matching-funds-challenge',
          },
        })
      }
    }, 650)

    const phaseThree = window.setTimeout(() => {
      setDemoPhase(3)
      navigate('audit')
    }, 1450)

    const finish = window.setTimeout(() => {
      setDemoPhase(0)
      notify('Demo complete: inspect the proposal, then approve or reject it.', 'success')
    }, 3300)

    demoTimersRef.current = [phaseTwo, phaseThree, finish]
  }, [demoPhase, navigate, notify, stageProposal])
`

const newDemo = `  const runGuidedDemo = useCallback(() => {
    if (demoPhase > 0) return
    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    setDemoPhase(1)

    void (async () => {
      try {
        await executeForkRoomTool('forkroom_inspect_decision', { detail: 'analysis' })
        await executeForkRoomTool('forkroom_focus_view', { view: 'futures' })
      } catch (error) {
        navigate('futures')
        notify(error instanceof Error ? error.message : 'Could not start the tool-guided demo.', 'warning')
      }
    })()

    const phaseTwo = window.setTimeout(() => {
      setDemoPhase(2)
      void (async () => {
        try {
          await executeForkRoomTool('forkroom_find_fragile_assumptions', { limit: 1 })
          const duplicate = stateRef.current.proposals.some(
            (proposal) =>
              proposal.status === 'pending' &&
              proposal.kind === 'assumption-challenge' &&
              proposal.payload.assumption_id === 'matching',
          )
          if (!duplicate) {
            await executeForkRoomTool('forkroom_challenge_assumption', {
              assumption_id: 'matching',
              counterpoint:
                'The latest grant cycle slipped twice, so construction invoices may arrive before reimbursement and force scope reduction.',
              revised_confidence: 28,
              test:
                'Ask the grants office for a written disbursement milestone; pre-authorize a no-match fallback before procurement.',
              rationale:
                'The grid option is highly exposed to a funding event with only 42% confidence; testing this dependency could change the preferred portfolio.',
            })
          }
        } catch (error) {
          setDemoPhase(0)
          notify(error instanceof Error ? error.message : 'The agent tool sequence could not complete.', 'warning')
        }
      })()
    }, 650)

    const phaseThree = window.setTimeout(() => {
      setDemoPhase(3)
      void executeForkRoomTool('forkroom_focus_view', { view: 'audit' }).catch(() => navigate('audit'))
    }, 1450)

    const finish = window.setTimeout(() => {
      setDemoPhase(0)
      notify('Demo complete: the real WebMCP tool path staged a proposal for your judgment.', 'success')
    }, 3300)

    demoTimersRef.current = [phaseTwo, phaseThree, finish]
  }, [demoPhase, navigate, notify])
`

if (!app.includes('async function executeForkRoomTool(')) {
  if (!app.includes(helperAnchor)) throw new Error('Could not locate the App helper anchor.')
  app = app.replace(helperAnchor, helperReplacement)
}
if (!app.includes("await executeForkRoomTool('forkroom_find_fragile_assumptions'")) {
  if (!app.includes(oldDemo)) throw new Error('Could not locate the original guided demo block.')
  app = app.replace(oldDemo, newDemo)
}
await writeFile(appPath, app)

let test = await readFile(testPath, 'utf8')
const testName = 'runs the judge demo through real tool handlers and preserves the approval boundary'
if (!test.includes(testName)) {
  const closingIndex = test.lastIndexOf('\n})\n')
  if (closingIndex < 0) throw new Error('Could not locate the App test-suite closing block.')
  const newTest = `

  it('${testName}', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Judge demo' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Decision ledger' })).toBeInTheDocument()
    }, { timeout: 3_000 })

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('forkroom:webmcp:decision:v1') ?? '{}')
      const proposal = stored.proposals.find(
        (candidate: { kind: string; payload: { assumption_id?: string } }) =>
          candidate.kind === 'assumption-challenge' && candidate.payload.assumption_id === 'matching',
      )
      const assumption = stored.assumptions.find((candidate: { id: string }) => candidate.id === 'matching')
      expect(proposal?.status).toBe('pending')
      expect(assumption?.challenged).toBe(false)
    }, { timeout: 3_000 })

    expect(screen.getByText('challenge_assumption')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Approve/i }).length).toBeGreaterThan(0)
  })`
  test = `${test.slice(0, closingIndex)}${newTest}${test.slice(closingIndex)}`
}
await writeFile(testPath, test)

console.log('Upgraded Judge demo to the real WebMCP tool path and added an approval-boundary integration test.')
