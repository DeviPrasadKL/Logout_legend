import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = ({ onMenuClick, darkMode, handleThemeToggle }) => {
  return (
    <AppBar position="sticky" sx={{ top: 0, left: 0, right: 0 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Stack flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
          <Typography variant="h6">
            Login Tracker
          </Typography>

          {/* ThemeSwitcher component allows toggling between dark and light themes */}
          <ThemeSwitcher
            darkMode={darkMode}
            handleThemeToggle={handleThemeToggle}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
