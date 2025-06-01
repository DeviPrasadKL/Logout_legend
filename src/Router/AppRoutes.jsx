import React from 'react'
import Logout from '../Components/Logout';
import Navbar from '../UIComponents/Navbar';
import Sidebar from '../UIComponents/Sidebar';
import RecordsViewer from '../Components/RecordsViewer';
import About from '../Components/About';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

export default function AppRoutes({darkMode ,handleThemeToggle, setSidebarOpen, sidebarOpen}) {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                }}
            >
                <Navbar onMenuClick={() => setSidebarOpen(true)} darkMode={darkMode} handleThemeToggle={handleThemeToggle} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <Routes>
                    <Route
                        exact path="/"
                        element={<Logout darkMode={darkMode} handleThemeToggle={handleThemeToggle} />}
                    />
                    <Route path="/view_history" element={<RecordsViewer />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Box>
        </>
    )
}
