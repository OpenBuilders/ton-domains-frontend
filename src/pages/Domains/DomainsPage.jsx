import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { domainsSelector, fetchDomains } from '../../store/domains'
import {
  currentUserBalanceSelector,
  currentUserSelector,
  userWalletAddressSelector,
} from '../../store/user/userSlice'
import { Menu, DomainsList } from '../../components'
import './DomainsPage.css'
import { collapseAddress } from '../../utils/wallet'
import { delay } from '../../utils'
import { DomainActions } from './components/DomainActions'

let domainsPolling = false
const domainsPollingDelay = 5000

const sortDomains = (list) => {
  const soldToMe = []
  const soldToOther = []
  const others = []

  list.forEach((domain) => {
    if (domain.status === 'sold') {
      if (domain.isOwner) {
        soldToMe.push(domain)
      } else {
        soldToOther.push(domain)
      }
    } else {
      others.push(domain)
    }
  })

  return [...others, ...soldToMe, ...soldToOther]
}

export const DomainsPage = () => {
  const dispatch = useDispatch()
  const domainsData = useSelector(domainsSelector)

  const [actionVisible, setActionVisible] = useState(false)
  const [domainListLoaded, setDomainListLoaded] = useState(false)
  const [domainContext, setDomainContext] = useState({})
  const user = useSelector(currentUserSelector)
  const userBalance = useSelector(currentUserBalanceSelector)
  const userId = user?.id

  const pollDomains = () => {
    domainsPolling = true

    const pollingAction = async () => {
      while (domainsPolling) {
        if (user && userId && domainsPolling) {
          await dispatch(fetchDomains({ userId }))
          if (!domainListLoaded) {
            setDomainListLoaded(true)
          }
        }

        await delay(domainsPollingDelay)
      }
    }

    pollingAction()
  }

  useEffect(() => {
    if (user && userId) {
      pollDomains()
    } else {
      domainsPolling = false
    }

    return () => {
      domainsPolling = false
    }
  }, [userId])

  const domainItemClick = (domainData) => {
    setActionVisible(true)
    setDomainContext(domainData)
  }

  const address = collapseAddress(useSelector(userWalletAddressSelector))
  const sortedDomainsData = sortDomains(domainsData)

  return (
    <>
      <Menu address={address} balance={userBalance} />
      <DomainsList
        domainsData={sortedDomainsData}
        domainItemClick={domainItemClick}
        domainListLoaded={domainListLoaded}
      />
      {domainContext.domainName && (
        <DomainActions
          isOpen={actionVisible}
          onClose={() => setActionVisible(false)}
          domainContext={domainContext}
        />
      )}
    </>
  )
}
