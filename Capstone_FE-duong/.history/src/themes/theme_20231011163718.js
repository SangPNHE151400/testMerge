import { createTheme } from "@mui/material";
import {} from '@mui/lab/themeAugmentation';
export const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: ['Quicksand','sans-serif'].join(','),
      fontSize: 16,
      fontWeight: '600'
    },
  },
  palette:{
    bgColorPrimary: {
      
    }
  },
  components: {
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    }
  }
});
