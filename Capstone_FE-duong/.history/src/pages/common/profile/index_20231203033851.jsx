import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Tab,
  Typography
} from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import USER from '../../../assets/images/user.jpg'
import { storage } from '../../../firebase/config'
import useAuth from '../../../hooks/useAuth'
import userApi from '../../../services/userApi'
import { formatDateNotTime } from '../../../utils/formatDate'
import EditProfile from './components/EditProfile'
import Overview from './components/Overview'
import { validationSchema } from './components/util/validationSchema'
const Profile = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  console.log(currentUser);
  const [birth, setBirth] = useState(new Date())
  const [userProfileImage, setUserProfileImage] = useState('')
  const [firstNameUpdate, setFirstNameUpdate] = useState('')
  const [lastNameUpdate, setLastNameUpdate] = useState('')
  const [genderUpdate, setGenderUpdate] = useState('')
  const [emailUpdate, setEmailUpdate] = useState('')
  const [cityUpdate, setCityUpdate] = useState('')
  const [countryUpdate, setCountryUpdate] = useState('')
  const [birthUpdate, setBirthUpdate] = useState('')
  const [phoneUpdate, setPhoneUpdate] = useState('')
  const [info, setInfo] = useState('')
  const userInfo = useAuth()
  console.log(userInfo);
  useEffect(() => {
    setBirthUpdate(userInfo?.dateOfBirth)
    setInfo(userInfo)
  }, [userInfo])

  console.log(birth.format('YYYY-MM-DD'));
  console.log(info);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: info?.firstName,
      lastName: info?.lastName,
      gender: info?.gender,
      email: info?.email,
      city: info?.city,
      country: info?.country,
      address: info?.address,
      phone: info?.telephoneNumber,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let formData = new FormData()
      const data = {
        userId: accountId,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        dateOfBirth: birth.format('YYYY-MM-DD'),
        telephoneNumber: values.phone,
        country: values.country,
        address: values.address,
        city: values.city,
        email: values.email
      }
      formData.append('data', JSON.stringify(data))
      console.log(data)
      formData.append('image', userImage.file)
      userApi.updateProfile(formData, dispatch)
    }
  })

  console.log(formik.values.firstName)

  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const [userImage, setuserImage] = useState({
    file: [],
    filepreview: null
  })

  const handleInputChange = (event) => {
    if (event && event.target.files && event.target.files[0]) {
      setuserImage({
        ...userImage,
        file: event.target.files[0],
        filepreview: URL.createObjectURL(event.target.files[0])
      })
    }
  }

  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const imgurl = async () => {
    const storageRef = ref(storage, `/${userInfo.image}`)
    try {
      const url = await getDownloadURL(storageRef)
      setUserProfileImage(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }

  if (userInfo && userInfo.image) {
    imgurl()
  }
  console.log(userProfileImage)

  const accountId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const dispatch = useDispatch()

  console.log(formik.values)
  return (
    <Box textAlign="center" bgcolor="seashell" height="100vh">
      <Box pt={5}>
        <Box px={5} mt={8}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                {value === '2' ?
                  (<>
                    <Card>
                      <CardContent>
                        <Box display='flex'>
                          <Box flex='1' display='flex' alignItems='center' flexDirection='column'>
                            {userImage.filepreview !== null ? (
                              <Avatar
                                src={userImage.filepreview}
                                sx={{
                                  height: 100,

                                  width: 100
                                }}
                              />
                            ) : userProfileImage !== null ? (
                              <Avatar
                                src={userProfileImage}
                                sx={{
                                  height: 100,
                                  mb: 2,
                                  width: 100
                                }}
                              />
                            ) : (
                              <>
                                <Avatar
                                  src={`${USER}`}
                                  sx={{
                                    height: 100,
                                    mb: 2,
                                    width: 100
                                  }}
                                />

                              </>
                            )}
                            <CardActions>
                              <label
                                htmlFor="test"
                                style={{
                                  background:  'rgb(94, 53, 177)' ,
                                  borderRadius: '10px',
                                  color: '#fff' ,
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  padding: '8px 10px'
                                }}
                                >
                                Upload picture
                              </label>
                              <input
                                id="test"
                                type="file"
                                hidden
                                onChange={(e) => handleInputChange(e)}
                              />
                            </CardActions>
                          </Box>
                          <Box flex='1' display="flex" marginTop="40px" height='80px'>
                            <Box flex="1"  textAlign='left' borderRight="1px solid #999">
                              <Typography >Account </Typography>
                              <Typography mt={4}>Role </Typography>
                            </Box>
                            <Box flex="2" textAlign='left' marginLeft="20px">
                              <Typography>{info.userName}</Typography>
                              <Typography mt={4} sx={{textTransform: 'capitalize'}}>{info.roleName} </Typography>
                            </Box>
                          </Box>
                          <Box flex='1' display="flex" marginTop="40px" height='80px'>
                            <Box flex="1" textAlign='left' borderRight="1px solid #999">
                              <Typography >Department </Typography>
                              <Typography mt={4}>Hire DateDate </Typography>
                            </Box>
                            <Box flex="2" textAlign='left' marginLeft="20px">
                              <Typography sx={{textTransform: 'capitalize'}}>{info.departmentName} </Typography>
                              <Typography  mt={4}>{formatDateNotTime(info.hireDate)} </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                      <Divider/>
                    </Card>
                  </>) : (<>
                    <Card>
                      <CardContent>
                        <Box display='flex'>
                          <Box flex='1' display='flex' alignItems='center' flexDirection='column'>
                            {userImage.filepreview !== null ? (
                              <Avatar
                                src={userImage.filepreview}
                                sx={{
                                  height: 100,

                                  width: 100
                                }}
                              />
                            ) : userProfileImage !== null ? (
                              <Avatar
                                src={userProfileImage}
                                sx={{
                                  height: 100,
                                  mb: 2,
                                  width: 100
                                }}
                              />
                            ) : (
                              <>
                                <Avatar
                                  src={`${USER}`}
                                  sx={{
                                    height: 100,
                                    mb: 2,
                                    width: 100
                                  }}
                                />

                              </>
                            )}
                          </Box>
                          <Box flex='1' display="flex" marginTop="10px" height='80px'>
                            <Box flex="1"  textAlign='left' borderRight="1px solid #999">
                              <Typography >Account </Typography>
                              <Typography mt={4}>Role </Typography>
                            </Box>
                            <Box flex="2" textAlign='left' marginLeft="20px">
                              <Typography>{info.userName}</Typography>
                              <Typography mt={4} sx={{textTransform: 'capitalize'}}>{info.roleName} </Typography>
                            </Box>
                          </Box>
                          <Box flex='1' display="flex" marginTop="10px" height='80px'>
                            <Box flex="1" textAlign='left' borderRight="1px solid #999">
                              <Typography >Department </Typography>
                              <Typography mt={4}>Hire DateDate </Typography>
                            </Box>
                            <Box flex="2" textAlign='left' marginLeft="20px">
                              <Typography sx={{textTransform: 'capitalize'}}>{info.departmentName} </Typography>
                              <Typography  mt={4}>{formatDateNotTime(info.hireDate)} </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                      <Divider/>
                    </Card>
                  </>)

                }

              </Grid>
              <Grid item xs={12} md={6} lg={8}>
                <Card>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Overview" value="1" />
                        <Tab label="Edit Profile" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <Overview userInfo={userInfo} />
                    </TabPanel>
                    <TabPanel value="2">
                      <EditProfile
                        userInfo={userInfo}
                        firstNameUpdate={firstNameUpdate}
                        setFirstNameUpdate={setFirstNameUpdate}
                        lastNameUpdate={lastNameUpdate}
                        setLastNameUpdate={setLastNameUpdate}
                        cityUpdate={cityUpdate}
                        setCityUpdate={setCityUpdate}
                        birthUpdate={birthUpdate}
                        setBirthUpdate={setBirthUpdate}
                        phoneUpdate={phoneUpdate}
                        setPhoneUpdate={setPhoneUpdate}
                        emailUpdate={emailUpdate}
                        setEmailUpdate={setEmailUpdate}
                        countryUpdate={countryUpdate}
                        setCountryUpdate={setCountryUpdate}
                        setGendeUpdater={setGenderUpdate}
                        genderUpdate={genderUpdate}
                        firstName={formik.values.firstName}
                        lastName={formik.values.lastName}
                        city={formik.values.city}
                        address={formik.values.address}
                        birth={birth}
                        setBirth={setBirth}
                        phone={formik.values.phone}
                        email={formik.values.email}
                        country={formik.values.country}
                        gender={formik.values.gender}
                        formik={formik}
                      />
                    </TabPanel>
                  </TabContext>
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default Profile
