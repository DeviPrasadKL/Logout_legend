import React, { useEffect, useState } from 'react'

export default function useTotalLoggedInHours(loginTime, logoutTime, breaks) {
    // State to store total logged-in hours
    const [totalLoggedInHours, setTotalLoggedInHours] = useState('N/A');

    /**
     * Calculates the total logged-in duration, accounting for breaks.
     * This effect runs whenever loginTime, logoutTime, or breaks change.
     */
    useEffect(() => {
        if (loginTime && logoutTime) {
            const loginDate = new Date(loginTime);
            const logoutDate = new Date(logoutTime);

            // Calculate total duration between login and logout
            const totalDuration = logoutDate - loginDate;

            // Calculate total break duration
            const totalBreakDurationMs = breaks.reduce((acc, b) => {
                const [minutes, seconds] = b.duration.split('m').map(part => parseInt(part, 10));
                const durationInMs = (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;
                return acc + durationInMs;
            }, 0);

            // Subtract break duration from total duration to get logged-in time
            const totalLoggedInMs = totalDuration - totalBreakDurationMs;
            const totalHours = Math.floor(totalLoggedInMs / (1000 * 60 * 60));
            const totalMinutes = Math.floor((totalLoggedInMs % (1000 * 60 * 60)) / (1000 * 60));
            const totalSeconds = Math.floor((totalLoggedInMs % (1000 * 60)) / 1000);

            // Set formatted total logged-in hours
            setTotalLoggedInHours(`${totalHours}h ${totalMinutes}m ${totalSeconds}s`);
        }
    }, [loginTime, logoutTime, breaks]);

    return {totalLoggedInHours}
}
