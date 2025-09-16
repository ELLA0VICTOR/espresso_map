import React from 'react'
import { Search, Filter, X } from 'lucide-react'

const SearchFilter = ({ filters, onFiltersChange, events }) => {
  const regions = [...new Set(events.map(event => 
    event.location.split(',').pop().trim()
  ))].sort()

  const eventCounts = {
    all: events.length,
    past: events.filter(e => e.type === 'past').length,
    upcoming: events.filter(e => e.type === 'upcoming').length
  }

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      type: 'all',
      region: 'all',
      search: ''
    })
  }

  const hasActiveFilters = filters.type !== 'all' || filters.region !== 'all' || filters.search

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Filter size={18} />
            <span>Filters</span>
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
            >
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Events
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Search by location or title..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-espresso-500 focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Event Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Type
            </label>
            <div className="space-y-2">
              {Object.entries(eventCounts).map(([type, count]) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="eventType"
                    value={type}
                    checked={filters.type === type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className="mr-3 text-espresso-500 focus:ring-espresso-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {type} ({count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Region
            </label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-espresso-500 focus:border-transparent"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Event Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Events</span>
            <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Past Events</span>
            <span className="font-semibold text-espresso-600">{eventCounts.past}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</span>
            <span className="font-semibold text-coffee-600">{eventCounts.upcoming}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Countries</span>
            <span className="font-semibold text-gray-900 dark:text-white">{regions.length}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Map Legend
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-espresso-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Past Events</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-coffee-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Upcoming Events</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter