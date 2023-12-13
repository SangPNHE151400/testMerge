import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../../../services/constraint'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '../../../utils/axios-config'
const CheckEmpEvaluateReport = () => {
    const { employee_id, date} = useParams();
    console.log('Month from URL:', date);
    const [evaluate, setEvaluate] = useState([])
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    const buttonStyle = {
        width: '80px',
        marginLeft: '10px',
        fontSize: '12px',
    };
    const updateAcceptOrRejectEvaluateByHr = async (data) => {
        try {
            await axiosClient.post(`/updateAcceptOrRejectEvaluateByHr`, data);
            toast.success('Send request successfully');
        } catch (error) {
            if (error.response.status === 400) {
                toast.error('Can not accept or reject!');
            }
            if (error.response.status === 404) {
                toast.error('Something went wrong!');
            }
        }
    };


    const navigateBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        const fetchAllEvaluateAttendance = async () => {
            let data = {
                userId: employee_id,
                month: date.split('-')[0],
                year: date.split('-')[1]
          
            };
            try {
                const response = await axiosClient.post(
                    `${BASE_URL}/getIndividualEvaluate`,
                    data
                );
                console.log('Data:', data);
                console.log('Employee ID:', employee_id);
                console.log('Response:', response);
                setEvaluate(response);
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchAllEvaluateAttendance();
    }, [employee_id, date]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenReject, setDialogOpenReject] = useState(false);
    const [hrNote, setHrNote] = useState('');

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogRejectOpen = () => {
        setDialogOpenReject(true);
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleDialogRejectClose = () => {
        setDialogOpenReject(false);
    }
    const handleSendAccept = async () => {
        const data = {
            hrId: currentUser?.accountId,
            hrNote: hrNote,
            evaluateId: evaluate.evaluateId,
            hrStatus: true,
        };
        try {
            await updateAcceptOrRejectEvaluateByHr(data);
            setTimeout(navigateBack, 500);
        } catch (error) {
            toast.warning('Send request fail');
        }
    };

    // const handleAccept = async () => {
    //   const data = {
    //     hrId: currentUser?.accountId,
    //     hrNote: 'Accepted',
    //     evaluateId: evaluate.evaluateId,
    //     hrStatus: true,
    //   };
    //   console.log('Accept Data:', data);
    //   await updateAcceptOrRejectEvaluateByHr(data);
    // }
    const handleReject = async () => {
        const data = {
            hrId: currentUser?.accountId,
            hrNote: hrNote,
            evaluateId: evaluate.evaluateId,
            hrStatus: false,
        };
        try {
            await updateAcceptOrRejectEvaluateByHr(data);
            setTimeout(navigateBack, 500);
        } catch (error) {
            toast.warning('Send request fail');
        }
    }
    return (
        <>
            <Paper style={{ padding: '20px' }}>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <Typography>User Name</Typography>
                        <TextField
                            sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                            InputProps={{ readOnly: true }}
                            value={`${evaluate.firstNameEmp} ${evaluate.lastNameEmp}`}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>Hire Date</Typography>
                        <TextField
                            sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                            InputProps={{ readOnly: true }}
                            value={
                                evaluate.hireDate ? format(new Date(evaluate.hireDate), 'yy-MM-dd HH:mm:ss') : ''
                            }
                        />
                    </Grid>

                    <Grid item xs={6} sx={{ marginTop: '-20px' }}>
                        <Typography>Department</Typography>
                        <TextField
                            sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                            InputProps={{ readOnly: true }}
                            value={`${evaluate.department?.departmentName || 'N/A'}`}
                        />
                    </Grid>
                </Grid>
                <TableContainer
                    component={Paper}
                    elevation={3}
                    style={{ marginLeft: '20px', marginTop: '20px', marginBottom: '20px', width: '47%' }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ width: '50%' }}>Working day(day):</TableCell>
                                <TableCell style={{ textAlign: 'center', width: '50%' }}>
                                    {evaluate.workingDay}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total attendance(h):</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{evaluate.totalAttendance}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Late(h):</TableCell>
                                <TableCell
                                    style={{
                                        textAlign: 'center',
                                        color:
                                            evaluate.lateCheckin > 2
                                                ? 'red'
                                                : evaluate.lateCheckin > 0
                                                    ? '#EC8F5E'
                                                    : evaluate.lateCheckin === 0
                                                        ? 'green'
                                                        : 'black'
                                    }}>
                                    {evaluate.lateCheckin}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Permitted leave:</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{evaluate.permittedLeave}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> non-permitted leave:</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{evaluate.nonPermittedLeave}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Overtime (h):</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{evaluate.overTime}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Violate (times):</TableCell>
                                <TableCell
                                    style={{
                                        textAlign: 'center',
                                        color:
                                            evaluate.violate > 3 ? 'red' : evaluate.violate >= 1 ? '#EC8F5E' : 'green'
                                    }}>
                                    {evaluate.violate}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Paid day(day):</TableCell>
                                <TableCell style={{ textAlign: 'center' }}> {evaluate.paidDay}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                    Evaluate of Manager:{' '}
                    <span
                        style={{
                            color:
                                evaluate.evaluateEnum === 'GOOD'
                                    ? 'green'
                                    : evaluate.evaluateEnum === 'BAD'
                                        ? 'red'
                                        : 'black'
                        }}>
                        {`${evaluate.evaluateEnum}`}
                    </span>
                </Typography>
                <Typography>Note</Typography>
                <TextField
                    sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                    InputProps={{ readOnly: true }}
                    multiline
                    rows={8}
                    value={`${evaluate.note}`}
                />
                <Grid container justifyContent="flex-end" marginTop="10px">
                    {evaluate.approvedDate === null && (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                style={buttonStyle}
                                onClick={handleDialogOpen}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ ...buttonStyle, marginLeft: '10px' }}
                                onClick={handleDialogRejectOpen}
                            >
                                Reject
                            </Button>

                            <Dialog open={dialogOpenReject} onClose={handleDialogRejectClose}>
                                <DialogTitle>Enter HR Note</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="HR Note"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                        value={hrNote}
                                        onChange={(e) => setHrNote(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleReject} color="primary">
                                        Send
                                    </Button>
                                    <Button onClick={handleDialogRejectClose} color="primary">
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>


                            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                                <DialogTitle>Enter HR Note</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="HR Note"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                        value={hrNote}
                                        onChange={(e) => setHrNote(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleSendAccept} color="primary">
                                        Send
                                    </Button>
                                    <Button onClick={handleDialogClose} color="primary">
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )}
                </Grid>

                <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    style={{
                        width: '80px',
                        marginLeft: '10px',
                        fontSize: '12px',
                    }}
                >
                    Back
                </Button>

            </Paper>
        </>
    )
}

export default CheckEmpEvaluateReport
