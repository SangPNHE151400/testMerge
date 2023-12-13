import { ThemeProvider } from '@mui/material'
import './App.css'
import { theme } from './themes/theme'

import { ProSidebarProvider } from 'react-pro-sidebar'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Router from './router/routes'
import { BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <>
      <Helmet>
        <title>BMS</title>
        <link rel="icon" type="image/png" sizes="16x16" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ProSidebarProvider>
            <Router />
          </ProSidebarProvider>
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
