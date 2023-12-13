import { Typography, Box, Divider } from "@mui/material";


const Header = ({ title, subtitle }) => {
  return (
    <>
    <Box mb="10px">
      <Typography
        fontSize='30px'
        color="#000"
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography fontSize='15px' color="#70d8bd">
        {subtitle}
      </Typography>
    </Box>
    <Divider sx={{mb: '10px'}} />
    </>
  );
};
export default Header;
