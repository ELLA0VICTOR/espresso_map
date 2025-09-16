/**
 * Map utility functions
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - First point latitude
 * @param {number} lon1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lon2 - Second point longitude
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  /**
   * Get optimal zoom level based on events spread
   * @param {Array} events - Array of events with lat/lng
   * @returns {number} Zoom level
   */
  export function getOptimalZoom(events) {
    if (events.length === 0) return 1
    if (events.length === 1) return 6
  
    const lats = events.map(e => e.latitude)
    const lngs = events.map(e => e.longitude)
    
    const latSpread = Math.max(...lats) - Math.min(...lats)
    const lngSpread = Math.max(...lngs) - Math.min(...lngs)
    const maxSpread = Math.max(latSpread, lngSpread)
  
    if (maxSpread > 100) return 1
    if (maxSpread > 50) return 2
    if (maxSpread > 20) return 3
    if (maxSpread > 10) return 4
    if (maxSpread > 5) return 5
    return 6
  }
  
  /**
   * Get center point of multiple events
   * @param {Array} events - Array of events with lat/lng
   * @returns {Array} [longitude, latitude]
   */
  export function getCenterPoint(events) {
    if (events.length === 0) return [0, 0]
    
    const avgLat = events.reduce((sum, e) => sum + e.latitude, 0) / events.length
    const avgLng = events.reduce((sum, e) => sum + e.longitude, 0) / events.length
    
    return [avgLng, avgLat]
  }
  
  /**
   * Group events by proximity
   * @param {Array} events - Array of events
   * @param {number} threshold - Distance threshold in km
   * @returns {Array} Array of event groups
   */
  export function groupEventsByProximity(events, threshold = 50) {
    const groups = []
    const processed = new Set()
  
    events.forEach((event, index) => {
      if (processed.has(index)) return
  
      const group = [event]
      processed.add(index)
  
      events.forEach((otherEvent, otherIndex) => {
        if (otherIndex === index || processed.has(otherIndex)) return
  
        const distance = calculateDistance(
          event.latitude, event.longitude,
          otherEvent.latitude, otherEvent.longitude
        )
  
        if (distance <= threshold) {
          group.push(otherEvent)
          processed.add(otherIndex)
        }
      })
  
      groups.push(group)
    })
  
    return groups
  }
  
  /**
   * Convert coordinates to readable location string
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Formatted coordinate string
   */
  export function formatCoordinates(lat, lng) {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lngDir = lng >= 0 ? 'E' : 'W'
    
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`
  }
  
  /**
   * Check if coordinates are valid
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} True if valid
   */
  export function isValidCoordinate(lat, lng) {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    )
  }
  
  /**
   * Get country from coordinates (basic implementation)
   * This is a simplified version - in production you'd use a proper geocoding service
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Country name estimate
   */
  export function getCountryFromCoordinates(lat, lng) {
    // Very basic continent/region mapping
    if (lat > 45 && lng > -10 && lng < 60) return 'Europe'
    if (lat > 25 && lat < 50 && lng > -125 && lng < -65) return 'North America'
    if (lat > -40 && lat < 12 && lng > -85 && lng < -30) return 'South America'
    if (lat > -35 && lat < 40 && lng > 95 && lng < 180) return 'Asia-Pacific'
    if (lat > -35 && lat < 40 && lng > 20 && lng < 55) return 'Africa'
    
    return 'Unknown'
  }
  
  /**
   * Generate unique color for event markers
   * @param {string} id - Event ID
   * @returns {string} CSS color value
   */
  export function generateMarkerColor(id) {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const hue = hash % 360
    return `hsl(${hue}, 70%, 50%)`
  }
  
  /**
   * Animate map transition
   * @param {Function} setPosition - Position setter function
   * @param {Array} from - Starting [lng, lat, zoom]
   * @param {Array} to - Target [lng, lat, zoom]
   * @param {number} duration - Animation duration in ms
   */
  export function animateMapTransition(setPosition, from, to, duration = 1000) {
    const start = Date.now()
    const [fromLng, fromLat, fromZoom] = from
    const [toLng, toLat, toZoom] = to
  
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-in-out)
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
  
      const currentLng = fromLng + (toLng - fromLng) * eased
      const currentLat = fromLat + (toLat - fromLat) * eased
      const currentZoom = fromZoom + (toZoom - fromZoom) * eased
  
      setPosition({
        coordinates: [currentLng, currentLat],
        zoom: currentZoom
      })
  
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
  
    requestAnimationFrame(animate)
  }