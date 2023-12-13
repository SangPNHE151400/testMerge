import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userApi from '../../../services/userApi';
import { Avatar, Box, Button, Divider, Grid, Typography } from '@mui/material';
import ChatTopbar from '../../common/chat/components/ChatTopbar';
import Profile from './util/Profile';
import profileApi from '../../../services/profileApi';
import {useSelector } from 'react-redux';

const ChangeLogEditProfileDetail = () => {
    const currentUser = useSelector((state) => state.auth.login?.currentUser)
    const navigate = useNavigate()
    const { userId } = useParams();
    console.log('userId >>>' + userId);
    const [profile, setProfile] = useState();
     
console.log(currentUser);
    useEffect(() => {
        const getChangeInfoDetails = async () => {
            let data = {
                userId: userId
            }
            let res = await userApi.getChangeInfoDetail(data);
            setProfile(res);
        }
        getChangeInfoDetails();
    }, [])

    console.log(profile);

    const handleAcceptRequest = (userId) => {
        let choice = window.confirm('Do you want to accept this account profile?')
        if (choice == true) {
            let data ={
                userId : userId,
                hrId : currentUser.accountId
            }
            profileApi.acceptUserInfo(data)
            navigate('/manage-profile')
        } else {
        }
    }
    const handleRejectRequest = (userId) => {
        let choice = window.confirm('Do you want to reject this account profile?')
        if (choice == true) {
            let data ={
                userId : userId,
                hrId : currentUser.accountId
            }
            profileApi.rejectUserInfo(data)
            navigate('/manage-profile')
        } else {
        }
    }

    return (
        <Box>
            <ChatTopbar />
            <Box p={3}>
                <Box display='flex' ml={5} mb={3} >
                    <Box display="flex" marginTop="40px" width='400px' height='80px'>
                        <Box flex="1" textAlign='left' borderRight="1px solid #999">
                            <Typography >Account </Typography>
                            <Typography mt={4}>Role </Typography>
                        </Box>
                        <Box flex="2" textAlign='left' marginLeft="20px">
                            <Typography >{profile?.username} </Typography>
                            <Typography mt={4}>{profile?.role} </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" width='400px' marginTop="40px" height='80px'>
                        <Box flex="1" textAlign='left' borderRight="1px solid #999">
                            <Typography >Department </Typography>
                            <Typography mt={4}>Hire DateDate </Typography>
                        </Box>
                        <Box flex="2" textAlign='left' marginLeft="20px">
                            <Typography >{profile?.department} </Typography>
                            <Typography mt={4}>{profile?.hireDate} </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <Box display='flex' mt={2} mb={2}>
                    <Box flex='1'>
                        <Typography ml={4} fontSize='20px' fontWeight='600' >BEFORE </Typography>
                    </Box>
                    <Box flex='1'>
                        <Typography ml={4} fontSize='20px' fontWeight='600'>AFTER </Typography>
                    </Box>
                </Box>
                <Divider />

                <Box display='flex' mt={2} mb={2}>
                    <Box flex='1' bgcolor='#EDEDED' m={2} >
                        <Avatar
                            //   src={`${profile.imageBefore}`}
                            sx={{
                                height: 100,
                                m: 2,
                                width: 100
                            }}
                        />
                        <Profile
                            firstName={profile?.firstNameBefore}
                            lastName={profile?.lastNameBefore}
                            email={profile?.emailBefore}
                            dob={profile?.dateOfBirthBefore}
                            phone={profile?.phoneBefore}
                            gender={profile?.genderBefore}
                            address={profile?.addressBefore}
                            city={profile?.cityBefore}
                            country={profile?.countryBefore}
                        />
                    </Box>
                    <Box flex='1' bgcolor='#EDEDED' m={2}>
                        <Avatar
                            //   src={`${profile.imageAfter}`}
                            sx={{
                                height: 100,
                                m: 2,
                                width: 100
                            }}
                        />
                        <Profile
                            firstName={profile?.firstNameAfter}
                            lastName={profile?.lastNameAfter}
                            email={profile?.emailAfter}
                            dob={profile?.dateOfBirthAfter}
                            gender={profile?.genderAfter}
                            phone={profile?.phoneAfter}
                            address={profile?.addressAfter}
                            city={profile?.cityAfter}
                            country={profile?.countryAfter}
                        />
                    </Box>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                    <Box flex='1'>
                        <Button sx={{ marginRight: '20px', marginLeft: '15px' }}
                            variant="contained"
                            onClick={(e) => navigate(-1)}
                        >
                            Back
                        </Button>
                    </Box>
                    <Box flex='1' display='flex' mr={3} justifyContent='flex-end' gap={3}>
                        <Button sx={{ marginRight: '20px' }}
                            variant="contained"
                            onClick={(e) => handleAcceptRequest(userId)}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="contained"
                            onClick={(e) => handleRejectRequest(userId)}
                        >
                            Reject
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    )
}

export default ChangeLogEditProfileDetail
