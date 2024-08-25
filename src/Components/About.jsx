import React from 'react';
import { Typography, Button, Grid, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const sentences = [
  "Logout Legend is designed to help you manage your login and break times, allowing you to stay focused on productivity without the hassle of tracking these details manually.",
  "Track Login Times: Automatically record when you log in and out.",
  "Break Duration Monitoring: Keep track of your break times to ensure they’re within your desired limits.",
  "Productivity Focus: Minimize distractions related to time management, so you can concentrate on your work.",
  "Logout Button: Added a 'Logout' button to track and record the logout time.",
  "Logout Details: Displays the logout time and total logged-in hours.",
  "Download Report: Added a 'Download Report' button to export the day's details to an Excel sheet.",
  "Download Previous Day's Data: Option to download the previous day's data in an Excel sheet for review.",
  "View History: Users can view their details for the previous 5 days to analyze their work patterns.",
  "Clear Data Button: The 'Clear Data' button is now visible only after the user has logged out.",
  "Light/Dark Mode Toggle: Moved the light/dark mode toggle to the settings section.",
  "Smooth Mode Transition: Implemented a smooth transition effect for switching between light and dark modes.",
  "Break Deletion Restriction: Users are restricted from deleting breaks after a 2-minute window."
];

const HowItWorksSteps = [
  "Login Tracking: Start your workday by logging into the app. Your login time will be recorded automatically.",
  "Break Management: Use the app to log breaks. You can set reminders or alerts to ensure you take regular breaks without losing track of time.",
  "Logout Notification: When it’s time to end your workday, the app will help you remember to log out. The 'Logout' button will record your logout time and update your total logged-in hours.",
  "Download Report: At the end of the day, use the 'Download Report' button to export your day’s details to an Excel sheet for detailed analysis.",
  "Download Previous Day's Data: You can download the previous day's data in an Excel sheet to review and analyze your past day's performance.",
  "View History: Access and view your details for the past 5 days, allowing you to track and analyze your work habits over the recent past.",
  "Clear Data: The 'Clear Data' button will appear only after you have logged out, allowing you to manage your data efficiently.",
  "Light/Dark Mode: Toggle between light and dark modes from the settings section with a smooth transition effect."
];

const benefits = [
  "Enhanced Productivity: By automating time tracking, you can focus more on your work and less on managing your schedule.",
  "Efficient Breaks: Keep your breaks structured and productive, ensuring you’re refreshed and ready to work.",
  "Better Time Management: Gain insights into your work habits and make adjustments as needed.",
  "Detailed Reporting: Export your daily details to an Excel sheet for a thorough review of your work patterns. Additionally, download the previous day's data for specific analysis.",
  "Historical View: Access and review your work details for the past 5 days to understand your recent work trends.",
  "User-Friendly Interface: Enjoy a smooth experience with easy access to logout and report features, and a visually pleasing transition between light and dark modes."
];

const Support = () => (
  <Typography variant="body1" paragraph>
    If you have any questions or need assistance, feel free to contact us <a href="https://github.com/DeviPrasadKL/Logout_legend/issues" target="_blank" rel="noopener noreferrer">here</a>.
  </Typography>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <Box mx={2} mt={1} mb={4}>
      <Typography variant="h4" gutterBottom>
        Logout Legend
      </Typography>
      <Typography variant="body1" paragraph>
        {sentences.map((sentence, index) => (
          <List key={index}>
            <ListItem>
              <ListItemText primary={`${index + 1}. ${sentence}`} />
            </ListItem>
            <Divider />
          </List>
        ))}
      </Typography>

      <Typography variant="h5" gutterBottom>
        How It Works
      </Typography>
      <List>
        {HowItWorksSteps.map((step, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${index + 1}. ${step}`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>
        Getting Started
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="body1">
                1. Install the App: Click on <a href="https://logout-legend.onrender.com" target="_blank" rel="noopener noreferrer">this link</a> to install the Progressive Web App. It’s lightweight and can be easily added to your mobile home screen.
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="2. Set Up Your Preferences: Customize your settings including break reminders and mode preferences." />
        </ListItem>
        <ListItem>
          <ListItemText primary="3. Start Using: Begin your workday and let Logout Legend handle the time tracking and break management." />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Benefits
      </Typography>
      <List>
        {benefits.map((benefit, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${index + 1}. ${benefit}`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>
        Support
      </Typography>
      <Support />

      <Grid container spacing={2} marginTop={2}>
        <Grid item>
          <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/Logout_legend')}>
            Home
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<HistoryIcon />} onClick={() => navigate('/view_history')}>
            View History
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
