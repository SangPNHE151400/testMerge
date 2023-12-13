import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    
      currentUser: null,
      isFetching: false,
      error: false
    
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true
    },
    loginSuccess: (state, action) => {
      state.isFetching = false
      state.currentUser = action.payload
      state.error = false
    },
    loginFailed: (state) => {
      state.isFetching = false
      state.error = true
    },
    logOutSuccess: (state) => {
      state.isFetching = false
      state.currentUser = null
      state.error = false
    }
  }
})

export const { loginStart, loginFailed, loginSuccess, logOutSuccess } = authSlice.actions

export default authSlice.reducer
