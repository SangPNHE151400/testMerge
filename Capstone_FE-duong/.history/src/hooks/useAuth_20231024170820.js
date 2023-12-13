import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userApi from '../services/userApi'

const useAuth = () => {
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const dispatch = useDispatch()
  useEffect(() => {
    userApi.getUserInfo(userId, dispatch)
  }, [userId])
  const userInfo = useSelector((state) => state.user.getUserInfo?.userInfo)
  return userInfo
}

export default useAuth
