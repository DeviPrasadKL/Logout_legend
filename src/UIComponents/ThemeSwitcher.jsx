import React from 'react';
import { Stack, Typography, Switch } from '@mui/material';

/**
 * A component for toggling between light and dark mode themes with an enhanced stylish appearance.
 * @param {boolean} darkMode - Indicates whether dark mode is currently enabled.
 * @param {Function} handleThemeToggle - Function to toggle the theme mode.
 */
export default function ThemeSwitcher({ darkMode, handleThemeToggle }) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
            width='100%'
            spacing={2}
            sx={{
                padding: '8px 16px',
                borderRadius: '8px',
                // backgroundColor: darkMode ? 'grey.800' : 'grey.200',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                ':hover': {
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                },
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    color: darkMode ? 'text.primary' : 'text.secondary',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'color 0.3s ease',
                }}
            >
                {darkMode ? 'Dark Mode' : 'Light Mode'}
            </Typography>
            <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                inputProps={{ 'aria-label': 'toggle theme' }}
                sx={{
                    '& .MuiSwitch-switchBase': {
                        color: darkMode ? 'secondary.main' : 'primary.main',
                        '&.Mui-checked': {
                            color: darkMode ? 'secondary.main' : 'primary.main',
                        },
                        '&.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: darkMode ? 'primary.dark' : 'secondary.main',
                        },
                    },
                    '& .MuiSwitch-track': {
                        backgroundColor: darkMode ? 'grey.800' : 'grey.400',
                        borderRadius: '12px',
                        transition: 'background-color 0.3s ease',
                    },
                }}
            />
        </Stack>
    );
};