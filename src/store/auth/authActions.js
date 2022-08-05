import { createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService, LocalStorageService } from '../../services'
import { AuthService } from '../../services/AuthService'

const walletAddressName = 'walletAddress'

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (params, { rejectWithValue, dispatch }) => {
    const accessToken = params.accessToken
    const refreshToken = params.refreshToken
    const walletAddress = params.address

    AuthService.setCredentials({ accessToken, refreshToken })
    LocalStorageService.setItem(walletAddressName, walletAddress)

    return { isAuth: true }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (params, { rejectWithValue, dispatch }) => {
    await ApiService.post({
      params,
      endpoint: '/auth/signout',
    })

    AuthService.clearCredentials()
    LocalStorageService.setItem(walletAddressName, null)

    return { isAuth: false }
  }
)

export const getAuthSession = createAsyncThunk(
  'auth/getAuthSession',
  async (params, { rejectWithValue, dispatch }) => {
    const { ok, data, error } = await ApiService.get({
      params,
      endpoint: '/auth/wallet-session',
    })

    if (ok && data.accessToken) {
      const { accessToken, refreshToken, address } = data

      return {
        status: 'confirmed',
        accessToken,
        refreshToken,
        address,
      }
    }

    return { status: 'not-confirmed' }
  }
)
