import { createAsyncThunk } from '@reduxjs/toolkit'

import { ApiService } from '../../services'

export const fetchDomains = createAsyncThunk(
  'domains/fetchDomains',
  async ({ userId }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.get({
      params: { userId: userId },
      endpoint: '/domains/follow',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)

export const updateDomain = createAsyncThunk(
  'domains/updateDomain',
  async ({ domainData }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.post({
      data: domainData,
      endpoint: '/domains/follow',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)

export const addDomain = createAsyncThunk(
  'domains/addDomain',
  async (params, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.post({
      data: params,
      endpoint: '/domains/follow',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)

export const giveMeWalletAddress = createAsyncThunk(
  'domains/give-me-wallet-address',
  async (params, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.get({
      data: params,
      endpoint: '/give-me-wallet-address',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)

export const fetchOneDomain = createAsyncThunk(
  'domains/fetchOneDomain',
  async ({ domainName }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.get({
      params: { domainName: domainName },
      endpoint: '/domains/follow-one',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)

export const deleteDomain = createAsyncThunk(
  'domains/deleteDomain',
  async ({ domainName }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.delete({
      endpoint: `/domains/follow/${domainName}`,
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data
  }
)
