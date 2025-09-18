import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, TrendingUp, Globe, Calendar } from 'lucide-react'

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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4 lg:space-y-6"
    >
      {/* Main Filter Card */}
      <div className="sidebar-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#836854] rounded-xl flex items-center justify-center shadow-lg">
              <Filter size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#836854] dark:text-[#f4f4f5]">
                Filter Events
              </h3>
              <p className="text-sm text-black dark:text-[#c3c3c7]">
                Refine your search
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X size={12} />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        <div className="space-y-6">
          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="search" className="block text-sm font-semibold text-black dark:text-[#f4f4f7] mb-3">
              Search Events
            </label>
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="search"
                type="text"
                placeholder="Search location, title, or description..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="form-input w-full pl-12 pr-4 py-3.5 text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Event Type Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-black dark:text-[#f4f4f5] mb-3">
              Event Type
            </label>
            <div className="space-y-3">
              {Object.entries(eventCounts).map(([type, count]) => (
                <motion.label 
                  key={type} 
                  className="flex items-center group cursor-pointer"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name="eventType"
                      value={type}
                      checked={filters.type === type}
                      onChange={(e) => updateFilter('type', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      filters.type === type
                        ? 'bg-[#836854] border-[#836854] shadow-lg'
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-[#836854]'
                    }`}>
                      {filters.type === type && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex items-center justify-between flex-grow">
                    <span className="text-sm font-medium text-black dark:text-slate-300 capitalize group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      {type === 'all' ? 'All Events' : `${type} Events`}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      type === 'past' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : type === 'upcoming'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {count}
                    </span>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Region Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="region" className="block text-sm font-semibold text-black dark:text-slate-300 mb-3">
              Region
            </label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="form-select w-full"
            >
              <option value="all">🌍 All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
      </div>

      {/* Statistics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sidebar-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#836854] rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold heading-gradient text-[#836854]">
              Event Statistics
            </h3>
            <p className="text-sm text-black dark:text-slate-400">
              Global insights
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-black dark:text-[#c3c3c7]" />
              <span className="text-sm font-medium text-black dark:text-[#c3c3c7]">Total Events</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">{events.length}</span>
          </motion.div>
          
          <motion.div 
            className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Past Events</span>
            </div>
            <span className="font-bold text-lg text-amber-700 dark:text-amber-300">{eventCounts.past}</span>
          </motion.div>
          
          <motion.div 
            className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Upcoming Events</span>
            </div>
            <span className="font-bold text-lg text-emerald-700 dark:text-emerald-300">{eventCounts.upcoming}</span>
          </motion.div>
          
          <motion.div 
            className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Countries</span>
            </div>
            <span className="font-bold text-lg text-blue-700 dark:text-blue-300">{regions.length}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Legend Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sidebar-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#836854] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold heading-gradient text-[#836854]">
              Map Legend
            </h3>
            <p className="text-sm text-black dark:text-slate-400">
              Marker meanings
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            className="flex items-center space-x-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Past Events</span>
              <p className="text-xs text-amber-600 dark:text-amber-400">Completed conferences & meetups</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center shadow-md">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Upcoming Events</span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Future events & registrations</p>
            </div>
          </motion.div>
        </div>
        
        {/* Interaction Tips */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 text-sm">
            💡 Map Tips
          </h4>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>• Click markers for event details</li>
            <li>• Use mouse wheel to zoom</li>
            <li>• Drag to pan around the map</li>
            <li>• Use zoom controls in bottom right</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SearchFilter