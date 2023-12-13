import './style.css'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
const UnAuthorized = () => {
  const navigate = useNavigate()
  return (
    <div style={{textAlign: 'center', height: '100vh', marginTop: '250px'}}>
      <h1 className="w3-jumbo w3-animate-top w3-center">
        <code>Access Denied</code>
      </h1>
      <hr className="w3-border-white w3-animate-left" style={{ margin: 'auto', width: '50%' }} />
      <h3 className="w3-center w3-animate-right">You dont have permission to view this site.</h3>
      <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
      <Button variant='contained'>Back to dashboard</Button>
    </div>
  )
}

export default UnAuthorized
