import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Button
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import useAuth from '../../../hooks/useAuth'
import { formatDateNotTime } from '../../../utils/formatDate'
import attendanceApi from '../../../services/attendanceApi'

const EvaluateReport = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)

  const [month, setMonth] = useState(new Date())
  const [evaluate, setEvaluate] = useState('')
  const setMonthYear = (newDate) => {
    setMonth(newDate)
  }
  const [minDate, setMinDate] = useState(new Date('1990'))
  const maxDate = new Date()
  const userInfo = useAuth()
  useEffect(() => {
    const fetchAllEvaluateAttendance = async () => {
      let data = {
        userId: currentUser?.accountId,
        month: format(month, 'MM'),
        year: format(month, 'yyyy')
      }

      try {
        const response = await axiosClient.post(`${BASE_URL}/getIndividualEvaluate`, data)
        console.log(data)
        console.log(response)
        if (response && response.hireDate) {
          setMinDate(new Date(response.hireDate))
        }
        setEvaluate(response)
        return response
      } catch (error) {
        setEvaluate('')
      }
    }

    fetchAllEvaluateAttendance()
  }, [month])

  const handleExportIndividualEvaluate = async () => {
    let data = {
      userId: currentUser?.accountId,
      month: format(month, 'MM'),
      year: format(month, 'yyyy')
    }
    const res = await attendanceApi.exportIndividualEvaluate(data)
    const base64Data = res?.file
    if (!base64Data) {
      return
    }

    const binaryData = atob(base64Data)
    const byteNumbers = new Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      byteNumbers[i] = binaryData.charCodeAt(i)
    }
    const uint8Array = new Uint8Array(byteNumbers)

    const blob = new Blob([uint8Array], {
      type: res?.fileContentType
    })

    const blobUrl = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = res?.fileName
    downloadLink.click()
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
              value={`${userInfo.firstName} ${userInfo.lastName}`}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Hire Date</Typography>
            <TextField
              sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
              InputProps={{ readOnly: true }}
              value={formatDateNotTime(userInfo.hireDate)}
            />
          </Grid>

          <Grid item xs={6} sx={{ marginTop: '-20px' }}>
            <Typography>Department</Typography>
            <TextField
              sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
              InputProps={{ readOnly: true }}
              value={userInfo.departmentName}
            />
          </Grid>
        </Grid>

        <Grid item xs={6} width="48%" mt={2}>
          <Typography fontWeight="500">Report By Month-Year</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year', 'month']}
              openTo="year"
              value={month}
              onChange={(newDate) => setMonthYear(newDate.toDate())}
              renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              maxDate={maxDate}
              minDate={minDate}
            />
          </LocalizationProvider>
        </Grid>

        {evaluate !== '' ? (
          <>
            <Grid item xs={6} width="10%" mt={2}>
              <Button
                onClick={handleExportIndividualEvaluate}
                variant="contained"
                sx={{ bgcolor: 'yellow', color: '#000' }}>
                Export
              </Button>
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
                    <TableCell style={{ textAlign: 'center' }}>
                      {evaluate.totalAttendance}
                    </TableCell>
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
                    <TableCell style={{ textAlign: 'center' }}>
                      {evaluate.nonPermittedLeave}
                    </TableCell>
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
            <Typography dangerouslySetInnerHTML={{ __html: evaluate?.note }}></Typography>
          </>
        ) : (
          <Typography mt={3} fontSize="18px">
            No data found
          </Typography>
        )}
      </Paper>
    </>
  )
}

export default EvaluateReport
