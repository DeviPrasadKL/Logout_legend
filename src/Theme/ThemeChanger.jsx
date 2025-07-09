import React, { useState, useEffect } from 'react';
import {
    CssBaseline,
    createTheme,
    ThemeProvider,
    Stack,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from '../Router/AppRoutes';
import ShareApp from '../Components/ShareApp';

/**
 * `ThemeChanger` is the root component that manages the application's overall theme (light/dark),
 * layout, and routing. It includes functionality to copy the app link to the clipboard for sharing.
 * 
 * Features:
 * - Theme toggle (light/dark)
 * - Persistent theme mode via localStorage
 * - Responsive layout with Navbar and Sidebar
 * - Clipboard support for sharing app link
 */
export default function ThemeChanger() {
    const getInitialMode = () => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode ? JSON.parse(savedMode) : false;
    };

    const [darkMode, setDarkMode] = useState(getInitialMode);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const body = document.body;
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        return () => {
            body.style.transition = '';
        };
    }, [darkMode]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
        transitions: {
            create: (props, options) => createTheme().transitions.create(props, {
                ...options,
                duration: '0.2s',
                easing: 'ease',
            }),
        },
        typography: {
            fontFamily: ['Montserrat', 'sans-serif'].join(','),
        }
    });

    /**
     * Toggles the application's theme mode between dark and light.
     * Updates the local state and persists the selected mode in localStorage.
     */
    const handleThemeToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('themeMode', JSON.stringify(newMode));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer position="top-center" autoClose={2000} theme={darkMode ? "dark" : "light"} />
            <Stack
                flexDirection='column'
                justifyContent='space-between'
                alignContent='center'
                height='100vh'
            >
                {/* All Routes of app */}
                <AppRoutes
                    darkMode={darkMode}
                    handleThemeToggle={handleThemeToggle}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                />
                {/* Share the app */}
                <ShareApp/>
            </Stack>
        </ThemeProvider>
    );
}
