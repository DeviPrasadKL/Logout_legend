// ConfirmationDialog.js

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

/**
 * A dialog component for confirming record replacement.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.open - Whether the dialog is open or closed.
 * @param {Function} props.onClose - Function to call when the dialog is closed.
 * @param {Function} props.onConfirm - Function to call when the user confirms the replacement.
 * 
 * @returns {JSX.Element} The dialog component.
 */
const RecordExistsConfirm = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Confirm Replacement</DialogTitle>
            <DialogContent>
                <p>A record for today already exists. Do you want to replace it?</p>
            </DialogContent>
            <DialogActions>
                {/* Button to cancel the operation */}
                <Button onClick={() => onClose(false)}>No</Button>
                {/* Button to confirm the replacement */}
                <Button onClick={() => onClose(true)}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecordExistsConfirm;
