import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, IconButton } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

/**
 * Formats a date object to a string in 'YYYY-MM-DD' format.
 * @param {Date} date - The date object to format.
 * @returns {string} - The formatted date string.
 */
const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

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

/**
 * Formats a date object to a string in 'hh:mm:ss am/pm' format.
 * @param {Date} date - The date object to format.
 * @returns {string} - The formatted time string.
 */
const formatTime12Hour = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(date);
};

export default function RecordsViewer() {
    const [records, setRecords] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    /**
     * Effect hook to load records from localStorage when the component mounts.
     * Sets the state with the loaded records or an empty array if no records are found.
     */
    useEffect(() => {
        const loadedRecords = JSON.parse(localStorage.getItem('records')) || [];
        setRecords(loadedRecords);
    }, []);

    /**
     * Handles navigation between dates by updating the currentDate state.
     * Displays a snackbar message if the navigation is out of bounds.
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
     * Formats the date to display the weekday, day, and month in a readable format.
     * @param {Date} date - The date to format.
     * @returns {string} - The formatted date string.
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

    /**
     * Generates and triggers a download of the records report in XLSX format.
     */
    const handleDownload = () => {
        const wb = XLSX.utils.book_new();

        const data = [
            ["Date", "Login Time", "Expected Logout Time", "Logout Time", "Total Logged In Time", "Total Break Time"],
            [dateKey,
                record ? formatTime12Hour(new Date(record.loginTime)) : 'N/A',
                record ? (record.expectedLogoutTime ? formatTime12Hour(new Date(record.expectedLogoutTime)) : 'N/A') : 'N/A',
                record ? (record.logoutTime ? formatTime12Hour(new Date(record.logoutTime)) : 'N/A') : 'N/A',
                record ? record.totalLoggedInTime : 'N/A',
                record ? record.totalBreakTime : 'N/A']
        ];

        const breaksData = record ? record.breaks.map(b => [
            formatTime12Hour(new Date(b.start)),
            formatTime12Hour(new Date(b.end)),
            b.duration
        ]) : [];

        const breaksSheet = [["Break Start Time", "Break End Time", "Break Duration"], ...breaksData];
        data.push([""]); // Adding empty row
        data.push(["Breaks Table"]);
        data.push(...breaksSheet);

        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        // Generate file name with date, time, and random numbers
        const now = new Date();
        const formattedDate = formatDate(now);
        const formattedTime = formatTime12Hour(now).replace(/:/g, '-'); // Replace colons for file compatibility
        const randomNumbers = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        const fileName = `Login_Tracker_${formattedDate}_${formattedTime}_${randomNumbers}.xlsx`;

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
    };


    return (
        <Container>
            <Typography variant="h6">Records for {formatDateToShow(currentDate)}</Typography>

            <Stack direction="row" justifyContent='space-between' spacing={2} m={1}>
                <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Download Button */}
                {record &&
                    <IconButton aria-label="Download" onClick={handleDownload}>
                        <DownloadIcon />
                    </IconButton>
                }

                <IconButton aria-label="Next" variant='contained' onClick={() => navigate('next')}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Stack>

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
                                    <TableCell>{formatTime12Hour(new Date(record.loginTime))}</TableCell>
                                    <TableCell>{record.expectedLogoutTime ? formatTime12Hour(new Date(record.expectedLogoutTime)) : 'N/A'}</TableCell>
                                    <TableCell>{record.logoutTime ? formatTime12Hour(new Date(record.logoutTime)) : 'N/A'}</TableCell>
                                    <TableCell>{record.totalLoggedInTime}</TableCell>
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
                                            <TableCell>{formatTime12Hour(new Date(b.start))}</TableCell>
                                            <TableCell>{formatTime12Hour(new Date(b.end))}</TableCell>
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


                    {/* <Button variant="contained" color="primary"  style={{ marginTop: 20 }}>
                        Download Report
                    </Button> */}
                </>
            ) : (
                <Typography>No records available for this date.</Typography>
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert sx={{ width: '100%' }} onClose={() => setSnackbarOpen(false)} severity="warning">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
