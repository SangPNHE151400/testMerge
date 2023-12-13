import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../../services/constraint';
import axiosClient from '../../../../utils/axios-config';
import { formatDateTime } from '../../../../utils/formatDate';
import { validationSchema } from './util/validationSchema';
import { useEffect, useState } from 'react';
import requestApi from '../../../../services/requestApi';
import 'react-confirm-alert/src/react-confirm-alert.css';
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
  zIndex: 1000
};

const EditEmpLogAttendence = ({ openEditLog, handleCloseEditLog, dailyLogModal, userName, systemCheckIn,
  systemCheckOut, employeeId, date, manualCheckIn, manualCheckOut }) => {

  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId);

  let inputDateString = dailyLogModal?.dateDaily;

  let inputDate = new Date(inputDateString);

  let year = inputDate.getFullYear();
  let month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  let day = inputDate.getDate().toString().padStart(2, '0');

  let outputDateString = `${year}-${month}-${day}`;
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('');
  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId);
      setReceiveIdAndDepartment(response);
    };
    fetchReceiveIdAndDepartment();
  }, []);
  const [isTimePickerEnabled, setIsTimePickerEnabled] = useState(true);
  const editEmpLog = async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/saveChangeLog`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Update successfully!');
    } catch (error) {
      console.error('Error updating user information:', error);
      toast.error('Update failed. If both Manual CheckOut and Manual CheckIn are entered, Manual CheckOut must be later than Manual CheckIn.');
      
    }
  };
  const [isTimePickerEnabledOut, setIsTimePickerEnabledOut] = useState(true);

  // const handleSave = () => {
  //   event.preventDefault();
  //   console.log('handleSave called');
  //   confirmAlert({
  //     title: 'Confirmation',
  //     message: 'Are you sure you want to save?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => {
  //           console.log('Yes clicked');
  //           formik.handleSubmit();
  //             handleCloseEditLog();
  //         },
  //       },
  //       {
  //         label: 'No',
  //         onClick: () => {
  //           console.log('No clicked');
  //         },
  //       },
  //     ],
  //   });
  // };
  const [open, setOpen] = useState(false);
  const [isContentEmpty, setIsContentEmpty] = useState(true);


  const formik = useFormik({
    initialValues: {
      content: '',
      type: 'NONE',
      manualCheckIn: manualCheckIn,
      manualCheckOut: manualCheckOut,

    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        managerId: receiveIdAndDepartment?.managerInfoResponse?.managerId,
        manualCheckIn: formatDateTime(values.manualCheckIn),
        manualCheckOut: formatDateTime(values.manualCheckOut),
        type: values.type === "NONE" || values.type === "NOT_WORKING_OUTSIDE" ? null : values.type,
        date: outputDateString,
        changeType: 'FROM_EDIT',
        violet: values.violate ? 1 : 0,
        reason: values.content,
        employeeId: employeeId,
        workOutSide: values.workOutSide
      };
      editEmpLog(data);

    },
  })
  useEffect(() => {
    setIsContentEmpty(!formik.values.content.trim());
  }, [formik.values.content]);

  const handleSave = () => {
    event.preventDefault();
    if (!isContentEmpty) {
      setOpen(true);
    } else {
      toast.warning("Content cannot be left blank")
    }
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleConfirmSave = () => {
    console.log('Yes clicked');
    formik.handleSubmit();
    handleCloseEditLog();
    handleCloseDialog();
  };

  const handleCancelSave = () => {
    console.log('No clicked');
    handleCloseDialog();
  };

  console.log(employeeId);
  return (
    <Modal
      open={openEditLog}
      onClose={handleCloseEditLog}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box p={3} pl={0}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight="700" fontSize="18px">
                  Edit Log
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
              <Grid item xs={12} mb={2}>
                <Typography fontWeight="500">Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={date}
                    disabled
                    renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}

                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} mb={2}>
                <Typography fontWeight="500">System CheckIn</Typography>
                <TextField
                  disabled
                  value={systemCheckIn !== null ? formatDateTime(new Date(`2000-01-01T${systemCheckIn}`), 'hh:mm:ss') : 'null'}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={6} mb={2}>
                <Typography fontWeight="500">System CheckOut</Typography>
                <TextField
                  disabled
                  value={systemCheckOut !== null ? formatDateTime(new Date(`2000-01-01T${systemCheckOut}`), 'hh:mm:ss') : 'null'}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={6} mb={2}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={!isTimePickerEnabled}
                    onChange={() => {
                      setIsTimePickerEnabled(!isTimePickerEnabled);
                      formik.setFieldValue(
                        'manualCheckIn',
                        isTimePickerEnabled ? new Date('2000-01-01T12:00:00') : null
                      );
                    }}
                    sx={{ padding: '0 0 0 5px' }}
                  />
                  <Typography fontWeight="600" ml={1}>Manual CheckIn</Typography>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {isTimePickerEnabled ? (
                      <TextField
                        sx={{ width: '100%' }}
                        disabled
                        value={null}
                      />
                    ) : (
                      <TimePicker
                        value={formik.values.manualCheckIn}
                        onChange={(date) => formik.setFieldValue('manualCheckIn', date)}
                        renderInput={(props) => (
                          <TextField
                            sx={{ width: '100%' }}
                            {...props}
                          />
                        )}
                      />
                    )}
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={6} mb={2}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={!isTimePickerEnabledOut}
                    onChange={() => {
                      setIsTimePickerEnabledOut(!isTimePickerEnabledOut);
                      formik.setFieldValue(
                        'manualCheckOut',
                        isTimePickerEnabledOut ? new Date('2000-01-01T12:00:00') : null
                      );
                    }}
                    sx={{ padding: '0 0 0 5px' }}
                  />
                  <Typography fontWeight="500" ml={1}>Manual CheckOut</Typography>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {isTimePickerEnabledOut ? (
                      <TextField
                        sx={{ width: '100%' }}
                        disabled
                        value={null}
                      />
                    ) : (
                      <TimePicker
                        value={formik.values.manualCheckOut}
                        onChange={(date) => formik.setFieldValue('manualCheckOut', date)}
                        renderInput={(props) => (
                          <TextField
                            sx={{ width: '100%' }}
                            {...props}
                          />
                        )}
                      />
                    )}
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={6}>
                Type
                <Select
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value === "NONE") {
                      formik.setFieldValue('value', null);
                      formik.setFieldValue('workOutSide', -1);
                    } else if (e.target.value === "MORNING") {
                      formik.setFieldValue('value', "MORNING");
                      formik.setFieldValue('workOutSide', 0.5);
                    } else if (e.target.value === "AFTERNOON") {
                      formik.setFieldValue('value', "AFTERNOON");
                      formik.setFieldValue('workOutSide', 0.5);
                    } else if (e.target.value === "ALL_DAY") {
                      formik.setFieldValue('value', "ALL_DAY");
                      formik.setFieldValue('workOutSide', 1);
                    } else if (e.target.value === "NOT_WORKING_OUTSIDE") {
                      formik.setFieldValue('value', null);
                      formik.setFieldValue('workOutSide', 0);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  sx={{ width: '100%' }}
                  name="type"
                  displayEmpty
                >
                  <MenuItem value="NONE">NONE</MenuItem>
                  <MenuItem value="MORNING">MORNING</MenuItem>
                  <MenuItem value="AFTERNOON">AFTERNOON</MenuItem>
                  <MenuItem value="ALL_DAY">ALL DAY</MenuItem>
                  <MenuItem value="NOT_WORKING_OUTSIDE">NOT WORKING OUTSIDE</MenuItem>
                </Select>
              
                
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="500">Violate</Typography>
                <Checkbox
                  checked={formik.values.violate}
                  onChange={() => formik.setFieldValue('violate', !formik.values.violate)}
                  sx={{ padding: '0 0 0 5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="500">Content</Typography>
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
              <Button type="submit" variant="contained" sx={{ marginRight: '10px' }} onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" onClick={handleCloseEditLog}>
                Cancel
              </Button>
            </Box>
            <Dialog open={open} onClose={handleCloseDialog}>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <p>Are you sure ? All your actions that affect others will be your responsibility</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleConfirmSave} color="primary">
                  Yes
                </Button>
                <Button onClick={handleCancelSave} color="primary">
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditEmpLogAttendence;
