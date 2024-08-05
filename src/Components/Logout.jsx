// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';

function Logout() {
    const [loginTime, setLoginTime] = useState(null);
    const [expectedLogoutTime, setExpectedLogoutTime] = useState(null);
    const [breakStart, setBreakStart] = useState(null);
    const [breakEnd, setBreakEnd] = useState(null);
    const [breaks, setBreaks] = useState([]);
    const [isBreakInProgress, setIsBreakInProgress] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // in milliseconds
    const [openDialog, setOpenDialog] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // Load data from local storage on component mount
        const savedLoginTime = localStorage.getItem('loginTime');
        const savedBreaks = JSON.parse(localStorage.getItem('breaks')) || [];

        if (savedLoginTime) {
            const loginDate = new Date(savedLoginTime);
            setLoginTime(loginDate);
            const logoutTime = new Date(loginDate.getTime() + 8 * 60 * 60 * 1000);
            setExpectedLogoutTime(logoutTime);
        }

        // Convert savedBreaks dates back to Date objects
        const formattedBreaks = savedBreaks.map(b => ({
            start: new Date(b.start),
            end: new Date(b.end),
            duration: b.duration
        }));
        setBreaks(formattedBreaks);
    }, []);

    useEffect(() => {
        // Start or stop timer based on break status
        if (isBreakInProgress) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1000); // increment by 1 second
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setElapsedTime(0);
        }

        return () => clearInterval(timerRef.current); // cleanup on unmount or stop
    }, [isBreakInProgress]);

    const handleLogin = () => {
        const now = new Date();
        setLoginTime(now);
        localStorage.setItem('loginTime', now.toISOString());
        const logoutTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        setExpectedLogoutTime(logoutTime);
    };

    const handleBreakStart = () => {
        setBreakStart(new Date());
        setIsBreakInProgress(true);
    };

    const handleBreakEnd = () => {
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

            // Calculate the total break duration in milliseconds
            const totalBreakDuration = newBreaks.reduce((acc, b) => {
                const [minutes, seconds] = b.duration.split('m').map(part => parseInt(part, 10));
                const durationInMs = (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;
                return acc + durationInMs;
            }, 0);

            // Update the expected logout time by adding the total break duration
            if (expectedLogoutTime) {
                const updatedLogoutTime = new Date(expectedLogoutTime.getTime() + totalBreakDuration);
                setExpectedLogoutTime(updatedLogoutTime);
                localStorage.setItem('expectedLogoutTime', updatedLogoutTime.toISOString());
            }

            localStorage.setItem('breaks', JSON.stringify(newBreaks));
        }
    };

    const handleClearData = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = (confirm) => {
        if (confirm) {
            localStorage.clear();
            setLoginTime(null);
            setExpectedLogoutTime(null);
            setBreaks([]);
        }
        setOpenDialog(false);
    };

    // Formatting options for time display
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {loginTime ? `Date: ${loginTime.toLocaleDateString()}` : 'No login time recorded'}
            </Typography>
            {loginTime && (
                <Typography variant="p">
                    Logged In Time: {loginTime.toLocaleTimeString('en-US', timeOptions)}<br />
                    Expected Logout Time: {expectedLogoutTime.toLocaleTimeString('en-US', timeOptions)}
                </Typography>
            )}
            <Stack p={2}>
                <Button variant="contained" color='success' onClick={handleLogin} disabled={!!loginTime}>Login</Button>
                <Button variant="contained" onClick={handleBreakStart} disabled={!loginTime || isBreakInProgress}>Break Start</Button>
                <Button variant="contained" onClick={handleBreakEnd} disabled={!isBreakInProgress}>Break End</Button>
            </Stack>

            {isBreakInProgress && (
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    Break Timer: {Math.floor(elapsedTime / 1000)} seconds
                </Typography>
            )}

            {breaks.length !== 0 && <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Break Start</TableCell>
                            <TableCell>Break End</TableCell>
                            <TableCell>Break Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {breaks.map((breakRecord, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(breakRecord.start).toLocaleTimeString('en-US', timeOptions)}</TableCell>
                                <TableCell>{new Date(breakRecord.end).toLocaleTimeString('en-US', timeOptions)}</TableCell>
                                <TableCell>{breakRecord.duration}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}

            <Button variant="outlined" color="error" onClick={handleClearData} style={{ marginTop: 20 }}>
                Clear Data
            </Button>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Clear Data</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to clear all data?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(true)} color="primary">Yes</Button>
                    <Button onClick={() => handleDialogClose(false)} color="secondary">No</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Logout;
