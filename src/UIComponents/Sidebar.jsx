import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    onClose();
    navigate(`${path}`);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: '40%', // Default width for larger screens
        flexShrink: 0,
        '@media (max-width:600px)': {
          width: '60%', // Adjust width for smaller screens if needed
        }
      }}
      PaperProps={{ sx: { width: '40%' } }} // Set width of the Drawer Paper component
    >
      <List>
        <ListItem button onClick={() => { navigateTo('/') }}>
          <ListItemText primary="Home" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => { navigateTo('/view_history') }}>
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
    </Drawer>
  );
};

export default Sidebar;
