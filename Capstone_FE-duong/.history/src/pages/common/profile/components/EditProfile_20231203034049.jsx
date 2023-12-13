import {
  Box,
  Button,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
const EditProfile = (props) => {
  return (
    <>
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Grid item container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                value={props.firstName}
                label="First name"
                onChange={props.formik.handleChange}
                name="firstName"
                onBlur={props.formik.handleBlur}
                nBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.firstName && props.formik.errors.firstName ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.firstName}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last name"
                value={props.lastName}
                onChange={props.formik.handleChange}
                name="lastName"
                onBlur={props.formik.handleBlur}
                nBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.lastName && props.formik.errors.lastName ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.lastName}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={props.email}
                required
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.email && props.formik.errors.email ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.email}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={props.phone}
                name="phone"
                type="text"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.phone && props.formik.errors.phone ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.phone}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of birth"
                  value={props.userInfo.dateOfBirth !== 'unknown' ? props.birthUpdate : props.birth}
                  onChange={
                    props.userInfo.dateOfBirth !== 'unknown'
                      ? (newValue) => props.setBirthUpdate(newValue)
                      : (newValue) => props.setBirth(newValue)
                  }
                  renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={props.country}
                name="country"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.country && props.formik.errors.country ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.country}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                value={props.address}
                name="address"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.address && props.formik.errors.address ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.address}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={props.city}
                name="city"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                InputLabelProps={{ shrink: true }}
              />
              {props.formik.touched.city && props.formik.errors.city ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.city}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={props.gender}
                  name="gender"
                  id="demo-gender"
                  label="Gender"
                  onBlur={props.formik.handleBlur}
                  onChange={props.formik.handleChange}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              {props.formik.touched.gender && props.formik.errors.gender ? (
                <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                  {props.formik.errors.gender}
                </Typography>
              ) : null}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
          Save details
        </Button>
      </CardActions>
    </>
  )
}

export default EditProfile
