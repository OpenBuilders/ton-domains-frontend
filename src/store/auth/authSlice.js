import { createSlice } from '@reduxjs/toolkit'

import { AuthService } from '../../services/AuthService'
import { signIn, signOut } from './authActions'

const initialState = {
  isAuth: AuthService.isAuth(),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isAuth = action.payload.isAuth
    })
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.isAuth = action.payload.isAuth
    })
  },
})

export const isAuthSelector = (state) => state.auth.isAuth

export default authSlice.reducer
