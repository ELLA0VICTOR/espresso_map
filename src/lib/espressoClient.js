/**
 * Espresso API Client
 * Handles communication with the Espresso API
 */

class EspressoClient {
    constructor() {
      this.baseUrl = import.meta.env.VITE_ESPRESSO_API_URL || process.env.ESPRESSO_API_URL || null
      this.timeout = 5000 // 5 seconds
    }
  
    async makeRequest(endpoint, options = {}) {
      if (!this.baseUrl) {
        throw new Error('Espresso API URL not configured')
      }
  
      const url = `${this.baseUrl}${endpoint}`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
  
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
  
        clearTimeout(timeoutId)
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        return await response.json()
      } catch (error) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error('Request timed out')
        }
        throw error
      }
    }
  
    async getEvents() {
      try {
        const response = await this.makeRequest('/events')
        
        // Validate and transform the response
        if (response && Array.isArray(response.events)) {
          return response.events.map(this.transformEvent)
        } else if (Array.isArray(response)) {
          return response.map(this.transformEvent)
        }
        
        throw new Error('Invalid API response format')
      } catch (error) {
        console.warn('Failed to fetch events from API:', error.message)
        return null // Let the app fall back to local data
      }
    }
  
    async getEvent(id) {
      try {
        const response = await this.makeRequest(`/events/${id}`)
        return this.transformEvent(response)
      } catch (error) {
        console.warn(`Failed to fetch event ${id}:`, error.message)
        return null
      }
    }
  
    async searchEvents(query) {
      try {
        const response = await this.makeRequest(`/events/search?q=${encodeURIComponent(query)}`)
        
        if (response && Array.isArray(response.events)) {
          return response.events.map(this.transformEvent)
        } else if (Array.isArray(response)) {
          return response.map(this.transformEvent)
        }
        
        return []
      } catch (error) {
        console.warn('Failed to search events:', error.message)
        return []
      }
    }
  
    transformEvent(event) {
      // Ensure consistent event format
      return {
        id: event.id || `${event.location}-${event.date}`,
        location: event.location || event.city || 'Unknown Location',
        latitude: parseFloat(event.latitude || event.lat || 0),
        longitude: parseFloat(event.longitude || event.lng || event.lon || 0),
        date: event.date || new Date().toISOString(),
        time: event.time || null,
        type: event.type || (new Date(event.date) < new Date() ? 'past' : 'upcoming'),
        title: event.title || event.name || null,
        description: event.description || event.details || null,
        attendees: event.attendees || event.participants || null,
        website: event.website || event.url || null,
        tags: event.tags || event.categories || [],
        venue: event.venue || null,
        organizer: event.organizer || null,
      }
    }
  
    // Health check method
    async ping() {
      try {
        const response = await this.makeRequest('/health')
        return response.status === 'ok'
      } catch (error) {
        return false
      }
    }
  
    // Analytics method (optional)
    async trackEvent(eventType, data = {}) {
      try {
        await this.makeRequest('/analytics', {
          method: 'POST',
          body: JSON.stringify({
            event: eventType,
            timestamp: new Date().toISOString(),
            ...data
          })
        })
      } catch (error) {
        console.warn('Failed to track event:', error.message)
      }
    }
  }
  
  // Export singleton instance
  export const espressoClient = new EspressoClient()
  
  // Export class for testing
  export { EspressoClient }