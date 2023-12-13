import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import attendanceApi from '../../../services/attendanceApi'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
import EvaluateTable from './component/DataTable'

ClassicEditor.defaultConfig = {
    toolbar: {
      items: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList']
    },
    language: 'en'
  }
const CreateEvaluate = () => {
    // const currentUser = useSelector((state) => state.auth.login?.currentUser)

    const [loading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [userAttendance, setUserAttendance] = useState('')
    const [dailyLog, setDailyLog] = useState([])
    const [status, setStatus] = useState(0)
    const [content, setContent] = useState('')
    useEffect(() => {
        const fetchAllUserAttendance = async () => {
            setIsLoading(true)
            try {
                const response = await attendanceApi.getAttendanceUser(
                    "64658030-0c8e-42a0-9605-4393edeb346a",
                    11, 2023
                )
                setUserAttendance(response)
                setDailyLog(response?.dailyLogList)
            } catch (error) {
                console.error('Error fetching user attendance:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllUserAttendance()
    }, [])

    const columns = [
        {
            field: 'dateDaily',
            headerName: 'Date',
            width: 280
        },
        {
            field: 'totalAttendance',
            headerName: 'Total Attendance',
            width: 100
        },
        {
            field: 'morningTotal',
            headerName: 'Total Morning',
            width: 100
        },
        {
            field: 'afternoonTotal',
            headerName: 'Total Afternoon',
            width: 100
        },
        {
            field: 'lateCheckin',
            headerName: 'Late Check In',
            valueGetter: ({ value }) => {
                return value === true ? 1 : 0
            },
            width: 150,
        },
        {
            field: 'earlyCheckout',
            headerName: 'Early Check Out',
            valueGetter: ({ value }) => {
                return value === true ? 1 : 0
            },
            width: 150,
        },
        {
            field: 'permittedLeave',
            headerName: 'Permitted Leave',
            width: 150,

        },
        {
            field: 'nonPermittedLeave',
            headerName: 'Non Permitted Leave',
            width: 200,

        },
        {
            field: 'violate',
            headerName: 'Violate',
            valueGetter: ({ value }) => {
                return value === true ? 1 : 0
            },
            width: 150,

        },

        {
            field: 'paidDay',
            headerName: 'Paid Day',
            width: 120,
        }
    ]
    const handleChange = (e) => {
        setStatus(e)
    }

    return (
        <Box>
            <ChatTopbar />
            <Box sx={{ padding: '20px' }}>
                <Box sx={{ mb: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Employee</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                InputProps={{ readOnly: true }}
                                value={userAttendance?.username}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Hire Date</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                value={userAttendance?.date}
                                InputProps={{ readOnly: true }}

                            />
                        </Grid>

                        <Grid item xs={6} >
                            <Typography>Account</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                InputProps={{ readOnly: true }}
                                value='ddddddd'
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <Typography>Department</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                InputProps={{ readOnly: true }}
                                value={userAttendance?.department}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={1}>
                    <TableContainer >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 1, padding: '8px' } }}
                                >
                                    <TableCell component="th" scope="row">
                                        Total
                                    </TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.totalAttendance}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.morningTotal.toFixed(2)}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.afternoonTotal}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.lateCheckinTotal}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.earlyCheckoutTotal}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.permittedLeave}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.nonPermittedLeave.toFixed(2)}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.violateTotal}</TableCell>
                                    <TableCell align="center">{userAttendance?.totalAttendanceUser?.paidDay.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box mt={2}>
                    <Button variant='contained' onClick={() => setShow(show ? false : true)} >
                        {show ? (<>Hide Detail</>) : (<>Show Detail</>)}
                    </Button>
                </Box>
                {
                    show && <Box mt={2}>
                        <EvaluateTable
                            rows={dailyLog}
                            columns={columns}
                            isLoading={loading} />
                    </Box>
                }

                <Box display='flex' gap={3} alignItems='center' mt={3}>
                    <Typography>Evaluate of Manager : </Typography>
                    <FormControl sx={{ width: '200px' }}>
                        <InputLabel id="demo-simple-select-label"></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            label="status"
                            name='status'
                            onChange={(e) => handleChange(e.target.value)}
                        >
                            <MenuItem value={0} >GOOD</MenuItem>
                            <MenuItem value={1}>NORMAL</MenuItem>
                            <MenuItem value={2}>BAD</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mt={2}>
                    <Typography fontWeight="500">Note</Typography>
                    <CKEditor
                        data={content}
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }} />
                </Box>
                <Box display='flex' justifyContent='space-between' mt={2}>
                    <Button variant='contained'>Back</Button>
                    <Button variant='contained'>Send</Button>
                </Box>
            </Box>


        </Box>
    )
}

export default CreateEvaluate
