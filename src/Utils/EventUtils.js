/**
 * Store event data locally in localStorage if the user is offline.
 * 
 * @param {Object} eventData - The event data to store.
 */
export const storeEventLocally = (eventData) => {
    // Get existing events from localStorage, or initialize an empty array if none exists
    const storedEvents = JSON.parse(localStorage.getItem('offlineEvents')) || [];
    
    // Add the new event to the array
    storedEvents.push(eventData);
  
    // Store the updated array back in localStorage
    localStorage.setItem('offlineEvents', JSON.stringify(storedEvents));
  };
  
  /**
   * Retrieve stored offline events from localStorage.
   * 
   * @returns {Array} - The array of stored events.
   */
  export const getStoredEvents = () => {
    return JSON.parse(localStorage.getItem('offlineEvents')) || [];
  };
  
  /**
   * Clear stored offline events from localStorage after sending them.
   */
  export const clearStoredEvents = () => {
    localStorage.removeItem('offlineEvents');
  };
  