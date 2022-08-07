import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { addDomain } from '../../store/domains'
import { ApiService } from '../../services'

import { Button, Popover } from 'react-onsenui'

import './AddDomainPage.css'
import debounce from '../../utils/debounce'
import { AddDomainConfirm, DomainStatus } from '../../components'
import { useSelector } from 'react-redux'
import {
  currentUserBalanceSelector,
  currentUserSelector,
} from '../../store/user/userSlice'
import { nanoToDisplay, nanoToNumber, tonNumberToNano } from '../../utils'

const tgMainButton = window.Telegram.WebApp.MainButton
const tgBackButton = window.Telegram.WebApp.BackButton
const debug = false
const backendWalletAddress = process.env.REACT_APP_WALLET_ADDRESS

export const AddDomainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(currentUserSelector)
  const [domain, setDomain] = useState('')
  const [minBid, setMinBid] = useState('')
  const [domainAdded, setDomainAdded] = useState(false)
  const [isAddDomainConfirmOpen, setIsAddDomainConfirmOpen] = useState(false)
  const [maxBid, setMaxBid] = useState()
  const [domainValidationMsg, setDomainValidationMsg] = useState('')
  const [maxBidValidationMsg, setMaxBidValidationMsg] = useState('')
  const [domainContext, setDomainContext] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [maxTipVisible, setMaxTipVisible] = useState(false)
  const [minTipVisible, setMinTipVisible] = useState(false)
  const userBalance = useSelector(currentUserBalanceSelector)

  const goBack = () => {
    tgBackButton.hide()
    tgMainButton.hide()
    tgMainButton.hideProgress()
    navigate('/')
  }

  const initActionButton = () => {
    tgMainButton.offClick(window.tgButtonCb)

    tgMainButton.setParams({
      text: 'Add',
      is_visible: true,
      is_active: false,
      color: '#ccc',
    })

    window.state = {
      domain: domain,
      maxBid: maxBid,
    }

    tgMainButton.onClick(handleStart)
    window.tgButtonCb = handleStart
  }

  useEffect(() => {
    tgBackButton.show()
    tgBackButton.onClick(goBack)

    initActionButton()
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    if (!isMaxBidValid() || !domain || domainAdded) {
      setTelegramButtonInvalidState()
    } else {
      setTelegramButtonValidState()
    }
  }, [maxBid, domain])

  const onStart = () => {
    setIsLoading(true)
    tgMainButton.setParams({
      text: 'Starting...',
    })
    tgMainButton.showProgress()
  }

  const onSuccess = () => {
    setIsLoading(false)
    goBack()
  }

  const setTelegramButtonInvalidState = () => {
    tgMainButton.disable()
    tgMainButton.setParams({
      color: '#ccc',
    })
  }

  const setTelegramButtonValidState = () => {
    tgMainButton.enable()
    tgMainButton.setParams({
      color: '#0076ff',
    })
  }

  const handleDomainChange = (event) => {
    window.state.domain = event.target.value
    setDomain(event.target.value)
    checkDomainAvailability(event.target.value)

    if (debug) {
      document.getElementById('handleDomainChange-debug').innerText =
        event.target.value
    }

    if (event.target.value.length === 0) {
      setDomainContext('')
      setDomainValidationMsg('')
    }

    if (event.target.value.length < 4 || event.target.value.length > 126) {
      setDomainContext('')
      setDomainValidationMsg('Must be between 4 and 126 characters\n')
    } else if (!event.target.value.match(/^[a-z0-9-]+$/g)) {
      setDomainContext('')
      setDomainValidationMsg(
        'Lowercase eng letters, digits, and hyphens only\n'
      )
    } else {
      setDomainValidationMsg('')
    }
  }

  const handleMaxBidChange = (event) => {
    const bid = event.target.value.replace(',', '.')

    setMaxBid(bid)
    window.state.maxBid = bid
  }

  const isMaxBidValid = () => {
    const userBalanceNumber = Number(nanoToNumber(userBalance.result))
    const balanceIsOk = userBalanceNumber > 0
    const minBidIsOk = userBalanceNumber >= Number(minBid)
    const maxBidIsOk = userBalanceNumber >= Number(maxBid)

    if (maxBid === undefined) {
      setMaxBidValidationMsg('')
      return false
    } else if (Number(minBid) > Number(maxBid)) {
      setMaxBidValidationMsg('Max bid must be higher than min bid')
      return false
    } else if (!balanceIsOk || !minBidIsOk || !maxBidIsOk) {
      setMaxBidValidationMsg('Insufficient balance')
      return false
    } else if (Number(maxBid) <= 0) {
      setMaxBidValidationMsg('Must be greater than zero')
      return false
    } else {
      setMaxBidValidationMsg('')
      return true
    }
  }

  const checkDomainAvailability = async (domainName) => {
    setIsChecking(true)
    setDomainAdded(false)

    const response = await ApiService.get({
      params: { domain: domainName },
      endpoint: '/domains/status2',
    })

    setDomainContext(response.data)
    setMinBid(nanoToDisplay(response.data.nextBid))
    setMaxBid(nanoToDisplay(response.data.nextBid))
    window.state.maxBid = nanoToDisplay(response.data.nextBid)

    // if (response.data.currentAddress === backendWalletAddress) {
    //   setDomainAdded(true)
    // }

    setIsChecking(false)
  }

  const handleStart = async () => {
    domainElem.current.blur()
    setIsAddDomainConfirmOpen(true)
  }

  const handleAddDomain = async () => {
    onStart()

    if (debug) {
      document.getElementById('handleStart-debug').innerText = `
        domain: ${window.state.domain},\n
        userId: ${user.id},\n
        maxBid: ${window.state.maxBid}`
    }

    const domainData = {
      userId: user.id,
      domainName: window.state.domain,
      maxBid: tonNumberToNano(window.state.maxBid),
    }

    await dispatch(addDomain(domainData))

    onSuccess()
  }

  const maxRef = useRef()
  const minRef = useRef()

  let showFormFields = false
  const showDomainAddedError = domainAdded && domainContext.status !== 'sold'

  if (
    !domainValidationMsg.length &&
    domainContext &&
    domainContext.status !== 'sold' &&
    !showDomainAddedError
  ) {
    showFormFields = true
  }

  const domainElem = useRef()

  return (
    <div className="page-add">
      <div className="page-inner">
        <div className="card">
          <div className="input-row">
            <div className="input-label input-label--stretch">
              <label htmlFor="domain">Domain name</label>
              <div className="domain-status">
                {domainContext && (
                  <DomainStatus
                    domain={domainContext}
                    isChecking={isChecking}
                  />
                )}
              </div>
            </div>
            <input
              name="domain"
              type="text"
              className="input"
              onChange={debounce(handleDomainChange, 300)}
              placeholder="Enter domain name"
              minLength="4"
              maxLength="126"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="none"
              disabled={isLoading}
              required
              ref={domainElem}
            />
            <div className="info-helper info-helper--mtop">
              {domain ? `${domain}.ton` : ''}
            </div>
            {showDomainAddedError && (
              <div className="input-validation">
                It is currently not supported. You can buy this domain manually{' '}
                <a
                  href={`https://dns.ton.org/#${domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="validation-rules-link"
                >
                  {domain}
                </a>
              </div>
            )}
            {domainValidationMsg && (
              <div className="input-validation">
                {domainValidationMsg}{' '}
                <a
                  href="https://telegra.ph/TON-DNS-auction-rules-07-21"
                  target="_blank"
                  rel="noreferrer"
                  className="validation-rules-link"
                >
                  auction rules
                </a>
              </div>
            )}
          </div>

          <div
            className={[
              'min-bid-row',
              'fadedOut',
              showFormFields && 'fadedIn',
            ].join(' ')}
          >
            <div className="input-label">
              <label>Min bid</label>
              <span
                className="info-container"
                onClick={() => setMinTipVisible(true)}
                ref={minRef}
              >
                <span className="info-icon"></span>
              </span>
            </div>
            {minBid && <span className="minBid-value">{minBid} TON</span>}
            {!minBid && (
              <span className="info-helper">
                Enter domain name to calculate Min bid
              </span>
            )}
          </div>

          <div
            className={[
              'input-row',
              'fadedOut',
              showFormFields && 'fadedIn',
            ].join(' ')}
          >
            <div className="input-label">
              <label htmlFor="maxBid">Max bid</label>
              <span
                className="info-container"
                onClick={() => setMaxTipVisible(true)}
                ref={maxRef}
              >
                <span className="info-icon"></span>
              </span>
            </div>
            <input
              name="maxBid"
              type="text"
              className="input"
              onChange={handleMaxBidChange}
              value={maxBid}
              placeholder="Place your max bid"
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              disabled={isLoading}
              required
            />
            {/* <div className="input-helper">How much are you willing to spend</div> */}
            {maxBidValidationMsg && (
              <div className="input-validation">{maxBidValidationMsg}</div>
            )}
          </div>
          {debug && (
            <div className="debug-batya">
              <div id="handleStart-debug">handleStart</div>
              <div id="handleDomainChange-debug">handleDomainChange</div>
            </div>
          )}
        </div>
      </div>
      {!window.Telegram.WebApp.initDataUnsafe.user && (
        <Button
          style={{ marginBottom: '20px', textAlign: 'center' }}
          onClick={handleStart}
        >
          Start
        </Button>
      )}

      <Popover
        isOpen={maxTipVisible}
        getTarget={() => maxRef}
        onDialogCancel={() => setMaxTipVisible(false)}
        cancelable={true}
      >
        <div className="info-tip">
          This amount will be blocked from your balance while the auction is in
          progress.
        </div>
      </Popover>

      <Popover
        isOpen={minTipVisible}
        getTarget={() => minRef}
        onDialogCancel={() => setMinTipVisible(false)}
        cancelable={true}
      >
        <div className="info-tip">
          Based on the previous bid or the length of the domain.
        </div>
      </Popover>

      <AddDomainConfirm
        onCancel={() => setIsAddDomainConfirmOpen(false)}
        onConfirm={() => {
          handleAddDomain()
          setIsAddDomainConfirmOpen(false)
        }}
        domainName={domain}
        domainBid={maxBid}
        isOpen={isAddDomainConfirmOpen}
      />
    </div>
  )
}
