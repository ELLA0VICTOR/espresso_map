import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorldMap from './components/WorldMap'
import EventStrip from './components/EventStrip'
import SearchFilter from './components/SearchFilter'
import EventModal from './components/EventModal'
import EmbedCode from './components/EmbedCode'
import { espressoClient } from './lib/espressoClient'
import eventsData from '../data/events.json'

function App() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mapCenter, setMapCenter] = useState([0, 0])
  const [filters, setFilters] = useState({
    type: 'all',
    region: 'all',
    search: ''
  })
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  
  useEffect(() => {
    loadEvents()
  
    const stored = localStorage.getItem('darkMode')
    let isDark = false // default -> light
  
    if (stored !== null) {
      isDark = stored === 'true'
    }
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])
  


  useEffect(() => {
    applyFilters()
  }, [events, filters])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const apiEvents = await espressoClient.getEvents()
      setEvents(apiEvents || eventsData.events)
    } catch (error) {
      console.warn('API unavailable, using local data:', error)
      setEvents(eventsData.events)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...events]

    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type)
    }

    if (filters.region !== 'all') {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.region.toLowerCase())
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(searchLower) ||
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredEvents(filtered)
  }

  const handleEventSelect = (event) => {
    setSelectedEvent(event)
    setMapCenter([event.longitude, event.latitude])
  }

  const handleMarkerClick = (event) => {
    setSelectedEvent(event)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-espresso-200 border-t-espresso-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-coffee-200 border-t-coffee-500 rounded-full animate-spin mx-auto opacity-60" style={{animationDelay: '0.5s'}}></div>
          </div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold heading-gradient mb-2"
          >
            Loading Espresso Events
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 dark:text-slate-400 font-medium"
          >
            Brewing the perfect map experience...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ebe6e7] dark:bg-gray-900 transition-colors">
      {/* Enhanced Header */}
      <header className="relative bg-[#ebe6e7] dark:bg-gray-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
           
              <div className='flex items-center space-x-3'>
                <img src="src/assets/espresso-logo.png"
                
                alt='Espresso Logo'
                width={150}
                height={150}/>
              </div>
              
              
           
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="px-4 py-2 bg-white/90 hover:bg-gray-100 text-[#5c3a21] border border-[#5c3a21] rounded-lg font-medium transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Embed
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-white/90 hover:bg-gray-100 transition-all duration-200 border border-[#5c3a21]"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-[#5c3a21]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#5c3a21]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content Container - Centered and Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl screens */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-1 order-2 xl:order-1"
          >
            <div className="sticky top-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <SearchFilter
                filters={filters}
                onFiltersChange={setFilters}
                events={events}
              />
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3 order-1 xl:order-2 space-y-6"
          >
            {/* Mobile Filters - Only shown on mobile */}
            <div className="xl:hidden">
              <SearchFilter
                filters={filters}
                onFiltersChange={setFilters}
                events={events}
              />
            </div>

            {/* World Map Section */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
              <div className="p-4 lg:p-6 border-b border-white/20 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#836854] dark:text-[#f4f4f5]  mb-1">
                      Global Event Map
                    </h2>
                    <p className=" font-medium text-sm lg:text-base text-black dark:text-[#c3c3c7]">
                      {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} worldwide
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-xs lg:text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                        <span className="text-slate-600 dark:text-slate-400">Past Events</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>
                        <span className="text-slate-600 dark:text-slate-400">Upcoming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:p-6">
                <div className="w-full h-[500px] lg:h-[600px] map-container rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                  <WorldMap
                    events={filteredEvents}
                    center={mapCenter}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              </div>
            </div>

            {/* Event Timeline Section */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
              <div className="p-4 lg:p-6 border-b border-white/20 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold bg-[#836854] dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                      Event Timeline
                    </h2>
                    <p className="text-black dark:text-[#f4f4f5] font-medium text-sm lg:text-base">
                      Chronological view of all events
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative bg-white dark:bg-slate-800">
                <EventStrip
                  events={filteredEvents}
                  onEventSelect={handleEventSelect}
                  selectedEvent={selectedEvent}
                />
              </div>
            </div>
          </motion.main>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        {showEmbed && (
          <EmbedCode
            isOpen={showEmbed}
            onClose={() => setShowEmbed(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App