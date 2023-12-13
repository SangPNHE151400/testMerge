import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    changePasword: {
      isFetching: false,
      error: false
    },
    updateProfile: {
      isFetching: false,
      error: false
    },
    getUserInfo: {
      isFetching: false,
      error: false,
      userInfo: {}
    },
    changeUserStatus:{
      isFetching: false,
      error: false,
    },
    changeRoleAccount: {
      isFetching: false,
      error: false,
    },
    createAccount:{
      isFetching: false,
      error: false,
    }
  },
  reducers: {
    changePaswordStart: (state) => {
      state.changePasword.isFetching = true
    },
    changePaswordSuccess: (state) => {
      state.changePasword.isFetching = false
      state.changePasword.error = false
    },
    changePaswordFailed: (state) => {
      state.changePasword.isFetching = false
      state.changePasword.error = true
    },
    updateProfileStart: (state) => {
      state.updateProfile.isFetching = true
    },
    updateProfileSuccess: (state) => {
      state.updateProfile.isFetching = false
      state.updateProfile.error = false
    },
    updateProfileFailed: (state) => {
      state.updateProfile.isFetching = false
      state.updateProfile.error = true
    },
    getUserInfoStart: (state) => {
      state.getUserInfo.isFetching = true
    },
    getUserInfoSuccess: (state, action) => {
      state.getUserInfo.isFetching = false
      state.getUserInfo.error = false, 
      state.getUserInfo.userInfo = action.payload
    },
    getUserInfoFailed: (state) => {
      state.getUserInfo.isFetching = false
      state.getUserInfo.error = true
    },
    changeUserStatusStart: (state) => {
      state.changeUserStatus.isFetching = true
    },
    changeUserStatusSuccess: (state) => {
      state.changeUserStatus.isFetching = false
      state.changeUserStatus.error = false
    },
    changeUserStatusFailed: (state) => {
      state.changeUserStatus.isFetching = false
      state.changeUserStatus.error = true
    },
    changeRoleAccountStart: (state) => {
      state.changeRoleAccount.isFetching = true
    },
    changeRoleAccountSuccess: (state) => {
      state.changeRoleAccount.isFetching = false
      state.changeRoleAccount.error = false
    },
    changeRoleAccountFailed: (state) => {
      state.changeRoleAccount.isFetching = false
      state.changeRoleAccount.error = true
    },
    createAccountStart: (state) => {
      state.createAccount.isFetching = true
    },
    createAccountSuccess: (state) => {
      state.createAccount.isFetching = false
      state.createAccount.error = false
    },
    createAccountFailed: (state) => {
      state.createAccount.isFetching = false
      state.createAccount.error = true
    }
  }
})

export const {
  changePaswordStart,
  changePaswordSuccess,
  changePaswordFailed,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailed,
  getUserInfoStart,
  getUserInfoFailed,
  getUserInfoSuccess,
  changeUserStatusStart,
  changeUserStatusSuccess,
  changeUserStatusFailed,
  changeRoleAccountStart,
  changeRoleAccountSuccess,
  changeRoleAccountFailed,
  createAccountStart,
  createAccountSuccess,
  createAccountFailed
} = userSlice.actions

export default userSlice.reducer
