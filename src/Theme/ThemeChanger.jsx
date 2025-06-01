import React, { useState, useEffect } from 'react';
import {
    CssBaseline,
    createTheme,
    ThemeProvider,
    Stack,
    Typography,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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

    /**
     * Handles copying the app link to the user's clipboard with a secure and fallback method.
     * Shows a toast notification when successful.
     */
    const handleCopyLink = () => {
        const link = 'https://logout-legend.onrender.com/';

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link)
                .then(() => notifySuccess('Link copied to clipboard!'))
                .catch(err => {
                    console.error('Clipboard write failed:', err);
                    notifyError('Failed to copy link.');
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = link;
            textArea.style.position = "absolute";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                notifySuccess('Link copied to clipboard!');
            } catch (err) {
                console.error('Fallback copy failed:', err);
                notifyError('Failed to copy link.');
            }

            document.body.removeChild(textArea);
        }
    };

    /**
     * Shares the app link and a custom message via WhatsApp.
     * Opens WhatsApp in a new browser tab with a pre-filled message containing
     * information about the app and its installation instructions.
     */
    const handleShareViaWhatsApp = () => {
        const link = 'https://logout-legend.onrender.com/';
        const message = `Hey! Checkout this amazing login tracker app.\n\nYou can install it like a normal app on both Android and iOS 📱\n\nHere's the link: ${link}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
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

                {/* Footer with Share link and attribution */}
                <Stack
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={3}
                    p={1}
                    pb={2}
                    sx={{ color: 'grey' }}
                >
                    {/* Copy to Clipboard */}
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        gap={1}
                        sx={{ cursor: 'pointer' }}
                        onClick={handleCopyLink}
                    >
                        <ShareIcon />
                        <Typography variant="body2">Copy App Link</Typography>
                    </Stack>

                    {/* Share via WhatsApp */}
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        gap={1}
                        sx={{ cursor: 'pointer' }}
                        onClick={handleShareViaWhatsApp}
                    >
                        <WhatsAppIcon />
                        <Typography variant="body2">Share via WhatsApp</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </ThemeProvider>
    );
}
