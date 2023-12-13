import {
    Box,
    Button,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Typography,
    styled
  } from '@mui/material'
  import { useNavigate } from 'react-router-dom'
  
  const TypoOverView = styled(Typography)(() => ({
    fontSize: '18px',
    textAlign: 'left'
  }))
  
  const Profile = (props) => {
    const navigate = useNavigate()
    return (
      <>
        <CardContent>
          <Box sx={{ mb: 1 }}>
            <Grid item container spacing={3}>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>First name: {props.firstName}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>Last name:  {props.lastName}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={12}>
                <TypoOverView fullWidth>Email Address: {props.email}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>Phone Number:  {props.phone}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>Country:  {props.country}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>Address: {props.address} </TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>City:  {props.city}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>Gender: chuwa cos   {props.gender}</TypoOverView>
              </Grid>
              <Grid item xs={12} md={6}>
                <TypoOverView fullWidth>Date of birth:  {props.dob}</TypoOverView>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
      </>
    )
  }
  
  export default Profile
  