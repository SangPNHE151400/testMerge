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
              <TypoOverView >Account: {props.userInfo.account}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Role: {props.userInfo.role}</TypoOverView>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypoOverView >Department: {props.userInfo.department}</TypoOverView>
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
