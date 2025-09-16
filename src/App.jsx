import React, { useState, useEffect } from 'react'
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
    type: 'all', // all, past, upcoming
    region: 'all',
    search: ''
  })
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)

  useEffect(() => {
    loadEvents()
    
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
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

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type)
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.region.toLowerCase())
      )
    }

    // Search filter
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-espresso-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Espresso events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-espresso-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Espresso World Map
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="px-4 py-2 text-sm bg-coffee-500 text-white rounded-md hover:bg-coffee-600 transition-colors"
              >
                Embed
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilter
              filters={filters}
              onFiltersChange={setFilters}
              events={events}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* World Map */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Global Event Map
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredEvents.length} events found
                </p>
              </div>
              <div className="p-4">
                <WorldMap
                  events={filteredEvents}
                  center={mapCenter}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>

            {/* Event Timeline Strip */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Event Timeline
                </h2>
              </div>
              <EventStrip
                events={filteredEvents}
                onEventSelect={handleEventSelect}
                selectedEvent={selectedEvent}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Embed Modal */}
      {showEmbed && (
        <EmbedCode
          isOpen={showEmbed}
          onClose={() => setShowEmbed(false)}
        />
      )}
    </div>
  )
}

export default App