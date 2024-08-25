import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { Home as HomeIcon, History as HistoryIcon, Info as InfoIcon } from '@mui/icons-material'; // Importing necessary icons
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    onClose();
    navigate(`${path}`);
  };

  return (
    <>
      {open && (
        <Box
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1200,  // Higher z-index
          }}
        />
      )}
      <Box
        sx={{
          width: '70%',
          height: '100vh',
          backgroundColor: 'background.paper',
          position: 'fixed',
          top: 0,
          left: 0,
          transition: 'transform 0.3s ease-in-out',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 1300,  // Higher z-index than overlay
          display: 'flex',
          flexDirection: 'column',
          '@media (min-width:600px)': {
            width: '30%',  // Wider for larger screens
          }
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            padding: '1.5rem',
            backgroundColor: '#003366', // Professional dark blue color
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional shadow for depth
          }}
        >
          <Typography variant="h6">Login Tracker</Typography>
        </Box>

        {/* Navigation List */}
        <List sx={{ paddingTop: '8px' }}>
          <ListItem button onClick={() => navigateTo('/Logout_legend')}>
            <HomeIcon sx={{ mr: 2 }} />  {/* Icon for Home */}
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => navigateTo('/view_history')}>
            <HistoryIcon sx={{ mr: 2 }} />  {/* Icon for View History */}
            <ListItemText primary="View History" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => navigateTo('/about')}>
            <InfoIcon sx={{ mr: 2 }} />  {/* Icon for About */}
            <ListItemText primary="About" />
          </ListItem>
          <Divider />
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
