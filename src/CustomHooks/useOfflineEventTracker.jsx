import { useEffect } from 'react';
import ReactGA from "react-ga4";
import { storeEventLocally, getStoredEvents, clearStoredEvents } from '../Utils/EventUtils';

/**
 * Custom hook to track events and store them locally when the user is offline.
 */
export const useOfflineEventTracker = () => {
  /**
   * Handle button clicks and track them via Google Analytics or store them locally if offline.
   * @param {Object} eventData - The event data to track or store.
   */
  const handleEvent = (eventData) => {
    if (navigator.onLine) {
      // Track the event if the user is online
      ReactGA.event({
        category: "Offline",
        action: "User offline"
      });
    } else {
      // Store the event locally if the user is offline
      storeEventLocally(eventData);
    }
  };

  useEffect(() => {
    /**
     * Send stored events when the user reconnects to the internet.
     */
    const handleOnline = () => {
        console.log("Online");
        
      // Retrieve stored offline events and send them to Google Analytics
      const storedEvents = getStoredEvents();
      storedEvents.forEach(eventData => {
        ReactGA.event({
          category: "Online",
          action: "User online"
        });
      });

      // Clear the stored events after sending
      clearStoredEvents();
    };

    // Listen for the "online" event when the user connects to the internet
    window.addEventListener('online', handleOnline);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { handleEvent };
};
