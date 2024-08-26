import React, { lazy } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Stack } from '@mui/material';
import Loadable from './Lodable';
const ThemeSwitcher = Loadable(lazy(() => import('../UIComponents/ThemeSwitcher')));

/**
 * `LoginHoursSettings` is a functional React component that renders a dialog for configuring login hours.
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.setLoginHoursDialogOpen - Function to set the state of the login hours dialog's open/closed status.
 * @param {boolean} props.loginHoursDialogOpen - Boolean indicating if the login hours dialog is open.
 * @param {Object} props.loginHours - Object containing the login hours for weekdays and Saturdays.
 * @param {Function} props.handleLoginHoursSave - Function to handle saving the login hours settings.
 * @param {Function} props.handleLoginHoursChange - Function to handle changes to the login hours input fields.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function LoginHoursSettings({
    setLoginHoursDialogOpen,
    loginHoursDialogOpen,
    loginHours,
    handleLoginHoursSave,
    handleLoginHoursChange,
}) {
    return (
        <Box
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '2rem',
                    padding: '16px',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <Dialog open={loginHoursDialogOpen} onClose={() => setLoginHoursDialogOpen(false)}>
                <DialogTitle
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        borderBottom: '2.5px solid',
                        borderColor: 'divider',
                        paddingBottom: '16px',
                    }}
                >
                    Login Hours Settings
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    <Stack
                        alignItems="center"
                        spacing={2}
                        sx={{
                            marginBottom: '0.6rem',
                            marginTop: '1rem'
                        }}
                    >
                        {/* TextField for entering weekday login hours */}
                        <TextField
                            label="Weekday Hours"
                            type="number"
                            name="weekday"
                            value={loginHours.weekday}
                            onChange={handleLoginHoursChange}
                            inputProps={{ min: 0 }}
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'text.primary',
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                },
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        />
                        {/* TextField for entering Saturday login hours */}
                        <TextField
                            label="Saturday Hours"
                            type="number"
                            name="saturday"
                            value={loginHours.saturday}
                            onChange={handleLoginHoursChange}
                            inputProps={{ min: 0 }}
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'text.primary',
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                },
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* Button to close the dialog without saving changes */}
                    <Button onClick={() => setLoginHoursDialogOpen(false)} color="secondary">Cancel</Button>
                    {/* Button to save the changes made to login hours */}
                    <Button onClick={handleLoginHoursSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
