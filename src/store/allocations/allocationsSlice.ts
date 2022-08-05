import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '..'
import { Allocation } from '../../models'
import { fetchAllocation, fetchAllocations } from './allocationsActions'

interface AllocationState {
  allocations: Allocation[]
  activeAllocation: Allocation
  status: 'idle' | 'loading' | 'fulfilled' | 'rejected'
  error: string | null
}

const initialState: AllocationState = {
  allocations: [],
  activeAllocation: {} as Allocation,
  status: 'idle',
  error: null,
}

export const allocationsSlice = createSlice({
  name: 'allocations',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllocations.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllocations.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.allocations = action.payload
      })
      .addCase(fetchAllocations.rejected, (state, action) => {
        state.status = 'rejected'
      })

    builder
      .addCase(fetchAllocation.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllocation.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.activeAllocation = action.payload
      })
      .addCase(fetchAllocation.rejected, (state, action) => {
        state.status = 'rejected'
        state.activeAllocation = {} as Allocation;
      })
  },
})

export const allocationsLoadedSelector = (state: RootState): boolean =>
  state.allocations.status === 'fulfilled'

export const allocationsSelector = (state: RootState): Allocation[] =>
  state.allocations.allocations

export const activeAllocationSelector = (state: RootState): Allocation =>
  state.allocations.activeAllocation

export default allocationsSlice.reducer
