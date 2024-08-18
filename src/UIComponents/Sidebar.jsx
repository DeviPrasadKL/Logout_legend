import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {

  const navigate = useNavigate();

  const navigateTo = (path) => {
    onClose();
    navigate(`${path}`);
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <List>
        <ListItem button>
          <ListItemText primary="Home" onClick={() => { navigateTo('/Logout_legend') }} />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="View History" onClick={() => { navigateTo('/view_history') }} />
        </ListItem>
        <Divider />
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
