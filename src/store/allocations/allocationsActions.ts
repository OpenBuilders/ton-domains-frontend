import { createAsyncThunk } from '@reduxjs/toolkit'
import TonWeb from 'tonweb'

import { Allocation } from '../../models'
import { ApiService } from '../../services'
import { WalletService } from '../../services'

export const fetchAllocations = createAsyncThunk<Allocation[]>(
  'allocations/fetchAllocations',
  async (params, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.get({
      params,
      endpoint: '/users/allocations',
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data as Allocation[]
  }
)

export const fetchAllocation = createAsyncThunk<
  Allocation,
  { projectId: string }
>('allocations/fetchAllocation', async ({ projectId }, { rejectWithValue }) => {
  const { ok, data, error } = await ApiService.get({
    endpoint: `/projects/${projectId}/allocation`,
  })

  if (!ok) {
    return rejectWithValue(error)
  }

  return data as Allocation
})

export const joinAllocation = createAsyncThunk<
  Allocation,
  { projectId: string; tonAmount: number }
>(
  'allocations/fetchAllocation',
  async ({ projectId, tonAmount }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.post({
      data: { tonAmount },
      endpoint: `/projects/${projectId}/join/`,
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data as Allocation
  }
)

export const claimAllocation = createAsyncThunk<
  Allocation,
  { projectId: string; tonAmount: number }
>(
  'allocations/fetchAllocation',
  async ({ projectId, tonAmount }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.post({
      data: { tonAmount },
      endpoint: `/projects/${projectId}/claim/`,
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data as Allocation
  }
)

export const payTON = async (amountTon: number, contractAddress: string) => {
  const amount = TonWeb.utils.toNano((amountTon + 0.01).toFixed(2)).toString()

  await WalletService.transfer({
    value: amount,
    to: contractAddress,
  })

  // location.href = `ton://transfer/${wallet}?amount=${amount}&text=${text}`
}

export const checkAllocationPayment = createAsyncThunk<
  Allocation,
  { projectId: string }
>(
  'allocations/checkAllocationPayment',
  async ({ projectId }, { rejectWithValue }) => {
    const { ok, data, error } = await ApiService.post({
      data: { projectId },
      endpoint: `/projects/${projectId}/sent`,
    })

    if (!ok) {
      return rejectWithValue(error)
    }

    return data as Allocation
  }
)
