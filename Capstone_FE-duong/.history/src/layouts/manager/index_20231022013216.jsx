import { Outlet } from "react-router-dom";

import { Box, Divider } from "@mui/material";

import Topbar from "../../components/Topbar";
import ManagerSidebar from "./HrSidebar";




const ManagerLayout = () => {
  return (
    <>
      <Box display="flex" height="100vh" bgcolor="rgb(238, 242, 246)">
        <ManagerSidebar />
        <Box flex={1} sx={{overflowX: 'hidden'}}>
          <Topbar />
          <Divider />
          <Box pl={2} pt={2} pr={2}  sx={{borderRadius: '12px 12px 0px 0px'}}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ManagerLayout;
