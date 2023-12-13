import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useRef } from 'react';
import './components/style.css'
const TicketDetail = () => {
    const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
      }));
      
      const StyledPaperAns = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        backgroundColor: 'lightblue',
      }));
      
        const scrollbarsRef = useRef();
        const inputRef = useRef();
      
        const handleSubmit = (e) => {
          e.preventDefault();
          const input = inputRef.current;
          if (input.value.trim() !== '') {
      
            input.value = '';
      
            scrollToBottom();
          }
        };
      
        const scrollToBottom = () => {
          scrollbarsRef.current.scrollTop = scrollbarsRef.current.scrollHeight;
        };
      
        useEffect(() => {
          scrollToBottom();
        }, []);  
  return (
    <>
      <div ref={scrollbarsRef} style={{ maxHeight: '400px', overflow: 'auto' }}>
        <StyledPaper>
          <Box display="flex" alignItems="center">
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Typography variant="body1" gutterBottom>
              Nguyen Thinh
            </Typography>
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
          <Box display="flex" alignItems="center">
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

        <StyledPaper>
          <Box display="flex" alignItems="center">
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Typography variant="body1" gutterBottom>
              Nguyen Thinh
            </Typography>
          </Box>
          <Typography variant="h2" gutterBottom>
            Request Attendence
          </Typography>
          <Typography variant="body1" gutterBottom>
            Request kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log là bạn không đi
            làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !!
          </Typography>
        </StyledPaper>
        <StyledPaperAns>
          <Box display="flex" alignItems="center">
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

        <StyledPaper>
          <Box display="flex" alignItems="center">
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Typography variant="body1" gutterBottom>
              Nguyen Thinh
            </Typography>
          </Box>
          <Typography variant="h2" gutterBottom>
            Request Attendence
          </Typography>
          <Typography variant="body1" gutterBottom>
            Request kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log là bạn không đi
            làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !!
          </Typography>
        </StyledPaper>
        <StyledPaperAns>
          <Box display="flex" alignItems="center">
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

        <StyledPaper>
          <Box display="flex" alignItems="center">
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Typography variant="body1" gutterBottom>
              Nguyen Thinh
            </Typography>
          </Box>
          <Typography variant="h2" gutterBottom>
            Request Attendence
          </Typography>
          <Typography variant="body1" gutterBottom>
            Request kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log là bạn không đi
            làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !!
          </Typography>
        </StyledPaper>
        <StyledPaperAns>
          <Box display="flex" alignItems="center">
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

        <StyledPaper>
          <Box display="flex" alignItems="center">
            <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
            <Typography variant="body1" gutterBottom>
              Nguyen Thinh
            </Typography>
          </Box>
          <Typography variant="h2" gutterBottom>
            Request Attendence
          </Typography>
          <Typography variant="body1" gutterBottom>
            Request kiểm tra điểm danh của bạn đã được chấp nhận, thông tin về log là bạn không đi
            làm vào ngày hôm đó , vui lòng bạn kiểm tra lại bộ não của bạn !!
          </Typography>
        </StyledPaper>
        <StyledPaperAns>
          <Box display="flex" alignItems="center">
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
      <form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
        <CKEditor editor={ClassicEditor} onInit={() => {}} />
        {/* <TextField
  fullWidth
  multiline 
  rows={15} 
  variant="outlined"
  label="Type your message..."
  inputRef={inputRef}
  
/> */}

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Send
        </Button>
      </form>
    </>
  )
}

export default TicketDetail
