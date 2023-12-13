import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Avatar, Box, Button, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useEffect, useRef } from 'react'
import './components/style.css'
import ChatTopbar from '../chat/components/ChatTopbar'
const TicketDetail = () => {
  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  }))

  const StyledPaperAns = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    backgroundColor: 'lightblue'
  }))

  const scrollbarsRef = useRef()
  const inputRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const input = inputRef.current
    if (input.value.trim() !== '') {
      input.value = ''

      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    scrollbarsRef.current.scrollTop = scrollbarsRef.current.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [])
  return (
    <>
      <ChatTopbar />
      <div
        ref={scrollbarsRef}
        style={{ overflow: 'auto', backgroundColor: '#999', maxHeight: '400px' }}>
        <StyledPaper>
          <Box display="flex" gap={1} alignItems="center" mb={2}>
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Box display='flex' flexDirection='column'>
            <Typography fontSize='16px' variant="body1" >
              Nguyen Thinh
            </Typography>
            <Typography fontSize='12px' variant="body1">
              Admin
            </Typography>
            </Box>
          </Box>
          <Typography variant="h2" gutterBottom>
            Request Attendence
          </Typography>
          <Typography variant="body1" gutterBottom>
            Request kiểm tra điểm danh của bạn đã đượcequest kiểm tra điểm danh của bạn đã được chấp
            nhận, thông tin về log là bạn không đi làm vào ngày hôm đó , vui lòng bạn kiểm tra lại
            bộ não của bạn !!equest kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log
            là bạn không đi làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !!equest
            kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log là bạn không đi làm vào
            ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !!equest kiểm tra điểm danh của
            bạn đã được chấp nhận, thông tin về log là bạn không đi làm vào ngày hôm đó , vui lòng
            bạn kiểm tra lại bộ não của bạn !!equest kiểm tra điểm danh của bạn đã được chấp nhận,
            thông tin về log là bạn không đi làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não
            của bạn !!equest kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log là bạn
            không đi làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !! chấp nhận,
            thông tin về log là bạn không đi làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não
            của bạn !!
          </Typography>
        </StyledPaper>
        <StyledPaperAns>
          <Box display="flex" gap={1} alignItems="center">
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Typography variant="body1" gutterBottom>
              Tung Ngu
            </Typography>
          </Box>
          <Typography variant="h2" gutterBottom>
            Request Attendence
          </Typography>
          <Typography variant="body1" gutterBottom>
            oke
          </Typography>
        </StyledPaperAns>


      </div>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
          <CKEditor editor={ClassicEditor} onInit={() => {}} />

          <Button sx={{alignSelf: 'flex-end', mr: 2}} type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Send
          </Button>
        </form>
    </>
  )
}

export default TicketDetail
