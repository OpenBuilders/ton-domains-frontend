import { nanoToDisplay } from '../../../utils'
import { BidsMeta } from './BidsMeta'
import { TimeMeta } from './TimeMeta'

const getOwnerStatus = (domain) => {
  let prefix = ''
  const isBoughtByMe = domain.isOwner && domain.status === 'sold'
  const isBoughtBySomeone = !domain.isOwner && domain.status === 'sold'

  if (domain.status !== 'sold') {
    prefix = ','
  }

  if (isBoughtByMe) {
    return prefix + 'domain sent to your wallet'
  }

  if (isBoughtBySomeone) {
    return prefix + 'owned by someone else'
  }

  return null
}

export const DomainAuctionStatus = ({ domain }) => {
  if (domain.status === 'sold') {
    const isBoughtByMe = domain.isOwner

    if (isBoughtByMe) {
      return (
        <div className="item-auction-status-item">
          Bought for {nanoToDisplay(domain.currentBid, 9, 2)} TON
        </div>
      )
    }

    if (!isBoughtByMe) {
      return (
        <div className="item-auction-status-item">
          Bought for {nanoToDisplay(domain.currentBid, 9, 2)} TON by someone
          else
        </div>
      )
    }
  }

  if (domain.status === 'processing' || domain.status === 'booked') {
    return (
      <div className="item-meta">
        <span className="item-time">processing...</span>
      </div>
    )
  }

  return (
    <>
      <div className="item-meta">
        <BidsMeta domain={domain} />
        <span className="item-owner-status">{getOwnerStatus(domain)}</span>
      </div>
      <TimeMeta domain={domain} />
    </>
  )
}
