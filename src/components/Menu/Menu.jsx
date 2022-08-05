import { useEffect, useRef, useState } from 'react'
import { AlertDialog, Button, Card, Popover } from 'react-onsenui'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LocalStorageService } from '../../services'
import { signOut } from '../../store/auth'
import { withdrawBalance } from '../../store/user/userActions'
import { nanoToDisplay } from '../../utils'
import { useToast } from '../Toaster/Toaster'

import './menu.css'

const TonBalanceSkeleton = () => {
  return <div className="balance-skeleton"></div>
}

export const Menu = ({ balance, address }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { addToast } = useToast()

  const handleLogOut = () => dispatch(signOut())
  const handleTopup = () => navigate('/topup')
  const handleWithdraw = () => {
    setWithdrawOpen(false)
    dispatch(withdrawBalance())

    addToast('Balance is sent to your wallet')
  }

  const tonBalance =
    balance.result !== null
      ? nanoToDisplay(balance.result, 9, 2)
      : balance.result
  const bRef = useRef()
  const [balanceTipVisible, setBalanceTipVisible] = useState(false)
  const totalBalance = nanoToDisplay(
    balance.balance - balance.spentAmount - balance.withdrawalAmount,
    9,
    2
  )
  const allMyMaxBids = nanoToDisplay(balance.blockedAmount, 9, 2)

  return (
    <>
      {process.env.NODE_ENV !== 'production' && (
        <div className="env-alarm">You're on {process.env.NODE_ENV}</div>
      )}
      <Card className="tiny-section">
        <span className="tiny-section-head">My address</span>
        <span className="tiny-section-info">{address}</span>
        <div
          className="tiny-section-logout"
          onClick={() => setLogoutOpen(true)}
        >
          Logout
        </div>
      </Card>
      {/* <Card className="tiny-section">
        <textarea rows={6} cols={100}>
          {LocalStorageService.getItem('accessToken')}
        </textarea>
      </Card> */}
      <Card>
        <div className="tiny-section">
          <span className="tiny-section-head" ref={bRef}>
            Balance{' '}
            <span
              className="info-container"
              onClick={() => setBalanceTipVisible(true)}
            >
              <span className="info-icon"></span>
            </span>
            <Popover
              isOpen={balanceTipVisible}
              getTarget={() => bRef}
              onDialogCancel={() => setBalanceTipVisible(false)}
              cancelable={true}
              modifier="top"
            >
              <div className="info-tip">
                The balance is calculated by the formula:
                <br />
                total balance&nbsp;({totalBalance}&nbsp;TON) - all my maximum
                bids&nbsp;(
                {allMyMaxBids}
                &nbsp;TON)
              </div>
            </Popover>
          </span>
          <span className="tiny-section-info-balance">
            {tonBalance ? `${tonBalance} TON` : TonBalanceSkeleton()}
          </span>
        </div>

        <div className="section-grid">
          <div className="section-grid-left">
            <Button
              className="tiny-section-button"
              modifier="quiet"
              onClick={handleTopup}
            >
              Top up
            </Button>
          </div>
          <div className="section-grid-right">
            <Button
              className="tiny-section-button"
              modifier="quiet"
              onClick={() => setWithdrawOpen(true)}
              disabled={tonBalance === '0'}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Card>
      <Card className="tiny-section">
        <Button
          className="tiny-section-button"
          modifier="quiet"
          onClick={() => navigate('/add')}
          disabled={tonBalance === '0'}
        >
          Add domain
        </Button>
      </Card>

      <AlertDialog
        isOpen={withdrawOpen}
        onCancel={() => setWithdrawOpen(false)}
        cancelable
        modifier="rowfooter"
      >
        <div className="alert-dialog-title">Withdraw balance</div>
        <div className="alert-dialog-content">
          Your balance {tonBalance} TON will be returned back to wallet{' '}
          <span className="wallet-address">{address}</span>
        </div>
        <div className="alert-dialog-footer">
          <Button
            onClick={() => setWithdrawOpen(false)}
            className="alert-dialog-button"
          >
            Cancel
          </Button>
          <Button onClick={handleWithdraw} className="alert-dialog-button">
            Continue
          </Button>
        </div>
      </AlertDialog>

      <AlertDialog
        isOpen={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        cancelable
        modifier="rowfooter"
      >
        <div className="alert-dialog-title">Logout</div>
        <div className="alert-dialog-content">
          Are you sure you want to logout?
        </div>
        <div className="alert-dialog-footer">
          <Button
            onClick={() => setLogoutOpen(false)}
            className="alert-dialog-button"
          >
            Cancel
          </Button>
          <Button onClick={handleLogOut} className="alert-dialog-button">
            Logout
          </Button>
        </div>
      </AlertDialog>
    </>
  )
}
