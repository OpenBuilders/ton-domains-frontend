import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isAuthSelector } from './store/auth/authSlice'

export const ProtectedRoute = ({
  redirectPath = '/auth',
  component,
}) => {
  const isAuth = useSelector(state =>
    isAuthSelector(state)
  )

  if (!isAuth) {
    return <Navigate to={redirectPath} replace />
  }

  return component
}