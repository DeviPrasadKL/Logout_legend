import React from 'react';
import { Stack, Switch } from '@mui/material';

/**
 * A component for toggling between light and dark mode themes with an enhanced stylish appearance.
 * @param {boolean} darkMode - Indicates whether dark mode is currently enabled.
 * @param {Function} handleThemeToggle - Function to toggle the theme mode.
 */
export default function ThemeSwitcher({ darkMode, handleThemeToggle }) {
    return (
        <Stack>
            <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                inputProps={{ 'aria-label': 'toggle theme' }}
                sx={{
                    '& .MuiSwitch-switchBase': {
                        color: darkMode ? 'secondary.main' : 'white',
                        '&.Mui-checked': {
                            color: darkMode ? 'primary.main' : 'white',
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