import { createSlice } from '@reduxjs/toolkit'
import { LocalStorageService } from '../../services'

import { fetchMe } from './userActions'

// user = {id: '', telegramId: '', balance: '',}

const initialState = {
  user: null,
  walletAddress: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.user = null
      })
  },
})

export const currentUserSelector = (state) => state.user.user

export const currentUserBalanceSelector = (state) => {
  const user = currentUserSelector(state)

  const result = {
    balance: user?.balance ? parseInt(user.balance, 10) : 0,
    spentAmount: user?.spentAmount ? parseInt(user.spentAmount, 10) : 0,
    blockedAmount: user?.blockedAmount ? parseInt(user.blockedAmount, 10) : 0,
    withdrawalAmount: user?.withdrawalAmount ? parseInt(user.withdrawalAmount, 10) : 0,
  }

  return {
    ...result,
    result: user?.id
      ? result.balance - result.spentAmount - result.blockedAmount - result.withdrawalAmount
      : null,
  }
}

export const userWalletAddressSelector = (state) =>
  LocalStorageService.getItem('walletAddress')
    ? LocalStorageService.getItem('walletAddress')
    : ''

export default userSlice.reducer
