import { Box } from '@mui/material';
import React from 'react';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/**
 * `CloseConfirm` is a functional React component that renders a confirmation dialog.
 * 
 * This component is used to display a dialog with a title, content, and two action buttons for confirmation.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.openDialog - Boolean indicating if the dialog is open.
 * @param {Function} props.setOpenDialog - Function to set the state of the dialog's open/closed status.
 * @param {Function} props.handleDialogClose - Function to handle closing the dialog. It receives a boolean indicating the action taken (e.g., confirm or cancel).
 * @param {string} props.title - The title to display at the top of the dialog.
 * @param {string} props.content - The content to display within the dialog.
 * @param {string} props.no - The label for the 'No' button, typically used to cancel the action.
 * @param {string} props.yes - The label for the 'Yes' button, typically used to confirm the action.
 * 
 * @returns {JSX.Element} The rendered dialog component.
 */
export default function CloseConfirm({
    openDialog,
    setOpenDialog,
    handleDialogClose,
    title,
    content,
    no,
    yes
}) {
    return (
        <Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Typography>{content}</Typography>
                </DialogContent>
                <DialogActions>
                    {/* Button to handle the 'No' or cancel action */}
                    <Button onClick={() => handleDialogClose(false)} color="secondary">{no}</Button>
                    {/* Button to handle the 'Yes' or confirm action */}
                    <Button onClick={() => handleDialogClose(true)} color="primary">{yes}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
