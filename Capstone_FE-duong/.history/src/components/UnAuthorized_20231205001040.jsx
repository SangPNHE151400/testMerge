import './style.css'
import { useNavigate } from 'react-router-dom'
const UnAuthorized = () => {
  const navigate = useNavigate()
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%'}}>
      <h1 className="w3-jumbo w3-animate-top w3-center">
        <code>Access Denied</code>
      </h1>
      <hr className="w3-border-white w3-animate-left" style={{ margin: 'auto', width: '50%' }} />
      <h3 className="w3-center w3-animate-right">You dont have permission to view this site.</h3>
      <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
      <h6 className="w3-center w3-animate-zoom">error code:403 forbidden</h6>
    </div>
  )
}

export default UnAuthorized
