import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventStrip from '../components/EventStrip'

const mockEvents = [
  {
    id: '1',
    location: 'New York, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    date: '2023-01-15T10:00:00.000Z',
    time: '10:00 AM EST',
    type: 'past',
    title: 'NYC Meetup',
    description: 'Great networking event in Manhattan',
    attendees: 150
  },
  {
    id: '2',
    location: 'Tokyo, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    date: '2025-03-20T14:00:00.000Z',
    time: '2:00 PM JST',
    type: 'upcoming',
    title: 'Tokyo Summit',
    description: 'Annual blockchain conference',
    attendees: null
  },
  {
    id: '3',
    location: 'London, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    date: '2023-12-10T16:00:00.000Z',
    time: '4:00 PM GMT',
    type: 'past',
    title: 'London Workshop',
    description: 'Technical deep dive session'
  }
]

describe('EventStrip', () => {
  const defaultProps = {
    events: mockEvents,
    onEventSelect: vi.fn(),
    selectedEvent: null
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all event cards', () => {
    render(<EventStrip {...defaultProps} />)
    
    expect(screen.getByText('NYC Meetup')).toBeInTheDocument()
    expect(screen.getByText('Tokyo Summit')).toBeInTheDocument()
    expect(screen.getByText('London Workshop')).toBeInTheDocument()
  })

  it('displays events sorted with upcoming first, then past by date', () => {
    render(<EventStrip {...defaultProps} />)
    
    const eventCards = screen.getAllByRole('button')
    
    // Should have upcoming events first
    expect(eventCards[0]).toHaveTextContent('Tokyo Summit')
    expect(eventCards[0]).toHaveTextContent('upcoming')
  })

  it('calls onEventSelect when event card is clicked', async () => {
    const user = userEvent.setup()
    const mockOnEventSelect = vi.fn()
    
    render(<EventStrip {...defaultProps} onEventSelect={mockOnEventSelect} />)
    
    const firstCard = screen.getAllByRole('button')[0]
    await user.click(firstCard)
    
    expect(mockOnEventSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Tokyo Summit' })
    )
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    const mockOnEventSelect = vi.fn()
    
    render(<EventStrip {...defaultProps} onEventSelect={mockOnEventSelect} />)
    
    const firstCard = screen.getAllByRole('button')[0]
    firstCard.focus()
    
    // Press Enter
    await user.keyboard('{Enter}')
    expect(mockOnEventSelect).toHaveBeenCalled()
    
    // Press Space
    vi.clearAllMocks()
    await user.keyboard(' ')
    expect(mockOnEventSelect).toHaveBeenCalled()
  })

  it('highlights selected event card', () => {
    const selectedEvent = mockEvents[0]
    
    render(<EventStrip {...defaultProps} selectedEvent={selectedEvent} />)
    
    const selectedCard = screen.getByRole('button', { name: /NYC Meetup/ })
    expect(selectedCard).toHaveClass('ring-2', 'ring-espresso-500')
  })

  it('displays correct event type indicators', () => {
    render(<EventStrip {...defaultProps} />)
    
    // Check for past event indicator
    expect(screen.getAllByText('past')).toHaveLength(2)
    expect(screen.getByText('upcoming')).toBeInTheDocument()
    
    // Check for visual indicators (dots)
    const pastDots = document.querySelectorAll('.bg-espresso-500')
    const upcomingDots = document.querySelectorAll('.bg-coffee-500')
    
    expect(pastDots).toHaveLength(2)
    expect(upcomingDots).toHaveLength(1)
  })

  it('formats dates correctly', () => {
    render(<EventStrip {...defaultProps} />)
    
    // Should show formatted dates
    expect(screen.getByText('Jan 2023')).toBeInTheDocument()
    expect(screen.getByText('Mar 2025')).toBeInTheDocument()
    expect(screen.getByText('Dec 2023')).toBeInTheDocument()
  })

  it('shows attendee count when available', () => {
    render(<EventStrip {...defaultProps} />)
    
    expect(screen.getByText('150 attendees')).toBeInTheDocument()
    expect(screen.getByText('Click for details')).toBeInTheDocument() // For event without attendee count
  })

  it('handles empty events array', () => {
    render(<EventStrip {...defaultProps} events={[]} />)
    
    expect(screen.getByText('No events found matching your filters')).toBeInTheDocument()
    expect(screen.getByTestId('Calendar')).toBeInTheDocument() // Empty state icon
  })

  it('handles scroll navigation', async () => {
    const user = userEvent.setup()
    
    // Mock scrollBy method
    const mockScrollBy = vi.fn()
    Element.prototype.scrollBy = mockScrollBy
    
    render(<EventStrip {...defaultProps} />)
    
    // Click left scroll button
    const leftButton = screen.getByLabelText('Scroll left')
    await user.click(leftButton)
    
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: -300,
      behavior: 'smooth'
    })
    
    // Click right scroll button
    const rightButton = screen.getByLabelText('Scroll right')
    await user.click(rightButton)
    
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 300,
      behavior: 'smooth'
    })
  })

  it('displays event descriptions with proper truncation', () => {
    render(<EventStrip {...defaultProps} />)
    
    expect(screen.getByText('Great networking event in Manhattan')).toBeInTheDocument()
    expect(screen.getByText('Annual blockchain conference')).toBeInTheDocument()
    expect(screen.getByText('Technical deep dive session')).toBeInTheDocument()
  })

  it('shows time information when available', () => {
    render(<EventStrip {...defaultProps} />)
    
    expect(screen.getByText('10:00 AM EST')).toBeInTheDocument()
    expect(screen.getByText('2:00 PM JST')).toBeInTheDocument()
    expect(screen.getByText('4:00 PM GMT')).toBeInTheDocument()
  })

  it('applies correct accessibility attributes', () => {
    render(<EventStrip {...defaultProps} />)
    
    const eventCards = screen.getAllByRole('button')
    
    eventCards.forEach(card => {
      expect(card).toHaveAttribute('tabIndex', '0')
      expect(card).toHaveAttribute('aria-label')
    })
  })

  it('handles events with missing optional fields gracefully', () => {
    const minimalEvents = [
      {
        id: '1',
        location: 'Test City',
        latitude: 0,
        longitude: 0,
        date: '2023-01-01T00:00:00.000Z',
        type: 'past'
        // Missing: title, description, time, attendees
      }
    ]
    
    render(<EventStrip {...defaultProps} events={minimalEvents} />)
    
    expect(screen.getByText('Test City')).toBeInTheDocument()
    expect(screen.getByText('Click for details')).toBeInTheDocument()
  })

  it('maintains horizontal scroll behavior', () => {
    render(<EventStrip {...defaultProps} />)
    
    const scrollContainer = document.querySelector('[style*="scrollbar"]')
    expect(scrollContainer).toHaveStyle({
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    })
  })
})