import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'

const EventCard = ({ event, isSelected, onClick, index }) => {
  const isPast = event.type === 'past'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.4, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      className={`event-card relative group ${
        isSelected ? 'ring-2 ring-blue-500/50 shadow-2xl' : ''
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
      style={{ minWidth: '280px', maxWidth: '320px' }}
      aria-label={`View details for ${event.location} event`}
    >
      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`w-4 h-4 rounded-full ${
              isPast ? 'bg-amber-500' : 'bg-emerald-500'
            } shadow-lg`}
            animate={!isPast ? {
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0.4)",
                "0 0 0 8px rgba(16, 185, 129, 0)",
                "0 0 0 0 rgba(16, 185, 129, 0)"
              ]
            } : {}}
            transition={!isPast ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          />
          <span className={`status-${event.type} text-xs font-bold`}>
            {event.type.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="space-y-4">
        {/* Location Header */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-[#836854] rounded-lg flex items-center justify-center shadow-md">
            <MapPin size={16} className="text-white" />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
              {event.location}
            </h3>
            {event.title && (
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {event.title}
              </p>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm text-black dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center space-x-2">
                <Clock size={14} className="flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            )}
          </div>

          {event.attendees && (
            <div className="flex items-center space-x-2 text-sm">
              <Users size={14} className="text-slate-500" />
              <span className="font-semibold text-black dark:text-slate-300">
                {event.attendees} attendees
              </span>
            </div>
          )}

          {event.description && (
            <p className="text-sm text-black dark:text-slate-400 line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-md">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="text-xs text-black dark:text-slate-400 font-medium">
            Click for details
          </div>
          <motion.div
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400"
            animate={{ x: [0, 4, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}

const ScrollButton = ({ direction, onClick, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    disabled={disabled}
    className={`absolute ${
      direction === 'left' ? 'left-4' : 'right-4'
    } top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg rounded-full border border-white/30 dark:border-slate-700/30 flex items-center justify-center transition-all duration-200 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'
    }`}
    aria-label={`Scroll ${direction}`}
  >
    {direction === 'left' ? (
      <ChevronLeft size={20} className="text-slate-700 dark:text-slate-300" />
    ) : (
      <ChevronRight size={20} className="text-slate-700 dark:text-slate-300" />
    )}
  </motion.button>
)

const EventStrip = ({ events, onEventSelect, selectedEvent }) => {
  const scrollRef = useRef(null)
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 360
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const sortedEvents = [...events].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'upcoming' ? -1 : 1
    }
    
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    if (a.type === 'upcoming') {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-12 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
          <Calendar size={32} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          No Events Found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          No events match your current filters. Try adjusting your search criteria or clearing filters.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="relative py-6">
      {/* Scroll Buttons */}
      <ScrollButton direction="left" onClick={() => scroll('left')} />
      <ScrollButton direction="right" onClick={() => scroll('right')} />

      {/* Event Strip */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide px-6 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedEvents.map((event, index) => (
          <EventCard
            key={`${event.location}-${event.date}-${index}`}
            event={event}
            index={index}
            isSelected={selectedEvent?.location === event.location && selectedEvent?.date === event.date}
            onClick={onEventSelect}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-slate-800 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-slate-800 to-transparent pointer-events-none z-10" />
    </div>
  )
}

export default EventStrip