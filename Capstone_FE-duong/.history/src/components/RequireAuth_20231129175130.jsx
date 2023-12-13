import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
const RequireAuth = ({ allowedRoles }) => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  if (currentUser !== null) {
    const role = currentUser.role;
    const token = currentUser.jwtToken;
    if (token && allowedRoles.includes(role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  }else{
    return <Navigate to="/unauthorized" />;
  }
};

export default RequireAuth
