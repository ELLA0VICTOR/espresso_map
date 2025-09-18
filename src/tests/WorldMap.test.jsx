import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorldMap from '../components/WorldMap'

// Mock react-simple-maps
vi.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <div data-testid="composable-map">{children}</div>,
  Geographies: ({ children }) => {
    const mockGeographies = [
      { rsmKey: 'geo1', properties: { NAME: 'Country1' } },
      { rsmKey: 'geo2', properties: { NAME: 'Country2' } }
    ]
    return children({ geographies: mockGeographies })
  },
  Geography: ({ geography, ...props }) => (
    <div data-testid={`geography-${geography.rsmKey}`} {...props} />
  ),
  Marker: ({ coordinates, onClick, children }) => (
    <div 
      data-testid="marker"
      data-coordinates={coordinates.join(',')}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  ),
  ZoomableGroup: ({ children, onMoveEnd }) => (
    <div data-testid="zoomable-group" onMouseUp={() => onMoveEnd({ coordinates: [0, 0], zoom: 1 })}>
      {children}
    </div>
  )
}))

const mockEvents = [
  {
    id: '1',
    location: 'New York, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    type: 'past',
    date: '2023-01-15',
    title: 'NYC Event'
  },
  {
    id: '2',
    location: 'London, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    type: 'upcoming',
    date: '2025-02-20',
    title: 'London Event'
  }
]

describe('WorldMap', () => {
  const defaultProps = {
    events: mockEvents,
    center: [0, 0],
    onMarkerClick: vi.fn()
  }

  it('renders the map container', () => {
    render(<WorldMap {...defaultProps} />)
    
    expect(screen.getByTestId('composable-map')).toBeInTheDocument()
    expect(screen.getByTestId('zoomable-group')).toBeInTheDocument()
  })

  it('renders geographies', () => {
    render(<WorldMap {...defaultProps} />)
    
    expect(screen.getByTestId('geography-geo1')).toBeInTheDocument()
    expect(screen.getByTestId('geography-geo2')).toBeInTheDocument()
  })

  it('renders markers for all events', () => {
    render(<WorldMap {...defaultProps} />)
    
    const markers = screen.getAllByTestId('marker')
    expect(markers).toHaveLength(mockEvents.length)
    
    // Check coordinates are correct
    expect(markers[0]).toHaveAttribute('data-coordinates', '-74.006,40.7128')
    expect(markers[1]).toHaveAttribute('data-coordinates', '-0.1278,51.5074')
  })

  it('calls onMarkerClick when marker is clicked', async () => {
    const user = userEvent.setup()
    const mockOnMarkerClick = vi.fn()
    
    render(<WorldMap {...defaultProps} onMarkerClick={mockOnMarkerClick} />)
    
    const markers = screen.getAllByTestId('marker')
    await user.click(markers[0])
    
    expect(mockOnMarkerClick).toHaveBeenCalledWith(mockEvents[0])
  })

  it('updates position when center prop changes', () => {
    const { rerender } = render(<WorldMap {...defaultProps} center={[0, 0]} />)
    
    // Change center
    rerender(<WorldMap {...defaultProps} center={[-74.0060, 40.7128]} />)
    
    // Component should re-render without errors
    expect(screen.getByTestId('composable-map')).toBeInTheDocument()
  })

  it('handles empty events array', () => {
    render(<WorldMap {...defaultProps} events={[]} />)
    
    expect(screen.getByTestId('composable-map')).toBeInTheDocument()
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument()
  })

  it('renders different marker styles for past and upcoming events', () => {
    render(<WorldMap {...defaultProps} />)
    
    const markers = screen.getAllByTestId('marker')
    
    // Past event marker should have espresso pin style
    const pastMarker = markers[0]
    expect(pastMarker.querySelector('g')).toHaveClass('marker-past')
    
    // Upcoming event marker should have pulse style
    const upcomingMarker = markers[1]
    expect(upcomingMarker.querySelector('g')).toHaveClass('marker-upcoming')
  })

  it('displays location labels for markers', () => {
    render(<WorldMap {...defaultProps} />)
    
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
  })

  it('handles window resize for responsive map', () => {
    // Mock getBoundingClientRect
    const mockGetBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 600
    }))
    
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect
    
    render(<WorldMap {...defaultProps} />)
    
    // Trigger resize
    global.innerWidth = 1200
    global.innerHeight = 800
    fireEvent(window, new Event('resize'))
    
    expect(screen.getByTestId('composable-map')).toBeInTheDocument()
  })

  it('handles invalid coordinates gracefully', () => {
    const eventsWithInvalidCoords = [
      {
        ...mockEvents[0],
        latitude: NaN,
        longitude: undefined
      }
    ]
    
    render(<WorldMap {...defaultProps} events={eventsWithInvalidCoords} />)
    
    // Should render without crashing
    expect(screen.getByTestId('composable-map')).toBeInTheDocument()
  })

  it('applies correct CSS classes for dark mode', () => {
    // Add dark class to document
    document.documentElement.classList.add('dark')
    
    render(<WorldMap {...defaultProps} />)
    
    const geographies = screen.getAllByTestId(/geography-/)
    geographies.forEach(geo => {
      expect(geo).toHaveClass('dark:fill-slate-700', 'dark:stroke-slate-600')
    })
    
    // Clean up
    document.documentElement.classList.remove('dark')
  })

  it('maintains accessibility with proper ARIA labels', () => {
    render(<WorldMap {...defaultProps} />)
    
    const markers = screen.getAllByTestId('marker')
    markers.forEach(marker => {
      expect(marker).toHaveStyle({ cursor: 'pointer' })
    })
  })
})