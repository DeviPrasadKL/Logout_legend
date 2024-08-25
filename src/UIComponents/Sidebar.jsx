import React from 'react';
import { Box, List, ListItem, ListItemText, Divider } from '@mui/material';
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
            zIndex: 1, // Ensure it's behind the sidebar but in front of other content
          }}
        />
      )}
      <Box
        sx={{
          width: '50%',
          height: '100vh',
          backgroundColor: 'background.paper',
          position: 'fixed',
          top: 0,
          left: 0,
          transition: 'transform 0.3s ease-in-out',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 1300, // Make sure it's above the overlay
          '@media (max-width:600px)': {
            width: '70%',
          }
        }}
      >
        <List>
          <ListItem button onClick={() => navigateTo('/Logout_legend')}>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => navigateTo('/view_history')}>
            <ListItemText primary="View History" />
          </ListItem>
          <Divider />
          {/* Uncomment and add additional ListItems as needed */}
          {/* <ListItem button>
            <ListItemText primary="About" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="How it Works" />
          </ListItem> */}
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
