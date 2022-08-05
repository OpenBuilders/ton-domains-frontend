import { configureStore } from '@reduxjs/toolkit'

import auth from './auth/authSlice'
import domains from './domains/domainsSlice'
import user from './user/userSlice.js'

export const store = configureStore({
  reducer: { auth, domains, user },
})
