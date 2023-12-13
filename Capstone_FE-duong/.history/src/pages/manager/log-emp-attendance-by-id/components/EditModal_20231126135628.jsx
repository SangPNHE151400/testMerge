import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Checkbox, Grid, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import requestApi from '../../../../services/requestApi';
import axiosClient from '../../../../utils/axios-config';
import { BASE_URL } from '../../../../services/constraint';
import { toast } from 'react-toastify';
import { validationSchema } from './util/validationSchema';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditEmpLogAttendence = ({ openLateRequest, handleCloseLateRequest, dailyLogModal, userName }) => {
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('');
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId);

  let inputDateString = dailyLogModal?.dateDaily;

  let inputDate = new Date(inputDateString);

  let year = inputDate.getFullYear();
  let month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  let day = inputDate.getDate().toString().padStart(2, '0');

  let outputDateString = `${year}-${month}-${day}`;

  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId);
      setReceiveIdAndDepartment(response);
    };
    fetchReceiveIdAndDepartment();
  }, []);

  const editEmpLog = async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/saveChangeLog`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Update successfully!');
      handleCloseLateRequest();
    } catch (error) {
      console.error('Error updating user information:', error);
      toast.error('Update failed. Please try again.');
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      type: '',
      manualCheckIn: new Date(),
      manualCheckOut: new Date(),
      violate: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        managerId: receiveIdAndDepartment?.managerInfoResponse?.managerId,
        manualCheckIn: values.manualCheckIn.toISOString(),
        manualCheckOut: values.manualCheckOut.toISOString(),
        type: values.type,
        date: outputDateString,
        changeType: 'FROM_EDIT',
        violet: values.violate ? 1 : 0,
        employeeId: userId,
        reason: values.content, // Adding reason field
      };

      editEmpLog(data);
    },
  });

  return (
    <Modal
      open={openLateRequest}
      onClose={handleCloseLateRequest}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box p={3} pl={0}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight="700" fontSize="18px">
                  Late Request
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="500">Account</Typography>
                <TextField
                  name="title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={userName}
                  sx={{ width: '100%' }}
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={4} mb={2}>
                <Typography fontWeight="500">System CheckIn</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    disabled
                    value={outputDateString}
                    renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4} mb={2}>
                <Typography fontWeight="500">System CheckOut</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    disabled
                    value={outputDateString}
                    renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={5} mb={2}>
                <Typography fontWeight="500">Manual CheckIn</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={formik.values.manualCheckIn}
                    onChange={(date) => formik.setFieldValue('manualCheckIn', date)}
                    renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={5} mb={2}>
                <Typography fontWeight="500">Manual CheckOut</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={formik.values.manualCheckOut}
                    onChange={(date) => formik.setFieldValue('manualCheckOut', date)}
                    renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                Type
                <Select
                  onChange={(e) => formik.handleChange(e)}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  sx={{ width: '100%' }}
                  name="type"
                  displayEmpty
                >
                  <MenuItem value="NONE">NONE</MenuItem>
                  <MenuItem value="MORNING">MORNING</MenuItem>
                  <MenuItem value="AFTERNOON">AFTERNOON</MenuItem>
                  <MenuItem value="ALL_DAY">All DAY</MenuItem>
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <Typography sx={{ color: 'red' }} className="error-message">
                    {formik.errors.type}
                  </Typography>
                )}
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }} item xs={12}>
                <Typography fontWeight="500">Violate</Typography>
                <Checkbox
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.violate}
                  sx={{ padding: '0 0 0 5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="500">Reason</Typography>
                <CKEditor
                  editor={ClassicEditor}
                  data={formik.values.content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    formik.setFieldValue('content', data);
                  }}
                />
                {formik.touched.content && formik.errors.content ? (
                  <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                    {formik.errors.content}
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
            <Box pt={2} display="flex" alignItems="flex-end">
              <Button type="submit" variant="contained" sx={{ marginRight: '10px' }}>
                Save
              </Button>
              <Button variant="contained" onClick={handleCloseLateRequest}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditEmpLogAttendence;
