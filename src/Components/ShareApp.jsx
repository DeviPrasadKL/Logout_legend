import React, { useState } from 'react';
import {
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import { notifyError, notifySuccess } from '../Utils/notify';
import { useOfflineEventTracker } from '../CustomHooks/useOfflineEventTracker';

export default function ShareApp() {
    const [open, setOpen] = useState(false);
    const [showQR, setShowQR] = useState(false);
    // Custom hook to get the event tracking function
    const { handleEvent } = useOfflineEventTracker();

    const link = 'https://logout-legend.onrender.com/';

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setShowQR(false);
    };

    const handleCopyLink = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link)
                .then(() => notifySuccess('Link copied to clipboard!'))
                .catch(err => {
                    console.error('Clipboard write failed:', err);
                    notifyError('Failed to copy link.');
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = link;
            textArea.style.position = "absolute";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                notifySuccess('Link copied to clipboard!');
            } catch (err) {
                console.error('Fallback copy failed:', err);
                notifyError('Failed to copy link.');
            }

            document.body.removeChild(textArea);
        }
        //Analytics 
        const eventData = {
            category: 'Share',
            action: 'Share App Link',
            label: 'Copy App Link',
        };

        // Custom hook's handleEvent function to either track or store events
        handleEvent(eventData);
    };

    const handleQRScan = () => {
        setShowQR(true);
        //Analytics 
        const eventData = {
            category: 'Share',
            action: 'QR Scan',
            label: 'Share via QR',
        };

        // Custom hook's handleEvent function to either track or store events
        handleEvent(eventData);
    }

    const handleShareViaWhatsApp = () => {
        //Analytics 
        const eventData = {
            category: 'Share',
            action: 'Share App Link via WhatsApp',
            label: 'Copy App Link via WhatsApp',
        };

        // Custom hook's handleEvent function to either track or store events
        handleEvent(eventData);
        const message = `Hey! Checkout this amazing login tracker app.\n\nYou can install it like a normal app on both Android and iOS 📱\n\nHere's the link: ${link}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div>
            {/* Trigger */}
            <Stack
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap={1}
                p={2}
                sx={{ color: 'grey', cursor: 'pointer' }}
                onClick={handleOpen}
            >
                <ShareIcon />
                <Typography variant="body2">Share the App</Typography>
            </Stack>

            {/* Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Share the App
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {!showQR ? (
                        <Stack spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyLink}
                                fullWidth
                            >
                                Copy App Link
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<QrCodeIcon />}
                                onClick={handleQRScan}
                                fullWidth
                            >
                                Open QR Code
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<WhatsAppIcon />}
                                onClick={handleShareViaWhatsApp}
                                fullWidth
                            >
                                Share via WhatsApp
                            </Button>
                        </Stack>
                    ) : (
                        <Stack alignItems="center" spacing={2}>
                            <img
                                src="/shareQR.png"
                                alt="QR Code"
                                width={220}
                                height={220}
                                style={{ marginTop: 8, borderRadius: '0.5rem' }}
                            />
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    {showQR ? (
                        <Button onClick={() => setShowQR(false)}>Back</Button>
                    ) : (
                        <Button onClick={handleClose}>Close</Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
