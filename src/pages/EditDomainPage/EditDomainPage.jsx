import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  domainsSelector,
  fetchOneDomain,
  updateDomain,
} from '../../store/domains'

import { Button } from 'react-onsenui'

import './editDomainPage.css'
import { useSelector } from 'react-redux'
import { currentUserBalanceSelector, currentUserSelector } from '../../store/user/userSlice'
import { nanoToDisplay, nanoToNumber, tonNumberToNano } from '../../utils'

const tgMainButton = window.Telegram.WebApp.MainButton
const tgBackButton = window.Telegram.WebApp.BackButton
const debug = false

export const EditDomainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { domainName } = useParams()
  const [domain, setDomain] = useState(domainName)
  const [currentBid, setCurrentBid] = useState('')
  const [maxBid, setMaxBid] = useState('')
  const [maxBidValidationMsg, setMaxBidValidationMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(currentUserSelector)
  const userBalance = useSelector(currentUserBalanceSelector)

  useEffect(() => {
    tgBackButton.show()
    tgBackButton.onClick(goBack)

    initActionButton()
  }, [])

  useEffect(() => {
    const fetchDomainContext = async () => {
      const domainContext = await dispatch(
        fetchOneDomain({ domainName: domainName })
      ).then((res) => {
        return res.payload
      })

      setMaxBid(nanoToDisplay(domainContext.maxBid))
      setCurrentBid(nanoToNumber(domainContext.maxBid))
      window.state.maxBid = nanoToDisplay(domainContext.maxBid)
    }

    fetchDomainContext()

    //TODO: would be nice to not show this page for those who don't own this domain
    //TODO: cover catch
  }, [])

  const goBack = () => {
    tgBackButton.hide()
    tgMainButton.hide()
    tgMainButton.hideProgress()
    navigate('/')
  }

  const initActionButton = () => {
    tgMainButton.offClick(window.tgButtonCb)

    tgMainButton.setParams({
      text: 'Save',
      is_visible: true,
    })

    window.state = {
      domain: domain,
      maxBid: 0,
      validation: {
        domain: true,
        maxBid: true,
      },
    }

    tgMainButton.onClick(handleSave)
    window.tgButtonCb = handleSave
  }

  const handleMaxBidChange = (event) => {
    const bid = event.target.value.replace(',', '.')

    const userBalanceNumber = Number(nanoToNumber(userBalance.result))
    const currentBidIsOk = (userBalanceNumber + Number(currentBid)) >= Number(bid)
    const balanceIsOk = userBalanceNumber > 0

    if (!currentBidIsOk || !balanceIsOk) {
      window.state.validation.maxBid = false
      setMaxBidValidationMsg('Not sufficient funds, top up your account')
    } else if (Number(bid) < Number(maxBid)) {
      window.state.validation.maxBid = false
      setMaxBidValidationMsg('Must be higher then previous max bid')
    } else if (Number(bid) <= 0) {
      window.state.validation.maxBid = false
      setMaxBidValidationMsg('Must be greater than zero')
    } else {
      window.state.validation.maxBid = true
      setMaxBidValidationMsg('')
    }

    if (currentBid && Number(bid) < Number(currentBid)) {
      setMaxBidValidationMsg(
        `Must be greater than current bid ${Number(currentBid)} TON`
      )
    }

    setMaxBid(bid)
    window.state.maxBid = bid
  }

  const onStart = () => {
    setIsLoading(true)
    tgMainButton.setParams({
      text: 'Saving...',
    })
    tgMainButton.showProgress()
  }

  const onSuccess = () => {
    setIsLoading(false)
    goBack()
  }

  const handleSave = async () => {
    const formIsValid = window.state.validation.maxBid
    const noValidationMessages = !maxBidValidationMsg

    if (!isLoading && formIsValid && noValidationMessages) {
      onStart()

      if (debug) {
        document.getElementById(
          'handleSave-debug'
        ).innerText = `domain: ${window.state.domain},\nuserId: ${user.id},\nmaxBid: ${window.state.maxBid}`
      }

      const domainData = {
        userId: user.id,
        domainName: window.state.domain,
        maxBid: tonNumberToNano(window.state.maxBid),
      }

      await dispatch(updateDomain({ domainData: domainData }))

      onSuccess()
    }
  }

  return (
    <div className="page-add">
      <div className="page-inner">
        <div className="card">
          <div className="input-row">
            <div className="input-label">
              <label htmlFor="domain">Domain name</label>
            </div>
            <input
              name="domain"
              type="text"
              className="input"
              value={domain}
              disabled={true}
              required
            />
          </div>
          {/* <div className="input-row">
          <div className="input-label">
            <label htmlFor="minBid">First bid</label>
          </div>
          <input
            name="minBid"
            type="number"
            min={minBidValue()}
            className="input"
            placeholder="Where you want to start"
            disabled={isLoading}
            required
          />
        </div> */}
          <div className="input-row">
            <div className="input-label">
              <label htmlFor="maxBid">Max bid</label>
            </div>
            <input
              name="maxBid"
              type="text"
              className="input"
              onChange={handleMaxBidChange}
              value={maxBid}
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              max={user?.balance}
              disabled={isLoading}
              required
            />
            {maxBidValidationMsg && (
              <div className="input-validation">{maxBidValidationMsg}</div>
            )}
          </div>
          {debug && (
            <div className="debug-batya">
              <div id="handleSave-debug">handleSave</div>
            </div>
          )}
        </div>
      </div>
      {!window.Telegram.WebApp.initDataUnsafe.user && (
        <Button
          style={{ marginBottom: '20px', textAlign: 'center' }}
          onClick={() => handleSave()}
        >
          Save
        </Button>
      )}
    </div>
  )
}
