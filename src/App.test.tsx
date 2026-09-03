import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: undefined,
  })
})

describe('ForkRoom product experience', () => {
  it('renders the complete seeded decision workspace', async () => {
    render(<App />)

    expect(screen.getByText('ForkRoom')).toBeInTheDocument()
    expect(screen.getByText(/How should Harbor City spend/)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Cooling Commons/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('main')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.__FORKROOM_DEVTOOLS__?.listTools()).toHaveLength(16)
    })
  })

  it('moves between map, matrix, futures, and audit views through the human UI', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Matrix Expose value judgments/i }))
    expect(screen.getByRole('heading', { name: 'Decision matrix' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Futures Stress-test uncertainty/i }))
    expect(screen.getByRole('heading', { name: 'Possible futures' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Audit Review every change/i }))
    expect(screen.getByRole('heading', { name: 'Decision ledger' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Map See the whole choice/i }))
    expect(screen.getByRole('heading', { name: /leads by/i })).toBeInTheDocument()
  })

  it('shows the protocol design and all tool categories in the visible interface', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /16 tools ready/i }))

    expect(screen.getByRole('dialog', { name: 'The page is the shared tool server' })).toBeInTheDocument()
    expect(screen.getByText('Observe & falsify')).toBeInTheDocument()
    expect(screen.getByText('Stage, never smuggle')).toBeInTheDocument()
    expect(screen.getByText('Share attention')).toBeInTheDocument()
    expect(screen.getByText('forkroom_inspect_decision')).toBeInTheDocument()
    expect(screen.getByText('forkroom_draft_commitment')).toBeInTheDocument()
  })

  it('persists a human value change in browser-local state', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Matrix Expose value judgments/i }))

    const equityWeight = screen.getByRole('slider', { name: 'Weight for Equity' })
    fireEvent.change(equityWeight, { target: { value: '40' } })

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('forkroom:webmcp:decision:v1') ?? '{}')
      expect(stored.criteria.find((criterion: { id: string }) => criterion.id === 'equity').weight).toBe(40)
      expect(stored.revision).toBeGreaterThan(1)
    })
  })
})
