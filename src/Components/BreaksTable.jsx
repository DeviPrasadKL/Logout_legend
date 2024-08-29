import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BreaksTable({breaks, handleDeleteBreak, canDeleteBreak, calculateTotalBreakDuration, timeOptions}) {
    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Actions</TableCell> {/* New column for delete icon */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {breaks.map((breakRecord, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(breakRecord.start).toLocaleTimeString('en-US', timeOptions)}</TableCell>
                                <TableCell>{new Date(breakRecord.end).toLocaleTimeString('en-US', timeOptions)}</TableCell>
                                <TableCell>{breakRecord.duration}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleDeleteBreak(index)}
                                        color="error"
                                        disabled={!canDeleteBreak(breakRecord.end)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>Total Break Duration</TableCell>
                            <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>{calculateTotalBreakDuration()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
