import React, { useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Toast } from 'react-onsenui'

import './toaster.css'

const ToastElement = ({ children, id }) => {
  const { removeToast } = useToast()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id)
    }, 5000)

    const hideTimer = setTimeout(() => {
      setIsOpen(false)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [id, removeToast])

  return <Toast isOpen={isOpen}>{children}</Toast>
}

const ToastContainer = ({ toasts }) => {
  return createPortal(
    toasts.map((item) => (
      <ToastElement key={item.id} id={item.id}>
        {item.content}
      </ToastElement>
    )),
    document.body
  )
}

const ToastContext = React.createContext({
  addToast: (text) => {},
  removeToast: (id) => {},
})

let id = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(
    (content) => {
      setToasts((toasts) => [
        ...toasts,
        {
          id: id++,
          content,
        },
      ])
    },
    [setToasts]
  )

  const removeToast = useCallback(
    (id) => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id))
    },
    [setToasts]
  )

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
      }}
    >
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  )
}

const useToast = () => {
  const toastHelpers = useContext(ToastContext)

  return toastHelpers
}

export { ToastContext, useToast }
export default ToastProvider
