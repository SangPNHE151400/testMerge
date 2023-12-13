import {
  Box,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
  styled
} from '@mui/material'
import { formatDateNotTime } from '../../../../utils/formatDate'

const TypoOverView = styled(Typography)(() => ({
  fontSize: '15px',
  textAlign: 'left',
  width: '100%'


}))

const Overview = (props) => {
  return (
    <>
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ mb: 1 }}>
          <Grid item container spacing={3}>
            <Grid item xs={12} md={6}>
              <TypoOverView >First name: {props.userInfo.firstName}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Last name: {props.userInfo.lastName}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Email Address: {props.userInfo.email}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Phone Number: {props.userInfo.telephoneNumber}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Country: {props.userInfo.country}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >City: {props.userInfo.city}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Gender: {props.userInfo.gender}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Date of birth: {props.userInfo.dateOfBirth}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Department: {props.userInfo.departmentName}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Hire Date: {formatDateNotTime(props.userInfo.hireDate)}</TypoOverView>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-start' }}>
      </CardActions>
    </>
  )
}

export default Overview
