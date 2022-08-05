import { createAsyncThunk } from '@reduxjs/toolkit'

import { ApiService } from '../../services'

export const fetchMe = createAsyncThunk(
  'user/fetchMe',
  async (params, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.get({
      endpoint: '/user/me',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)

export const withdrawBalance = createAsyncThunk(
  'user/withdrawBalance',
  async (params, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.post({
      endpoint: '/user/withdrawal',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)
