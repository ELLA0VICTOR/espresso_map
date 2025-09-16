import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react'

const EventCard = ({ event, isSelected, onClick }) => {
  const isPast = event.type === 'past'
  
  return (
    <div
      className={`event-card min-w-[280px] flex-shrink-0 ${
        isSelected ? 'ring-2 ring-espresso-500' : ''
      }`}
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(event)
        }
      }}
      aria-label={`View details for ${event.location} event`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isPast ? 'bg-espresso-500' : 'bg-coffee-500 animate-pulse'
          }`} />
          <span className={`text-xs font-medium uppercase tracking-wider ${
            isPast ? 'text-espresso-700' : 'text-coffee-700'
          }`}>
            {event.type}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <MapPin size={16} className="text-gray-500" />
          <h3 className="font-semibold text-sm">{event.location}</h3>
        </div>

        {event.title && (
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {event.title}
          </p>
        )}

        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          {event.time && (
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{event.time}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            {event.attendees ? `${event.attendees} attendees` : 'Click for details'}
          </span>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  )
}

const EventStrip = ({ events, onEventSelect, selectedEvent }) => {
  const scrollRef = useRef(null)
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const sortedEvents = [...events].sort((a, b) => {
    // Upcoming events first (by date), then past events (by date desc)
    if (a.type !== b.type) {
      return a.type === 'upcoming' ? -1 : 1
    }
    
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    if (a.type === 'upcoming') {
      return dateA - dateB // Ascending for upcoming
    } else {
      return dateB - dateA // Descending for past
    }
  })

  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p>No events found matching your filters</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 hover:shadow-lg transition-shadow"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 hover:shadow-lg transition-shadow"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      {/* Event strip */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide p-4 pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedEvents.map((event, index) => (
          <EventCard
            key={`${event.location}-${index}`}
            event={event}
            isSelected={selectedEvent?.location === event.location}
            onClick={onEventSelect}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
    </div>
  )
}

export default EventStrip