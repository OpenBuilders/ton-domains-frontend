import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { signIn, getAuthSession } from '../../store/auth/authActions'
import { isAuthSelector } from '../../store/auth/authSlice'
import { delay, generateEasyToken } from '../../utils'
import './AuthPage.css'

const authRequestUrl = process.env.REACT_APP_API_TON_AUTH_ENDPOINT
let polling = false
let sessionToken = ''

const getTGUserId = () => {
  return window.Telegram.WebApp.initDataUnsafe.user !== undefined
    ? window.Telegram.WebApp.initDataUnsafe.user.id
    : ''
}

export const AuthPage = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => isAuthSelector(state))

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    return () => {
      polling = false
    }
  }, [])

  if (isAuth) {
    return <Navigate to="/" replace />
  }

  const handleLogin = (walletType) => {
    sessionToken = generateEasyToken()
    const loginLink = `https://app.tonkeeper.com/ton-login/${authRequestUrl}/auth/ton-auth-request/${sessionToken}/${getTGUserId()}`

    pollSession()

    window.location.assign(loginLink)

    // dispatch(
    //   signIn({
    //     accessToken: '1',
    //     refreshToken: '2',
    //     address: 'ololowalletAddress',
    //   })
    // )
  }

  const pollSession = () => {
    polling = true
    const pollingTimeout = 2 * 60 * 1000 // 2 mins
    const expires = Date.now() + pollingTimeout

    const pollingAction = async () => {
      while (Date.now() < expires && polling) {
        const response = await dispatch(getAuthSession({ token: sessionToken }))
        const { status } = response.payload

        if (status === 'confirmed') {
          dispatch(signIn(response.payload))
          return
        }

        await delay(2000)
      }
    }

    pollingAction()
  }

  return (
    <div className="page-auth">
      <div className="name"></div>
      <div className="title">Connect wallet</div>
      <div className="subtitle">
        Use a crypto wallet to participate in
        <br /> TON DNS auction.
      </div>
      <div className="button-container">
        <button
          className="button button--large"
          onClick={() => handleLogin('tonkeeper')}
        >
          Connect Tonkeeper
        </button>
      </div>
    </div>
  )
}
