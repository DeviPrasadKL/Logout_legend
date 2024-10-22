import React, { useState, useEffect, useRef, lazy } from 'react';
//Lazy loading
import Loadable from './Lodable';
const SettingsSection = Loadable(lazy(() => import('./SettingsSection')));
const CloseConfirm = Loadable(lazy(() => import('../UIComponents/ConfirmationDialog')));
const LogoutAndCalculate = Loadable(lazy(() => import('./LogoutAndCalculate')));
const RecordExistsConfirm = Loadable(lazy(() => import('../UIComponents/RecordExistsConfirm')));
const BreaksTable = Loadable(lazy(() => import('./BreaksTable')));

import { Button, Container, Typography, Stack, TextField, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import useTotalLoggedInHours from '../CustomHooks/useTotalLoggedInHours';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

/**
 * A component for which renders all the other main componennts inside with all the logic.
 * @param {boolean} darkMode - Indicates whether dark mode is currently enabled.
 * @param {Function} handleThemeToggle - Function to toggle the theme mode.
 */
export default function Logout({ darkMode, handleThemeToggle }) {
    const [loginTime, setLoginTime] = useState(null);
    const [expectedLogoutTime, setExpectedLogoutTime] = useState(null);
    const [breakStart, setBreakStart] = useState(null);
    const [breakEnd, setBreakEnd] = useState(null);
    const [breaks, setBreaks] = useState([]);
    const [isBreakInProgress, setIsBreakInProgress] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [manualBreakDuration, setManualBreakDuration] = useState('');
    const [loginHoursDialogOpen, setLoginHoursDialogOpen] = useState(false);
    const [loginHours, setLoginHours] = useState({ weekday: 8, saturday: 5 });
    const [breakStartedAt, setBreakStartedAt] = useState(null);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [logoutTime, setLogoutTime] = useState(null);
    const [isEditingLoginTime, setIsEditingLoginTime] = useState(false);
    const [editedLoginTime, setEditedLoginTime] = useState('');
    const [effectiveLoginTime, setEffectiveLoginTime] = useState('00:00:00');

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);

    const timerRef = useRef(null);

    useEffect(() => {
        // Load saved data from localStorage on component mount
        const savedLoginTime = localStorage.getItem('loginTime');
        const savedBreaks = JSON.parse(localStorage.getItem('breaks')) || [];
        const savedExpectedLogoutTime = localStorage.getItem('expectedLogoutTime');
        const savedLoginHours = JSON.parse(localStorage.getItem('loginHours')) || { weekday: 8, saturday: 5 };
        const breakExists = localStorage.getItem('breakStartTime');
        const savedLogoutTime = localStorage.getItem('logoutTime');

        // Call removeOldRecords function to clean up old records
        removeOldRecords();

        if (breakExists) {
            setBreakStartedAt(breakExists);
            setIsBreakInProgress(true);
            setBreakStart(new Date(breakExists));
        }

        if (savedLoginTime) {
            const loginDate = new Date(savedLoginTime);
            setLoginTime(loginDate);
            if (!savedExpectedLogoutTime) {
                updateExpectedLogoutTime(loginDate, savedLoginHours);
            } else {
                setExpectedLogoutTime(new Date(savedExpectedLogoutTime));
            }
        }

        const formattedBreaks = savedBreaks.map(b => ({
            start: new Date(b.start),
            end: new Date(b.end),
            duration: b.duration
        }));
        setBreaks(formattedBreaks);

        updateTotalBreakDuration(formattedBreaks);
        setLoginHours(savedLoginHours);

        if (savedLogoutTime) {
            // If logout time exists in localStorage, set it and mark as logged out
            setLogoutTime(new Date(savedLogoutTime));
            setIsLoggedOut(true);
        } else {
            setIsLoggedOut(false);
            setLogoutTime(null);
        }
    }, []);

    useEffect(() => {
        // Timer for tracking elapsed time during a break
        if (isBreakInProgress) {
            timerRef.current = setInterval(() => {
                const timeStartedAt = new Date(breakStartedAt);
                const secondsPassed = (new Date().getTime() - timeStartedAt.getTime()) / 1000;
                setElapsedTime(secondsPassed);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setElapsedTime(0);
        }

        return () => clearInterval(timerRef.current);
    }, [isBreakInProgress]);

    useEffect(() => {
        if (loginTime) {
            setEditedLoginTime(loginTime.toTimeString().substr(0, 5)); // Format to HH:mm
        }
    }, [loginTime]);

    /**
     * A React hook that updates the effective login time, accounting for breaks.
     * 
     * The effective login time is the total time elapsed since the login, 
     * minus the total duration of any breaks taken.
     * 
     * @param {Date} loginTime - The time when the user logged in.
     * @param {boolean} isLoggedOut - Indicates whether the user is logged out.
     * @param {boolean} isBreakInProgress - Indicates whether a break is currently in progress.
     * @param {Array} breaks - An array of break objects, each containing a start and end time.
     */
    useEffect(() => {
        if (loginTime && !isLoggedOut) {
            if (!isBreakInProgress) {
                const effectiveInterval = setInterval(() => {
                    const now = new Date();
                    const elapsedTime = Math.floor((now - loginTime) / 1000); // in seconds
                    const breakDuration = breaks.reduce((total, b) => {
                        const breakStartTime = new Date(b.start);
                        const breakEndTime = new Date(b.end);
                        return total + Math.floor((breakEndTime - breakStartTime) / 1000);
                    }, 0);
                    setEffectiveLoginTime(EffectiveHoursFormatTime(elapsedTime - breakDuration));
                }, 1000);

                return () => clearInterval(effectiveInterval);
            }
        }
    }, [loginTime, isLoggedOut, isBreakInProgress, breaks]);

    /**
     * Formats the effective login time from seconds into a string showing hours, minutes, and seconds.
     * 
     * @param {number} seconds - The total number of seconds to format.
     * @returns {string} - A string representing the time in "hh:mm:ss" format.
     */
    const EffectiveHoursFormatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}h  ${minutes.toString().padStart(2, '0')}m  ${secs.toString().padStart(2, '0')}s`;
    };

    /**Function close Record exists dialouge */
    const handleRecordExistsDialogClose = (confirmed) => {
        setDialogOpen(false);
        if (confirmed && confirmCallback) {
            confirmCallback();
        }
    };

    //Hook to get Total Logged in hours without breaks
    const { totalLoggedInHours } = useTotalLoggedInHours(loginTime, logoutTime, breaks);

    /**
     * Function to remove records older than 5 days
     */
    const removeOldRecords = () => {
        const now = new Date();
        const cutoffDate = new Date(now.setDate(now.getDate() - 5)).toISOString().split('T')[0]; // Date 5 days ago

        // Retrieve existing records from localStorage
        const existingRecords = JSON.parse(localStorage.getItem('records')) || [];

        // Filter out records older than 5 days
        const updatedRecords = existingRecords.filter(record => record.date >= cutoffDate);

        // Save the updated records back to localStorage
        localStorage.setItem('records', JSON.stringify(updatedRecords));
    };

    /**
     * Updates the expected logout time based on login time and login hours.
     * @param {Date} loginDate - The login date and time.
     * @param {Object} hours - Object with login hours for weekdays and Saturdays.
     * @param {number} hours.weekday - Number of work hours for weekdays.
     * @param {number} hours.saturday - Number of work hours for Saturdays.
     */
    const updateExpectedLogoutTime = (loginDate, hours = loginHours) => {
        const isSaturday = loginDate.getDay() === 6; // 6 corresponds to Saturday
        const hoursToAdd = isSaturday ? hours.saturday : hours.weekday;
        const logoutTime = new Date(loginDate.getTime() + hoursToAdd * 60 * 60 * 1000);
        setExpectedLogoutTime(logoutTime);
        localStorage.setItem('expectedLogoutTime', logoutTime.toISOString());
    };

    /** 
     * Updates the total break duration and adjusts the expected logout time based on the provided breaks.
     * @param {Array<{ start: Date, end: Date, duration: string }>} formattedBreaks - An array of break objects, each containing:
     *   - {Date} start - The start time of the break.
     *   - {Date} end - The end time of the break.
     *   - {string} duration - The duration of the break in the format "Xm Ys" (e.g., "15m 30s").
     */
    const updateTotalBreakDuration = (formattedBreaks) => {
        const totalBreakDuration = formattedBreaks.reduce((acc, b) => {
            const [minutes, seconds] = b.duration.split('m').map(part => parseInt(part, 10));
            const durationInMs = (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;
            return acc + durationInMs;
        }, 0);

        if (expectedLogoutTime) {
            const updatedLogoutTime = new Date(expectedLogoutTime.getTime() + totalBreakDuration);
            setExpectedLogoutTime(updatedLogoutTime);
            localStorage.setItem('expectedLogoutTime', updatedLogoutTime.toISOString());
        }
    };

    /** 
     * Handles login action, stores the current time as login time and updates expected logout time.
     */
    const handleLogin = () => {
        const now = new Date();
        setLoginTime(now);
        localStorage.setItem('loginTime', now.toISOString());
        updateExpectedLogoutTime(now);
        setIsLoggedOut(false);
        setLogoutTime(null)
    };

    /** 
     * Starts a break, records the start time and updates the state and localStorage.
     */
    const handleBreakStart = () => {
        const now = new Date();
        setBreakStart(now);
        setIsBreakInProgress(true);
        localStorage.setItem('breakStartTime', now.toISOString());
        setBreakStartedAt(now.toISOString());
    };

    /** 
     * Ends a break, calculates the break duration, updates the list of breaks and the expected logout time.
     */
    const handleBreakEnd = () => {
        localStorage.removeItem('breakStartTime');
        setBreakStartedAt(null);
        if (isBreakInProgress && breakStart) {
            const now = new Date();
            setBreakEnd(now);
            setIsBreakInProgress(false);

            const duration = now - breakStart;
            const durationInMinutes = Math.floor(duration / (1000 * 60));
            const durationInSeconds = Math.floor(duration / 1000) % 60;

            const newBreak = {
                start: breakStart.toISOString(),
                end: now.toISOString(),
                duration: `${durationInMinutes}m ${durationInSeconds}s`
            };

            const newBreaks = [...breaks, newBreak];
            setBreaks(newBreaks);

            // Update expected logout time if it's already set
            if (expectedLogoutTime) {
                const updatedLogoutTime = new Date(expectedLogoutTime.getTime() + duration);
                setExpectedLogoutTime(updatedLogoutTime);
                localStorage.setItem('expectedLogoutTime', updatedLogoutTime.toISOString());
            }

            localStorage.setItem('breaks', JSON.stringify(newBreaks));
        }
    };

    /** 
     * Opens the confirmation dialog for clearing data.
     */
    const handleClearData = () => {
        setOpenDialog(true);
    };

    /**
     * Clears all user data from localStorage except theme mode and login hours.
     * Also adds a record with the total break time.
     */
    const clearDataAndAddRecords = () => {
        if (loginTime) {
            const loginDate = new Date(loginTime).toISOString().split('T')[0];
            const currentDate = new Date();
            const loginDateObj = new Date(loginDate);
            const diffDays = Math.floor((currentDate - loginDateObj) / (1000 * 60 * 60 * 24));

            if (diffDays <= 6) {
                const newRecord = {
                    date: loginDate,
                    loginTime: loginTime.toISOString(),
                    expectedLogoutTime: expectedLogoutTime?.toISOString() || null,
                    breaks: breaks,
                    logoutTime: logoutTime || null,
                    totalLoggedInTime: totalLoggedInHours,
                    totalBreakTime: calculateTotalBreakDuration()
                };

                const existingRecords = JSON.parse(localStorage.getItem('records')) || [];
                const existingRecordIndex = existingRecords.findIndex(record => record.date === loginDate);

                if (existingRecordIndex >= 0) {
                    // Open confirmation dialog
                    setDialogOpen(true);
                    setConfirmCallback(() => () => {
                        existingRecords[existingRecordIndex] = newRecord;
                        localStorage.setItem('records', JSON.stringify(existingRecords));
                    });
                } else {
                    existingRecords.push(newRecord);
                    localStorage.setItem('records', JSON.stringify(existingRecords));
                }
            }
        }

        // Clear current data
        setLoginTime(null);
        setExpectedLogoutTime(null);
        setBreaks([]);
        setIsLoggedOut(false);
        setLogoutTime(null);

        // Clear relevant items from localStorage
        localStorage.removeItem('loginTime');
        localStorage.removeItem('breaks');
        localStorage.removeItem('breakStartTime');
        localStorage.removeItem('expectedLogoutTime');
        localStorage.removeItem('logoutTime');
    };


    /**
     * Clears all user data from localStorage except theme mode and login hours.
     * @param {boolean} confirm - Whether the user confirmed the data clearing action.
     */
    const handleDialogClose = (confirm) => {
        if (confirm) {
            clearDataAndAddRecords();
        }
        setOpenDialog(false);
    };

    /**
     * Adds a manual break with a specified duration and updates the list of breaks and expected logout time.
     */
    const handleAddManualBreak = () => {
        const minutes = parseInt(manualBreakDuration, 10);
        if (isNaN(minutes) || minutes <= 0) {
            alert("Please enter a valid number of minutes.");
            return;
        }
    
        const now = new Date();
        const durationInMs = minutes * 60 * 1000;
    
        // Create a new break
        const newBreak = {
            start: now.toISOString(),
            end: new Date(now.getTime() + durationInMs).toISOString(),
            duration: `${minutes}m 0s`
        };
    
        // Update breaks array
        const newBreaks = [...breaks, newBreak];
        setBreaks(newBreaks);
        localStorage.setItem('breaks', JSON.stringify(newBreaks));
    
        // Update expected logout time if it's already set
        if (expectedLogoutTime) {
            const updatedLogoutTime = new Date(expectedLogoutTime.getTime() + durationInMs);
            setExpectedLogoutTime(updatedLogoutTime);
            localStorage.setItem('expectedLogoutTime', updatedLogoutTime.toISOString());
        }
    
        // Adjust the effective login time
        const [hours, minutesEffective] = effectiveLoginTime.split(':').map(Number);
        let totalEffectiveMinutes = hours * 60 + minutesEffective;
        
        // Subtract manual break duration
        totalEffectiveMinutes -= minutes;
        
        // Recalculate hours and minutes
        const updatedHours = Math.floor(totalEffectiveMinutes / 60);
        const updatedMinutes = totalEffectiveMinutes % 60;
    
        // Set the updated effective login time
        const newEffectiveLoginTime = `${updatedHours.toString().padStart(2, '0')}:${updatedMinutes.toString().padStart(2, '0')}`;
        setEffectiveLoginTime(newEffectiveLoginTime);
    
        // Clear manual break duration input
        setManualBreakDuration('');
    };

    /**
     * Function to delete the breaks and update in localstorage
     * @param {number} index - Index of the row which has to be deleted
     */
    const handleDeleteBreak = (index) => {
        const breakToRemove = breaks[index];
        const durationToRemove = breakToRemove.duration.split('m').map(part => parseInt(part, 10));
        const durationToRemoveMs = (durationToRemove[0] || 0) * 60 * 1000 + (durationToRemove[1] || 0) * 1000;
    
        // Update breaks array by filtering out the removed break
        const updatedBreaks = breaks.filter((_, i) => i !== index);
        setBreaks(updatedBreaks);
        localStorage.setItem('breaks', JSON.stringify(updatedBreaks));
    
        // Adjust expected logout time if it's set
        if (expectedLogoutTime) {
            const updatedLogoutTime = new Date(expectedLogoutTime.getTime() - durationToRemoveMs);
            setExpectedLogoutTime(updatedLogoutTime);
            localStorage.setItem('expectedLogoutTime', updatedLogoutTime.toISOString());
        }
    };    

    /**
     * Function to store the login hours settigs in local storage
     * @param {event} event - Event of change to get name and value
     */
    const handleLoginHoursChange = (event) => {
        const { name, value } = event.target;
        setLoginHours(prev => {
            const newHours = { ...prev, [name]: parseInt(value, 10) || 0 };
            localStorage.setItem('loginHours', JSON.stringify(newHours)); // Save to local storage
            return newHours;
        });
    };

    /**
     * Function to save login hours settings and adjust expected logout accordingly
     */
    const handleLoginHoursSave = () => {
        const now = loginTime ? new Date(loginTime) : new Date();
        updateExpectedLogoutTime(now, loginHours);
        setLoginHoursDialogOpen(false);
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    /**
     * Funtion to show current weekday and date on top
     * @param {Date} date - Login time
     * @returns {String} - Weekday day/month 
     */
    function formatDate(date) {
        const weekdayOptions = { weekday: 'short' };
        const dayOptions = { day: '2-digit' };
        const monthOptions = { month: '2-digit' };

        const weekday = new Intl.DateTimeFormat('en-US', weekdayOptions).format(date);
        const day = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
        const month = new Intl.DateTimeFormat('en-US', monthOptions).format(date);

        return `${weekday} ${day}/${month}`;
    }

    /** 
     * Function which calculates the total break duration by adding all the breaks
     * @returns {String} - Total break duration in hh:mm:ss / mm:ss
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

    /**
     * Helper function to check if a break can be deleted
     * @param {Date} breakEndTime - Break start time of that row (breakRecord.start)
     * @returns {Boolean} - Disable delete button o not
     */
    const canDeleteBreak = (breakEndTime) => {
        const breakStartDate = new Date(breakEndTime);
        const now = new Date();
        const diffMinutes = (now - breakStartDate) / (1000 * 60);
        // Return true if less than or equal to 2 minutes
        return diffMinutes <= 2;
    };

    /** 
     * Funtion to format the timer of break
     * @param {number} seconds - Seconds from timer
     * @returns {String} - Time in the format hh:mm:ss
     */
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeSave = () => {
        const [hours, minutes] = editedLoginTime.split(':').map(Number);
        const updatedLoginTime = new Date(loginTime);
        updatedLoginTime.setHours(hours, minutes);

        setLoginTime(updatedLoginTime);
        localStorage.setItem('loginTime', updatedLoginTime.toISOString());
        setIsEditingLoginTime(false);
        updateExpectedLogoutTime(updatedLoginTime);
    };

    const handleTimeChange = (event) => {
        setEditedLoginTime(event.target.value);
    };

    const showAddBreakManually = loginTime && !isBreakInProgress && !isLoggedOut;

    return (
        <Container>

            <Stack flexDirection='row' justifyContent='space-between' alignItems='baseline'>
                <Typography variant="h5" gutterBottom>
                    {loginTime ? `${formatDate(loginTime)}` : 'No login time recorded'}
                </Typography>
                <IconButton onClick={() => setLoginHoursDialogOpen(true)} color='secondary'>
                    <SettingsIcon />
                </IconButton>
            </Stack>

            {loginTime && (
                <Stack direction="row" alignItems="center" justifyContent='space-between'>
                    {isEditingLoginTime ? (
                        <>
                            <input
                                type="time"
                                value={editedLoginTime}
                                onChange={handleTimeChange}
                            />
                            <IconButton onClick={handleTimeSave} color='primary'>
                                <SaveIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Typography variant="p">
                                Logged In:- {loginTime.toLocaleTimeString('en-US', timeOptions)}
                            </Typography>
                            <IconButton onClick={() => setIsEditingLoginTime(true)} color='secondary'>
                                <EditIcon />
                            </IconButton>
                        </>
                    )}
                </Stack>
            )}

            {loginTime && (
                <Typography variant="p">
                    {/* Logged In:- {loginTime.toLocaleTimeString('en-US', timeOptions)}<br /> */}
                    Expected Logout:- {expectedLogoutTime?.toLocaleTimeString('en-US', timeOptions)}
                </Typography>
            )}

            <Stack p={2} justifyContent='center' alignItems='center'>
                {/* Show the clear data button when user is logged out */}
                {isLoggedOut ?
                    <Button
                        sx={{ height: '8rem', width: '12rem', borderRadius: '8%' }}
                        variant="contained"
                        color='secondary'
                        onClick={handleClearData}
                        disabled={!isLoggedOut}>
                        Clear Data
                    </Button>
                    :
                    <>
                        {/* else show Login, break start and break end buttons */}
                        <Stack justifyContent='center' alignItems='center'
                            // color='#32bd39'
                            onClick={handleLogin}
                            sx={{ display: !!loginTime ? 'none' : 'flex', height: '8rem', width: '12rem', borderRadius: '8%', backgroundColor: '#32bd39', color: 'white', fontSize: '1.5rem', fontWeight: '800' }}
                            disabled={!!loginTime}>
                            Login
                        </Stack>

                        <Button
                            sx={{ display: !loginTime || isBreakInProgress ? 'none' : 'block', height: '8rem', width: '12rem', borderRadius: '8%' }}
                            variant="contained"
                            onClick={handleBreakStart}
                            disabled={!loginTime || isBreakInProgress || isLoggedOut}>
                            Start Break
                        </Button>

                        {/* <Button
                            sx={{ display: !isBreakInProgress ? 'none' : 'block', height: '8rem', width: '8rem', borderRadius: '12%' }}
                            variant="contained"
                            color='error'
                            onClick={handleBreakEnd}
                            disabled={!isBreakInProgress}>
                            Break End
                        </Button> */}

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: !isBreakInProgress ? 'none' : 'flex',
                                    height: '8rem',
                                    width: '12rem',
                                    borderRadius: '8%',
                                    background: '#df0000',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                }}
                                // variant="contained"
                                // color="error"
                                onClick={handleBreakEnd}
                            // disabled={!isBreakInProgress}
                            >
                                <Typography
                                    className='avoidLayoutChange'
                                    sx={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: '2rem'
                                    }}
                                >
                                    {formatTime(Math.floor(elapsedTime))}
                                </Typography>

                                End Break
                            </Box>


                        </Box>
                    </>
                }
            </Stack>


            {breaks.length !== 0 && (
                <BreaksTable
                    breaks={breaks}
                    handleDeleteBreak={handleDeleteBreak}
                    canDeleteBreak={canDeleteBreak}
                    calculateTotalBreakDuration={calculateTotalBreakDuration}
                    timeOptions={timeOptions}
                />
            )}

            {showAddBreakManually && (
                <Stack direction="row" spacing={2} style={{ marginTop: 20 }}>
                    <TextField
                        label="Add Break Time (minutes)"
                        type="number"
                        value={manualBreakDuration}
                        onChange={(e) => setManualBreakDuration(e.target.value)}
                        inputProps={{ min: 0 }}
                    />
                    <Button variant="contained" color="primary"
                        onClick={handleAddManualBreak}
                        disabled={manualBreakDuration === ''}
                    >
                        Add Break
                    </Button>
                </Stack>
            )}

            <Stack justifyContent='center' alignItems='center' mt={2}>
                {loginTime && (
                    <Typography variant="p" className='avoidLayoutChange'>
                        Effective Login Hours: {effectiveLoginTime}
                    </Typography>
                )}
            </Stack>

            {loginTime &&
                <Stack pb={2}>
                    {!isBreakInProgress &&
                        <LogoutAndCalculate
                            loginTime={loginTime}
                            expectedLogoutTime={expectedLogoutTime}
                            breaks={breaks}
                            darkMode={darkMode}
                            logoutTime={logoutTime}
                            formatDate={formatDate}
                            isLoggedOut={isLoggedOut}
                            setLogoutTime={setLogoutTime}
                            setIsLoggedOut={setIsLoggedOut}
                        />
                    }
                </Stack>
            }

            {/* Login Settings */}
            <SettingsSection
                setLoginHoursDialogOpen={setLoginHoursDialogOpen}
                loginHoursDialogOpen={loginHoursDialogOpen}
                loginHours={loginHours}
                handleLoginHoursSave={handleLoginHoursSave}
                handleLoginHoursChange={handleLoginHoursChange}
            />

            {/* App close confirm dialog */}
            <CloseConfirm
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleDialogClose={handleDialogClose}
                title='Clear Data'
                content="Are you sure you want to clear all data?"
                no='No'
                yes='Yes'
            />

            {/* Record Replace dialouge */}
            <RecordExistsConfirm open={isDialogOpen} onClose={handleRecordExistsDialogClose} />
        </Container>
    );
}