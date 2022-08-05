import { createSlice } from '@reduxjs/toolkit'

import {
  fetchDomains,
  updateDomain,
  addDomain,
  giveMeWalletAddress,
} from './domainsActions'

const initialState = {
  domains: [],
  brokerWalletAddress: '',
  status: 'idle',
  error: null,
}

export const domainsSlice = createSlice({
  name: 'domains',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDomains.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.domains = action.payload
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.status = 'rejected'
      })
      .addCase(updateDomain.fulfilled, (state, action) => {
        state.domains = state.domains.map((existingDomain) => {
          const thisIsDomainWithUpdate =
            existingDomain.domainName === action.payload.domainName

          if (thisIsDomainWithUpdate) {
            const concatDomainData = { ...existingDomain, ...action.payload }

            return concatDomainData
          }

          return existingDomain
        })
      })
      .addCase(addDomain.fulfilled, (state, action) => {
        state.domains = [...state.domains, action.payload]
      })

    builder.addCase(giveMeWalletAddress.fulfilled, (state, action) => {
      state.brokerWalletAddress = action.payload
    })
  },
})

export const domainsSelector = (state) => state.domains.domains
export const brokerWalletAddressSelector = (state) =>
  state.domains.brokerWalletAddress

export default domainsSlice.reducer
