import React, { useState, useEffect, useRef } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { motion } from 'framer-motion'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const EspressoPin = ({ className = "" }) => (
  <motion.svg 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  >
    <defs>
      <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="0" dy="2" result="offset"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path 
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      filter="url(#pin-shadow)"
    />
    <circle cx="12" cy="9" r="1.5" fill="white" opacity="0.9"/>
    <path d="M8 16h8v1H8z" opacity="0.4" fill="currentColor"/>
    <path d="M9 17h6v1H9z" opacity="0.2" fill="currentColor"/>
  </motion.svg>
)

const PulseRing = ({ className = "" }) => (
  <motion.svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32"
    className={className}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <motion.circle
      cx="16"
      cy="16"
      r="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.3"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.6, 0.1, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.circle
      cx="16"
      cy="16"
      r="8"
      fill="currentColor"
      opacity="0.8"
      filter="url(#glow)"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <circle cx="16" cy="16" r="4" fill="white" opacity="0.9"/>
  </motion.svg>
)

const WorldMap = ({ events, center, onMarkerClick }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 })
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const [hoveredGeo, setHoveredGeo] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.map-container')
      if (container) {
        const rect = container.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          height: rect.height
        })
      }
    }

    // Initial dimensions
    updateDimensions()
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions)
    const container = document.querySelector('.map-container')
    
    if (container) {
      resizeObserver.observe(container)
    }
    
    // Fallback for older browsers
    window.addEventListener('resize', updateDimensions)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (center && (center[0] !== 0 || center[1] !== 0)) {
      setPosition({
        coordinates: [center[0], center[1]],
        zoom: 4
      })
    }
  }, [center])

  const handleMoveEnd = (position) => {
    setPosition(position)
  }

  // Enhanced geography styles based on theme
  const getGeographyStyle = (geo) => {
    const isHovered = hoveredGeo === geo.rsmKey
    
    if (isDark) {
      return {
        default: {
          fill: "#374151",
          stroke: "#4b5563",
          strokeWidth: 0.75,
          outline: "none",
        },
        hover: {
          fill: "#4b5563",
          stroke: "#6b7280",
          strokeWidth: 1,
          outline: "none",
        },
        pressed: {
          fill: "#6b7280",
          stroke: "#9ca3af",
          strokeWidth: 1.25,
          outline: "none",
        },
      }
    } else {
      return {
        default: {
          fill: isHovered ? "#f1f5f9" : "#f8fafc",
          stroke: "#e2e8f0",
          strokeWidth: 0.75,
          outline: "none",
        },
        hover: {
          fill: "#e2e8f0",
          stroke: "#cbd5e1",
          strokeWidth: 1,
          outline: "none",
        },
        pressed: {
          fill: "#cbd5e1",
          stroke: "#94a3b8",
          strokeWidth: 1.25,
          outline: "none",
        },
      }
    }
  }

  return (
    <div 
      ref={mapRef}
      className="map-container relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        <ComposableMap
          width={dimensions.width}
          height={dimensions.height}
          projectionConfig={{
            scale: Math.min(dimensions.width / 6, dimensions.height / 4),
            center: [0, 0],
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={0.8}
            maxZoom={8}
            translateExtent={[
              [-1000, -500],
              [1000, 500]
            ]}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredGeo(geo.rsmKey)}
                    onMouseLeave={() => setHoveredGeo(null)}
                    style={getGeographyStyle(geo)}
                    className="transition-all duration-200 cursor-pointer"
                  />
                ))
              }
            </Geographies>

            {/* Event Markers */}
            {events.map((event, index) => (
              <Marker
                key={`${event.location}-${index}`}
                coordinates={[event.longitude, event.latitude]}
                onClick={() => onMarkerClick(event)}
                className="cursor-pointer group"
              >
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15 
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={event.type === 'past' ? 'marker-past' : 'marker-upcoming'}
                >
                  {event.type === 'past' ? (
                    <EspressoPin className="drop-shadow-lg" />
                  ) : (
                    <PulseRing className="drop-shadow-lg" />
                  )}
                </motion.g>
                
                {/* City Label */}
                <motion.text
                  textAnchor="middle"
                  y={event.type === 'past' ? 40 : 45}
                  className="fill-slate-700 dark:fill-slate-300 text-sm font-semibold pointer-events-none select-none"
                  style={{ 
                    fontSize: '12px',
                    textShadow: isDark 
                      ? '0 1px 3px rgba(0, 0, 0, 0.5)' 
                      : '0 1px 3px rgba(255, 255, 255, 0.8)'
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {event.location.split(',')[0]}
                </motion.text>
                
                {/* Hover tooltip background */}
                <motion.rect
                  x="-40"
                  y="-60"
                  width="80"
                  height="20"
                  rx="10"
                  fill="rgba(0, 0, 0, 0.8)"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                />
                
                {/* Hover tooltip text */}
                <motion.text
                  textAnchor="middle"
                  y="-47"
                  className="fill-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ fontSize: '10px' }}
                >
                  Click for details
                </motion.text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }))}
          className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
          aria-label="Zoom in"
        >
          <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 0.8) }))}
          className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
          aria-label="Zoom out"
        >
          <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPosition({ coordinates: [0, 0], zoom: 1 })}
          className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
          aria-label="Reset view"
        >
          <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        </motion.button>
      </div>

      {/* Event count indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20 dark:border-slate-700/50"
      >
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {events.length} Events Mapped
        </div>
      </motion.div>
    </div>
  )
}

export default WorldMap