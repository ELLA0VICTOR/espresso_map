import React, { useState, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const EspressoPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    <circle cx="12" cy="9" r="1.5" fill="white"/>
    <path d="M8 16h8v1H8z" opacity="0.6"/>
    <path d="M9 17h6v1H9z" opacity="0.4"/>
  </svg>
)

const PulseRing = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-pulse-ring"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="currentColor"
      opacity="0.8"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="white"
    />
  </svg>
)

const WorldMap = ({ events, center, onMarkerClick }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 })
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.map-container')
      if (container) {
        const rect = container.getBoundingClientRect()
        setDimensions({
          width: Math.max(rect.width, 400),
          height: Math.max(rect.height, 300)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (center && (center[0] !== 0 || center[1] !== 0)) {
      setPosition({
        coordinates: [center[0], center[1]],
        zoom: 3
      })
    }
  }, [center])

  const handleMoveEnd = (position) => {
    setPosition(position)
  }

  return (
    <div className="map-container">
      <ComposableMap
        width={dimensions.width}
        height={dimensions.height}
        projectionConfig={{
          scale: 120,
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={0.8}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#f0f9ff"
                  stroke="#e0f2fe"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      fill: "#f0f9ff",
                      stroke: "#e0f2fe",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#e0f2fe",
                      stroke: "#bae6fd",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#bae6fd",
                      stroke: "#7dd3fc",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                  className="dark:fill-slate-700 dark:stroke-slate-600"
                />
              ))
            }
          </Geographies>

          {events.map((event, index) => (
            <Marker
              key={`${event.location}-${index}`}
              coordinates={[event.longitude, event.latitude]}
              onClick={() => onMarkerClick(event)}
              style={{ cursor: 'pointer' }}
            >
              <g className={event.type === 'past' ? 'marker-past' : 'marker-upcoming'}>
                {event.type === 'past' ? <EspressoPin /> : <PulseRing />}
              </g>
              <text
                textAnchor="middle"
                y={35}
                className="fill-gray-700 dark:fill-gray-300 text-xs font-medium"
                style={{ fontSize: '10px', pointerEvents: 'none' }}
              >
                {event.location.split(',')[0]}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

export default WorldMap