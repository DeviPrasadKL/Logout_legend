import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';

// Utility function to format a date object to 'YYYY-MM-DD' string
/**
 * Formats a date object to a string in 'YYYY-MM-DD' format.
 * @param {Date} date - The date object to format.
 * @returns {string} - The formatted date string.
 */
const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Utility function to get the start and end dates of a 5-day range
/**
 * Gets the start and end dates of a 5-day range ending today.
 * @returns {Object} - An object containing the startDate and endDate.
 */
const getDateRange = () => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    return { startDate: fiveDaysAgo, endDate: today };
};

// Utility function to format seconds into hh:mm:ss
/**
 * Formats a given number of seconds into a string in 'hh:mm:ss' format.
 * @param {number} seconds - The total number of seconds to format.
 * @returns {string} - The formatted time string.
 */
const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs].map(val => String(val).padStart(2, '0')).join(':');
};

export default function RecordsViewer() {
    const [records, setRecords] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Effect hook to load records from localStorage when the component mounts
    useEffect(() => {
        const loadedRecords = JSON.parse(localStorage.getItem('records')) || [];
        setRecords(loadedRecords);
    }, []);

    /**
     * Handles navigation between dates by updating the currentDate state.
     * Shows a snackbar message if the navigation is out of bounds.
     * @param {string} direction - The direction to navigate ('next' or 'prev').
     */
    const navigate = (direction) => {
        const { startDate, endDate } = getDateRange();
        const newDate = new Date(currentDate);

        if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
            if (newDate >= endDate) {
                setSnackbarMessage('Cannot navigate to a future date.');
                setSnackbarOpen(true);
                return;
            }
        } else if (direction === 'prev') {
            if (newDate <= startDate) {
                setSnackbarMessage('Cannot navigate to a date older than 5 days.');
                setSnackbarOpen(true);
                return;
            }
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    /**
     * Funtion to show current weekday and date on top
     * @param {Date} date - Login time
     * @returns {String} - Weekday day/month 
     */
    function formatDateToShow(date) {
        const weekdayOptions = { weekday: 'short' };
        const dayOptions = { day: '2-digit' };
        const monthOptions = { month: '2-digit' };

        const weekday = new Intl.DateTimeFormat('en-US', weekdayOptions).format(date);
        const day = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
        const month = new Intl.DateTimeFormat('en-US', monthOptions).format(date);

        return `${weekday} ${day}/${month}`;
    }

    // Format currentDate to match the record.date format
    const dateKey = formatDate(currentDate);
    const record = records.find(record => record.date === dateKey);

    return (
        <Container>
            <Typography variant="h6">Records for {formatDateToShow(currentDate)}</Typography>
            {record ? (
                <>
                    <TableContainer component={Paper} style={{ marginBottom: '16px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Login Time</TableCell>
                                    <TableCell>Expected Logout Time</TableCell>
                                    <TableCell>Logout Time</TableCell>
                                    <TableCell>Total Logged In Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{new Date(record.loginTime).toLocaleTimeString()}</TableCell>
                                    <TableCell>{record.expectedLogoutTime ? new Date(record.expectedLogoutTime).toLocaleTimeString() : 'N/A'}</TableCell>
                                    <TableCell>{record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString() : 'N/A'}</TableCell>
                                    <TableCell>{formatTime(record.totalLoggedInTime)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {record.breaks.length > 0 && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Break Start Time</TableCell>
                                        <TableCell>Break End Time</TableCell>
                                        <TableCell>Break Duration</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {record.breaks.map((b, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{new Date(b.start).toLocaleTimeString()}</TableCell>
                                            <TableCell>{new Date(b.end).toLocaleTimeString()}</TableCell>
                                            <TableCell>{b.duration}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={2}><strong>Total Break Time</strong></TableCell>
                                        <TableCell><strong>{record.totalBreakTime}</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            ) : (
                <Typography>No records available for this date.</Typography>
            )}
            <Stack direction="row" spacing={2} mt={2}>
                <Button variant="contained" onClick={() => navigate('prev')}>
                    Previous
                </Button>
                <Button variant="contained" onClick={() => navigate('next')}>
                    Next
                </Button>
            </Stack>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert sx={{ width: '100%' }} onClose={() => setSnackbarOpen(false)} severity="warning">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}