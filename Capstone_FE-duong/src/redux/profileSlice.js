import { createSlice } from '@reduxjs/toolkit'

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    getAllUserInfo: {
      isFetching: false,
      error: false,
      allUserInfo: {}
    },
    acceptAllUserInfo: {
      isFetching: false,
      error: false
    }
  },
  reducers: {
    getAllUserInfoStart: (state) => {
      state.getAllUserInfo.isFetching = true
    },
    getAllUserInfoSuccess: (state, action) => {
      state.getAllUserInfo.isFetching = false
      ;(state.getAllUserInfo.error = false), (state.getAllUserInfo.allUserInfo = action.payload)
    },
    getAllUserInfoFailed: (state) => {
      state.getAllUserInfo.isFetching = false
      state.getAllUserInfo.error = true
    },
    acceptAllUserInfoStart: (state) => {
      state.acceptAllUserInfo.isFetching = true
    },
    acceptAllUserInfoSuccess: (state) => {
      state.acceptAllUserInfo.isFetching = false
      state.acceptAllUserInfo.error = false
    },
    acceptAllUserInfoFailed: (state) => {
      state.acceptAllUserInfo.isFetching = false
      state.acceptAllUserInfo.error = true
    }
  }
})

export const { getAllUserInfoStart, getAllUserInfoSuccess, getAllUserInfoFailed, acceptAllUserInfoFailed, acceptAllUserInfoSuccess,acceptAllUserInfoStart } =
  profileSlice.actions

export default profileSlice.reducer
