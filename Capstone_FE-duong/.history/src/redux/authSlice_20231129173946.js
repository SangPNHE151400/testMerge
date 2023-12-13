import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      currentUser: null,
      error: false
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.error = false
    },
    loginSuccess: (state, action) => {
      state.login.currentUser = action.payload
      state.login.error = false
    },
    loginFailed: (state) => {
      state.login.error = true
    },
    logOutSuccess: (state) => {
      state.login.currentUser = null
      state.login.error = false
    }
  }
})

export const { loginStart, loginFailed, loginSuccess, logOutSuccess } = authSlice.actions

export default authSlice.reducer
