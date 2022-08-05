import { nanoToDisplay } from '../../../utils'

export const BidsMeta = ({ domain }) => {
  let attention = false

  if (
    domain.currentBid &&
    domain.maxBid &&
    parseInt(domain.currentBid) >= parseInt(domain.maxBid)
  ) {
    attention = true
  }

  return (
    <>
      {domain.currentBid && (
        <span
          className={['item-current-bid', attention && 'item-attention'].join(
            ','
          )}
        >
          {nanoToDisplay(domain.currentBid, 9, 2)} TON{' '}
          {domain.isOwner ? 'your' : "somebody's"} bid,{' '}
        </span>
      )}

      {domain.maxBid &&
        (domain.status === 'auction' || domain.status === 'free') && (
          <span
            className={['item-price', attention && 'item-attention'].join(' ')}
          >
            {nanoToDisplay(domain.maxBid, 9, 2)} TON max
          </span>
        )}
    </>
  )
}
