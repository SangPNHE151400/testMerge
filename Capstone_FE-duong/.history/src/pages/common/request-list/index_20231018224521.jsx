import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import requestApi from '../../../services/requestApi';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper
}))

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.ticketId}
          </TableCell>
          <TableCell align="right">{row.requestTicketDtos.title}</TableCell>
          <TableCell align="right">{row.createDate}</TableCell>
          <TableCell align="right">{row.updateDate}</TableCell>
          <TableCell align="right">{row.status}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Request
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Curator</TableCell>
                      <TableCell align="right">Create Date</TableCell>
                      <TableCell align="right">Update Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.requestTicketDtos.map((request_row) => (
                      <TableRow key={request_row.request_id}>
                        <TableCell component="th" scope="row">
                          {request_row.requestId}
                        </TableCell>
                        <TableCell>{request_row.requestStatus}</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right">
                        {request_row.requestCreateDate}
                        </TableCell>
                        <TableCell align="right">
                        {request_row.requestUpdateDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    </>
  );
}


export default function RequestList() {
  const [listRequestAndTicket, setListRequestAndTicket] = useState([])

  useEffect(() => {
    const fetchListRequestAndTicket = async () => {
      const response = await requestApi.getAllRequestAndTicket()
      setListRequestAndTicket(response)
    }
    fetchListRequestAndTicket()
  },[])

  console.log(listRequestAndTicket);
  return (
    <>
      <Box display="flex" height="100vh" bgcolor="rgb(238, 242, 246)">
        <Box flex={1} sx={{ overflowX: 'hidden' }}>
          <StyledPaper>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="left" >TicketID</TableCell>
                    <TableCell align="right">Topic</TableCell>
                    <TableCell align="right">Title</TableCell>
                    <TableCell align="right">Create Date</TableCell>
                    <TableCell align="right">Update Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listRequestAndTicket.map((row) => (
                    <Row key={row.ticketId} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>
      </Box>
    </>
  );
}