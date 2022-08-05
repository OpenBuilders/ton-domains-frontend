import React, { useEffect, useRef, useState } from 'react'
import { Popover } from 'react-onsenui'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  brokerWalletAddressSelector,
  giveMeWalletAddress,
} from '../../store/domains'
import { tonNumberToNano } from '../../utils'

import './TopupPage.css'

const tgBackButton = window.Telegram.WebApp.BackButton
const tgMainButton = window.Telegram.WebApp.MainButton

let amountGlobal = ''
let brokerWalletAddressGlobal = ''

export const TopupPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [amount, setAmount] = useState('')
  const message = 'Domain broker top up'
  const walletType = 'tonKeeper'
  const debug = false
  brokerWalletAddressGlobal = useSelector(brokerWalletAddressSelector)

  useState(() => {
    dispatch(giveMeWalletAddress())
  })

  const initActionButton = () => {
    tgMainButton.offClick(window.tgButtonCb)

    tgMainButton.setParams({
      text: 'Top up',
      is_visible: true,
    })

    tgMainButton.onClick(handleTopup)
    window.tgButtonCb = handleTopup
  }

  const handleTopup = () => {
    if (amountGlobal && parseInt(amountGlobal, 10) > 0) {
      const fee = 500000000
      const nanoton = parseInt(tonNumberToNano(amountGlobal)) + fee
      const paymentLink =
        walletType === 'tonKeeper'
          ? `https://app.tonkeeper.com/transfer/${brokerWalletAddressGlobal}?amount=${nanoton}&text=${message}`
          : `https://tonhub.com/transfer/${brokerWalletAddressGlobal}?amount=${nanoton}&text=${message}`

      if (debug) {
        document.querySelector('#debug').innerHTML = paymentLink
      }

      window.location.assign(paymentLink)
      goBack()
    } else {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
    }
  }

  const handleChange = (event) => {
    amountGlobal = event.target.value
    setAmount(event.target.value)
  }

  const goBack = () => {
    tgBackButton.hide()
    tgMainButton.hide()
    tgMainButton.hideProgress()
    navigate('/')
  }

  useEffect(() => {
    tgBackButton.show()
    tgBackButton.onClick(goBack)

    initActionButton()
  }, [])

  const [tipVisible, setTipVisible] = useState(false)
  const tipRef = useRef()

  return (
    <div className="page-topup">
      <div className="input-row input-container card">
        <div className="input-label">
          <label>Amount</label>
          <span
            className="info-container"
            onClick={() => setTipVisible(true)}
            ref={tipRef}
          >
            <span className="info-icon"></span>
          </span>
        </div>

        <input
          type="text"
          onChange={handleChange}
          className="input"
          placeholder="Enter amount"
          inputMode="numeric"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          value={amount}
          autoFocus
        />

        <div className="info-helper info-helper--mtop">
          Transaction fee: 0.5 TON
        </div>

        {debug && <span id="debug"></span>}
      </div>

      <Popover
        isOpen={tipVisible}
        getTarget={() => tipRef}
        onDialogCancel={() => setTipVisible(false)}
        cancelable={true}
      >
        <div className="info-tip">
          You may withdraw non blocked funds by click Withdraw button on the
          home screen.
        </div>
      </Popover>
    </div>
  )
}
