import { Box, Modal, Typography } from "@mui/material"
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Checkbox, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import requestApi from '../../../../services/requestApi'
import { validationSchema } from '../util/validationSchema'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const LateRequestModal = ({ openLateRequest, handleCloseLateRequest }) => {
    const [date, setDate] = useState(dayjs(new Date()))
    const [content, setContent] = useState('')
    const [lateType, setLateType] = useState('')
    const [lateDuration, setLateDuration] = useState('')
    const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
    const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
    const currentUser = useSelector((state) => state.auth.login?.currentUser)
    const handleChange = (event) => {
      setLateType(event.target.value)
    }
    useEffect(() => {
      const fetchReceiveIdAndDepartment = async () => {
        const response = await requestApi.getReceiveIdAndDepartment(userId)
        setReceiveIdAndDepartment(response)
      }
      fetchReceiveIdAndDepartment()
    }, [])
  
    const formik = useFormik({
      initialValues: {
        title: '',
        content: '',
        lateType: '',
        lateDuration: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let data = {
          userId: userId,
          title: values.title,
          content: content,
          lateType: lateType,
          lateDuration: lateDuration,
          requestDate: date.format('YYYY-MM-DD'),
          departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
          receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
        }
        requestApi.requestLateForm(data)
      }
    })
  return (
    <Modal
      open={openLateRequest}
      onClose={handleCloseLateRequest}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  )
}

export default LateRequestModal
