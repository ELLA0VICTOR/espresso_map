import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Calendar, MapPin, Clock, Users, ExternalLink, 
  Share2, Download, Globe, Tag, ArrowUpRight 
} from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'

const EventModal = ({ event, isOpen, onClose }) => {
  if (!event) return null

  const isPast = event.type === 'past'
  
  const handleAddToCalendar = () => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000))
    
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
      try {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`)
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
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-700/50"
          >
            {/* Header with Gradient Background */}
            <div className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${
                isPast 
                  ? 'from-amber-500 via-orange-500 to-red-500' 
                  : 'from-emerald-500 via-green-500 to-teal-500'
              } opacity-10`} />
              <div className="relative p-8 border-b border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-colors group"
                  aria-label="Close modal"
                >
                  <X size={24} className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100" />
                </button>

                <div className="flex items-start space-x-4 pr-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      isPast 
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    }`}
                  >
                    <MapPin size={28} className="text-white" />
                  </motion.div>
                  
                  <div className="flex-grow min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                        isPast 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}
                    >
                      {isPast ? '✓ Past Event' : '🚀 Upcoming Event'}
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                      {event.title || 'Espresso Event'}
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center space-x-2 text-slate-600 dark:text-slate-400"
                    >
                      <Globe size={16} />
                      <span className="font-semibold">{event.location}</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 custom-scrollbar overflow-y-auto max-h-[60vh]">
              {/* Event Details Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Date & Time */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Date & Time</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {event.time && (
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Clock size={16} />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Location</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{event.location}</p>
                    {event.venue && (
                      <p className="text-slate-600 dark:text-slate-400">{event.venue}</p>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {typeof event.latitude === 'number' && typeof event.longitude === 'number'
                        ? `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
                        : 'Coordinates unavailable'}
                    </p>
                  </div>
                </div>

                {/* Attendees */}
                {event.attendees && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <Users size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Attendees</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {event.attendees}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">registered participants</p>
                  </div>
                )}

                {/* Organizer */}
                {event.organizer && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                        <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Organizer</h3>
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{event.organizer}</p>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              {event.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>About this Event</span>
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag size={18} className="text-slate-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Event Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                        className="px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-xl border border-blue-200 dark:border-blue-700/50"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-8 pt-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {!isPast && (
                  <Button
                    onClick={handleAddToCalendar}
                    className="btn-primary flex items-center justify-center space-x-2 group"
                  >
                    <Calendar size={18} />
                    <span>Add to Calendar</span>
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                )}
                
                <Button
                  onClick={handleShare}
                  className="btn-secondary flex items-center justify-center space-x-2 group"
                >
                  <Share2 size={18} />
                  <span>Share Event</span>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                
                <Button
                  onClick={handleDirections}
                  className="btn-secondary flex items-center justify-center space-x-2 group"
                >
                  <ExternalLink size={18} />
                  <span>Get Directions</span>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>

              {/* Website Link */}
              {event.website && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50"
                >
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors group"
                  >
                    <Globe size={18} />
                    <span>Visit Official Event Website</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </motion.div>
              )}
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}
export default EventModal