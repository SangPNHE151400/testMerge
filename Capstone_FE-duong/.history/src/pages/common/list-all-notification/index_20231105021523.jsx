import MoreVertIcon from '@mui/icons-material/MoreVert'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Box, IconButton } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import DataTableListNoti from './components/DataTable'
const NotificationsList = (props) => {
  const { row } = props
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const dispatch = useDispatch()
  const [allNoti, setAllNoti] = useState([])
  const [user, setUser] = useState('')
  const [open, setOpen] = useState(false)
  const [openCreateAccount, setOpenCreateAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const navigate = useNavigate()
  const handleOpen = (data) => {
    setOpen(true)
    setUser(data)
  }
  const options = [
    'Make as read(unread)',
    'Delete',
    'Detail',
  ]
  const ITEM_HEIGHT = 58;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl(null);
  };
  const handleClose = () => setOpen(false)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    setIsLoading(true)
    const fetchAllNoti = async () => {
      const response = await axiosClient.get(`${BASE_URL}/getListNotificationByCreator`, {
        params: {
          userId: userId
        }
      })
      setAllNoti(response)
      setIsLoading(false)
      console.log(userId)
    }
    fetchAllNoti()
  }, [])

  console.log(allNoti)


  const columns = [
    {
      field: 'priority',
      headerName: 'Priority',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 60,
      renderCell: (params) => {
        return (
          <Box
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px"
          >
            <div>
              {params.row.priority === true ? (
                <PriorityHighIcon color='secondary'/>
              ) : null
              //   <Checkbox {...label} icon={<StarBorderIcon color='warning' />} checkedIcon={<StarIcon color='warning' />} />
              // )
            }
            </div>
          </Box>
        )
      }
    },
    {
      field: 'personalPriority',
      headerName: '',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 60,
      renderCell: (params) => {
        return (
          <Box
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px"
          >
            <div>
              {params.row.personalPriority === true ? (
                <Checkbox {...label} icon={<StarIcon color='warning' />} checkedIcon={<StarBorderIcon color='warning' />} />
              ) : (
                <Checkbox {...label} icon={<StarBorderIcon color='warning' />} checkedIcon={<StarIcon color='warning' />} />
              )}
            </div>
          </Box>
        )
      }
    },
    {
      field: 'creatorLastName',
      headerName: 'From',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 150,
    },
    {
      field: 'title',
      headerName: 'Title',
      headerAlign: 'center',
      align: 'center',
      width: 400,
    },
    {
      field: 'content',
      headerName: 'Content',
      headerAlign: 'center',
      align: 'center',
      width: 450,
    },
    {
      field: 'imageFileName',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 350,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        if (
          params.row.notificationFiles &&
          params.row.notificationFiles.length > 0
        ) {
          return 'There are attached files';
        } else if (
          params.row.notificationImages &&
          params.row.notificationImages.length > 0
        ) {
          return 'There are attached files';
        } else {
          return '';
        }
      },
    },
    {
      field: 'uploadDate',
      headerName: 'Date',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 330,
    },
    {
      field: 'action',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px">
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openMenu ? 'long-menu' : undefined}
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose2}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '25ch',
                    boxShadow: '1px 1px 1px #999'

                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Pyxis'} onClick={option === 'Detail' ? () => navigate(`/notification-detail/${params.row.notificationId}`): null}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </Box>
        )
      }
    }
    ,

  ]
  return (
    <>
      <Header title="NOTIFICATIONS" />
      <DataTableListNoti
        rows={allNoti}
        columns={columns}
        isLoading={isLoading}

      />

    </>
  )

}


export default NotificationsList
