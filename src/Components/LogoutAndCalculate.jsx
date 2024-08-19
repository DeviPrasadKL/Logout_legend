import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ConfirmationDialog from '../UIComponents/ConfirmationDialog';
import useTotalLoggedInHours from '../CustomHooks/useTotalLoggedInHours';

/**
 * `LogoutAndCalculate` component handles user logout, calculates logged-in duration, 
 * manages break durations, and provides an option to download a report.
 *
 * @param {string} loginTime - The login timestamp.
 * @param {string} expectedLogoutTime - The expected logout timestamp.
 * @param {Array} breaks - An array of break objects, each containing start, end, and duration.
 * @param {boolean} isLoggedOut - Flag indicating whether the user is logged out.
 * @param {Function} setIsLoggedOut - Function to update the logged out status.
 * @param {Function} formatDate - Function to format the current date.
 * @param {string} logoutTime - The logout timestamp.
 * @param {Function} setLogoutTime - Function to update the logout timestamp.
 */
export default function LogoutAndCalculate({
    loginTime,
    expectedLogoutTime,
    breaks,
    isLoggedOut,
    setIsLoggedOut,
    formatDate,
    logoutTime,
    setLogoutTime
}) {
    // State to control the logout confirmation dialog visibility
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    //Hook to get Total Logged in hours without breaks
    const {totalLoggedInHours} = useTotalLoggedInHours(loginTime, logoutTime, breaks);

    /**
     * Opens the logout confirmation dialog.
     */
    const handleLogout = () => {
        setOpenLogoutDialog(true);
    };

    /**
     * Confirms the logout action, updates the logout time and logged-out status,
     * and closes the confirmation dialog.
     */
    const confirmLogout = (confirm) => {
        if (confirm) {
            const now = new Date();
            setLogoutTime(now.toISOString());
            setIsLoggedOut(true); // Mark as logged out
            localStorage.setItem('logoutTime', now.toISOString());
            setOpenLogoutDialog(false); // Close dialog after confirmation
        }
        setOpenLogoutDialog(false); // Close dialog after confirmation
    };

    /**
     * Calculates the total break duration and returns it as a formatted string.
     * @returns {string} The total break duration formatted as "Xh Ym Zs" or "Ym Zs".
     */
    const calculateTotalBreakDuration = () => {
        const totalDuration = breaks.reduce((acc, b) => {
            const [minutes, seconds] = b.duration.split('m').map(part => parseInt(part, 10));
            const durationInMs = (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;
            return acc + durationInMs;
        }, 0);

        const totalMinutes = Math.floor(totalDuration / (1000 * 60));
        const totalSeconds = Math.floor(totalDuration / 1000) % 60;

        if (totalMinutes >= 60) {
            const totalHours = Math.floor(totalMinutes / 60);
            const minutesRemaining = totalMinutes % 60;
            return `${totalHours.toString().padStart(2, '0')}h ${minutesRemaining.toString().padStart(2, '0')}m ${totalSeconds.toString().padStart(2, '0')}s`;
        } else {
            return `${totalMinutes}m ${totalSeconds}s`;
        }
    };

    // Determine if total logged-in hours should be displayed
    const showTotalLoggedinHours = isLoggedOut && totalLoggedInHours !== 'N/A';

    return (
        <Stack spacing={2}>
            {/* Button to initiate logout */}
            <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                disabled={isLoggedOut}
                style={{ marginTop: 20 }}
            >
                Logout
            </Button>

            {/* Display logout time if available */}
            {logoutTime && (
                <Typography variant="p" style={{ marginTop: 20 }}>
                    Logged Out: {new Date(logoutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </Typography>
            )}

            {/* Display total logged-in hours if user is logged out */}
            {showTotalLoggedinHours && (
                <Typography variant="p" style={{ marginTop: 20 }}>
                    Total Logged In Hours: {totalLoggedInHours}
                </Typography>
            )}

            {/* Confirmation Dialog for logout */}
            <ConfirmationDialog
                openDialog={openLogoutDialog}
                setOpenDialog={setOpenLogoutDialog}
                handleDialogClose={confirmLogout}
                title='Confirm Logout'
                content="Are you sure you want to log out?"
                no='Cancel'
                yes='Logout'
            />

        </Stack>
    );
};
