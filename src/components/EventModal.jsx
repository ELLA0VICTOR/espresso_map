import React from 'react'
import { X, Calendar, MapPin, Clock, Users, ExternalLink, Share2, Download } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'

const EventModal = ({ event, isOpen, onClose }) => {
  if (!event) return null

  const isPast = event.type === 'past'
  
  const handleAddToCalendar = () => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)) // 2 hours later
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title || `Espresso Event - ${event.location}`)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description || 'Espresso community event')}`
    
    window.open(calendarUrl, '_blank')
  }

  const handleShare = async () => {
    const shareData = {
      title: `Espresso Event - ${event.location}`,
      text: event.description || `Join us for an Espresso event in ${event.location}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`)
        // Provide user feedback without being intrusive
        // (use a nicer toast in production)
        alert('Event link copied to clipboard!')
      } catch (err) {
        console.log('Clipboard write failed', err)
      }
    }
  }

  const handleDirections = () => {
    const query = encodeURIComponent(event.location)
    const mapsUrl = `https://maps.google.com/maps?q=${query}`
    window.open(mapsUrl, '_blank')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full ${
                isPast ? 'bg-espresso-500' : 'bg-coffee-500 animate-pulse'
              }`}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {event.title || `Espresso Event`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {event.location}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Status */}
          <div
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              isPast 
                ? 'bg-espresso-100 text-espresso-800 dark:bg-espresso-900 dark:text-espresso-200' 
                : 'bg-coffee-100 text-coffee-800 dark:bg-coffee-900 dark:text-coffee-200'
            }`}
          >
            {isPast ? 'Past Event' : 'Upcoming Event'}
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <Calendar size={20} className="text-gray-500" />
              <div>
                <p className="font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {event.time && (
                  <p className="text-sm text-gray-500">{event.time}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <MapPin size={20} className="text-gray-500" />
              <div>
                <p className="font-medium">{event.location}</p>
                <p className="text-sm text-gray-500">
                  {typeof event.latitude === 'number' && typeof event.longitude === 'number'
                    ? `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
                    : 'Coordinates unavailable'}
                </p>
              </div>
            </div>

            {event.attendees && (
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Users size={20} className="text-gray-500" />
                <p className="font-medium">{event.attendees} attendees</p>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                About this Event
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Highlights/Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Event Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            {!isPast && (
              <Button
                onClick={handleAddToCalendar}
                variant="primary"
                className="flex items-center justify-center space-x-2"
              >
                <Calendar size={16} />
                <span>Add to Calendar</span>
              </Button>
            )}
            
            <Button
              onClick={handleShare}
              variant="secondary"
              className="flex items-center justify-center space-x-2"
            >
              <Share2 size={16} />
              <span>Share</span>
            </Button>
            
            <Button
              onClick={handleDirections}
              variant="secondary"
              className="flex items-center justify-center space-x-2"
            >
              <ExternalLink size={16} />
              <span>Directions</span>
            </Button>
          </div>

          {/* Additional Info */}
          {event.website && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coffee-600 hover:text-coffee-700 dark:text-coffee-400 dark:hover:text-coffee-300 text-sm font-medium"
              >
                Visit event website →
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default EventModal
