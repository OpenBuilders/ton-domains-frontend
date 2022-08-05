import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ActionSheet, ActionSheetButton } from 'react-onsenui'

import { deleteDomain, updateDomain } from '../../../store/domains'

export const DomainActions = ({ domainContext, isOpen, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const pinAction = () => {
    const isPinNewValue = domainContext.isPin ? false : true
    const updatedDomainData = { ...domainContext, isPin: isPinNewValue }

    dispatch(updateDomain({ domainData: updatedDomainData }))
    onClose()
  }

  const handleDelete = () => {
    if (domainContext.domainName) {
      dispatch(deleteDomain({ domainName: domainContext.domainName }))
    }

    onClose()
  }

  const showEdit =
    domainContext &&
    domainContext.status !== 'sold' &&
    domainContext.status !== 'processing' &&
    domainContext.status !== 'booked'

  const showDelete =
    domainContext &&
    !domainContext.isOwner &&
    domainContext.status !== 'sold' &&
    domainContext.status !== 'processing' &&
    domainContext.status !== 'booked'

  const showHide =
    domainContext && !domainContext.isOwner && domainContext.status === 'sold'

  return (
    <ActionSheet
      visible={isOpen}
      title="What do you want to do with this domain?"
      onCancel={onClose}
    >
      <ActionSheetButton
        className={[!showEdit && 'hide-this-sheet'].join(' ')}
        disabled={true}
        onClick={() => {
          if (domainContext.status !== 'sold') {
            navigate(`/edit/${domainContext.domainName}`)
          }
        }}
      >
        Edit
      </ActionSheetButton>
      <ActionSheetButton onClick={pinAction}>
        {domainContext.isPin ? `Unpin` : `Pin`}
      </ActionSheetButton>

      <ActionSheetButton>
        <a
          href={`https://dns.ton.org/#${domainContext.domainName}`}
          target="_blank"
          rel="noreferrer"
          className="domain-action-link"
        >
          Open TON DNS
        </a>
      </ActionSheetButton>

      <ActionSheetButton
        className={[!showDelete && 'hide-this-sheet'].join(' ')}
        modifier="destructive"
        onClick={handleDelete}
      >
        Stop auction and refund
      </ActionSheetButton>

      <ActionSheetButton
        className={[!showHide && 'hide-this-sheet'].join(' ')}
        modifier="destructive"
        onClick={handleDelete}
      >
        Hide from list
      </ActionSheetButton>

      <ActionSheetButton onClick={onClose}>Cancel</ActionSheetButton>
    </ActionSheet>
  )
}
