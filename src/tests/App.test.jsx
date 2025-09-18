import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import eventsData from '../../data/events.json'

// Mock the espresso client
vi.mock('../lib/espressoClient', () => ({
  espressoClient: {
    getEvents: vi.fn().mockResolvedValue(null) // Will fallback to local data
  }
}))

// Mock react-simple-maps components
vi.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <div data-testid="composable-map">{children}</div>,
  Geographies: ({ children, geography }) => children({ geographies: [] }),
  Geography: (props) => <div data-testid="geography" {...props} />,
  Marker: ({ children, onClick }) => (
    <div data-testid="marker" onClick={onClick}>
      {children}
    </div>
  ),
  ZoomableGroup: ({ children }) => <div data-testid="zoomable-group">{children}</div>
}))

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Mock window.location
    delete window.location
    window.location = {
      origin: 'http://localhost:3000',
      href: 'http://localhost:3000'
    }
  })

  it('renders the main components', async () => {
    render(<App />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Check main elements are rendered
    expect(screen.getByText('Espresso World Map')).toBeInTheDocument()
    expect(screen.getByText('Global Event Map')).toBeInTheDocument()
    expect(screen.getByText('Event Timeline')).toBeInTheDocument()
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('displays events from local data when API fails', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Should show the count of events
    expect(screen.getByText(`${eventsData.events.length} events found`)).toBeInTheDocument()
    
    // Should show some event locations
    expect(screen.getByText('Denver')).toBeInTheDocument()
    expect(screen.getByText('Seoul')).toBeInTheDocument()
  })

  it('filters events by type', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Filter to show only past events
    const pastRadio = screen.getByRole('radio', { name: /past \(\d+\)/ })
    await user.click(pastRadio)

    await waitFor(() => {
      // Should show reduced count (only past events)
      const pastEvents = eventsData.events.filter(e => e.type === 'past').length
      expect(screen.getByText(`${pastEvents} events found`)).toBeInTheDocument()
    })
  })

  it('searches events by location', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Search for "USA"
    const searchInput = screen.getByPlaceholderText('Search by location or title...')
    await user.type(searchInput, 'USA')

    await waitFor(() => {
      // Should show only USA events
      const usaEvents = eventsData.events.filter(e => 
        e.location.toLowerCase().includes('usa')
      ).length
      expect(screen.getByText(`${usaEvents} events found`)).toBeInTheDocument()
    })
  })

  it('toggles dark mode', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Initially should not have dark class
    expect(document.documentElement).not.toHaveClass('dark')

    // Click dark mode toggle
    const darkModeButton = screen.getByLabelText('Toggle dark mode')
    await user.click(darkModeButton)

    // Should add dark class
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('darkMode')).toBe('true')
  })

  it('opens embed modal', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Click embed button
    const embedButton = screen.getByRole('button', { name: 'Embed' })
    await user.click(embedButton)

    // Should open embed modal
    expect(screen.getByText('Embed Espresso Map')).toBeInTheDocument()
    expect(screen.getByText('Add this interactive map to your website')).toBeInTheDocument()
  })

  it('handles event selection from map', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Click on a marker (mock)
    const markers = screen.getAllByTestId('marker')
    if (markers.length > 0) {
      await user.click(markers[0])

      // Should open event modal
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    }
  })

  it('clears filters correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Apply some filters
    const pastRadio = screen.getByRole('radio', { name: /past \(\d+\)/ })
    await user.click(pastRadio)

    const searchInput = screen.getByPlaceholderText('Search by location or title...')
    await user.type(searchInput, 'Denver')

    // Clear filters
    const clearButton = screen.getByText('Clear')
    await user.click(clearButton)

    // Should reset to all events
    await waitFor(() => {
      expect(screen.getByText(`${eventsData.events.length} events found`)).toBeInTheDocument()
      expect(searchInput).toHaveValue('')
      expect(screen.getByRole('radio', { name: /all \(\d+\)/ })).toBeChecked()
    })
  })

  it('displays event statistics correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // Check statistics are displayed
    expect(screen.getByText('Event Statistics')).toBeInTheDocument()
    
    const totalEvents = eventsData.events.length
    const pastEvents = eventsData.events.filter(e => e.type === 'past').length
    const upcomingEvents = eventsData.events.filter(e => e.type === 'upcoming').length
    
    expect(screen.getByText(totalEvents.toString())).toBeInTheDocument()
    expect(screen.getByText(pastEvents.toString())).toBeInTheDocument()
    expect(screen.getByText(upcomingEvents.toString())).toBeInTheDocument()
  })

  it('handles responsive layout', async () => {
    // Mock window resize
    global.innerWidth = 768
    global.dispatchEvent(new Event('resize'))

    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Espresso events...')).not.toBeInTheDocument()
    })

    // App should render without errors on mobile viewport
    expect(screen.getByText('Espresso World Map')).toBeInTheDocument()
  })
})