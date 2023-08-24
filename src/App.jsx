// import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes'

import './App.css'
import { AuthPage, DomainsPage, AddDomainPage, TopupPage } from './pages'
import { useDispatch, useSelector } from 'react-redux'
import { isAuthSelector } from './store/auth/authSlice'
import { useEffect } from 'react'
import { fetchMe } from './store/user/userActions'
import { EditDomainPage } from './pages/EditDomainPage/EditDomainPage'
import { delay } from './utils'
import { ToastProvider } from './components'

let userPolling = false
const userPollingDelay = 5000

function App() {
  const isAuth = useSelector(isAuthSelector)
  const dispatch = useDispatch()
  window.tgButtonCb = () => {}

  const pollUser = () => {
    userPolling = true

    const pollingAction = async () => {
      while (userPolling) {
        await delay(userPollingDelay)

        if (userPolling) {
          await dispatch(fetchMe())
        }
      }
    }

    pollingAction()
  }

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchMe())
    }

    return () => {
      userPolling = false
    }
  }, [])

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchMe())
      pollUser()
    } else {
      userPolling = false
    }
  }, [isAuth])


  return (
    <div className="layout-maintenance">
      <h1>🚧 👷‍♂️ 🚧</h1>
      <code>app is under maintenance</code>
    </div>
  )
  return (
    <div className="layout-container">
      <ToastProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={<ProtectedRoute component={<DomainsPage />} />}
          />
          <Route
            path="/add"
            element={<ProtectedRoute component={<AddDomainPage />} />}
          />
          <Route
            path="/edit/:domainName"
            element={<ProtectedRoute component={<EditDomainPage />} />}
          />
          <Route
            path="/topup"
            element={<ProtectedRoute component={<TopupPage />} />}
          />
        </Routes>
      </ToastProvider>
    </div>
  )
}

export default App
