import React, { useState, useEffect } from 'react';
import {
    CssBaseline,
    createTheme,
    ThemeProvider,
    Stack,
    Typography,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyError, notifySuccess } from '../Utils/notify';
import AppRoutes from '../Router/AppRoutes';

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

    const handleThemeToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('themeMode', JSON.stringify(newMode));
    };

    /**
     * Shares a predefined message and app link via WhatsApp.
     * Opens WhatsApp Web or the WhatsApp app with a pre-filled message,
     * allowing the user to share the app link easily.
     */
    const handleShareViaWhatsApp = () => {
        const link = 'https://logout-legend.onrender.com/';
        const message = `Hey! Checkout this amazing login tracker app.\n\nYou can install it like a normal app on both Android and iOS 📱\n\nHere's the link: ${link}`;
        const encodedMessage = encodeURIComponent(message);

        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

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

                {/* Footer with Share link and attribution */}
                <Stack
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                    p={1}
                    sx={{ cursor: 'pointer', color: 'grey' }}
                    onClick={handleShareViaWhatsApp}
                >
                    <ShareIcon />
                    <Typography variant="body2">Share App Link</Typography>
                </Stack>
            </Stack>
        </ThemeProvider>
    );
}
