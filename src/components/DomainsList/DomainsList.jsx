import { List, ListItem } from 'react-onsenui'

import './domainsList.css'
import { DomainStatus } from '..'
import { DomainAuctionStatus } from './components/DomainAuctionStatus'

const DomainsListSkeleton = () => {
  return (
    <List
      dataSource={[1, 2, 3, 4, 5]}
      renderRow={(i) => (
        <ListItem key={i}>
          <div className="domains-list-skeleton">
            <div className="domains-list-skeleton-item"></div>
            <div className="domains-list-skeleton-item"></div>
          </div>
        </ListItem>
      )}
    />
  )
}

const listItemClassNames = (domain) => {
  let classes = ''

  if (domain.isPin) {
    classes += 'pinned '
  }

  if (domain.onPause) {
    classes += 'paused '
  }

  return classes
}

export const DomainsList = (props) => {
  const { domainListLoaded } = props

  const domainsInfo = [...props.domainsData].sort((el1, el2) => {
    return el2.isPin - el1.isPin
  })

  if (!domainListLoaded) {
    return <DomainsListSkeleton />
  } else if (!props.domainsData.length) {
    return <p className="unexpected-message">Your domain list is empty 🤷</p>
  } else if (!Array.isArray(props.domainsData)) {
    console.error('Unexpected response', domainsInfo)
    return (
      <p className="unexpected-message">Service is under construction 🚧</p>
    )
  }

  return (
    <List
      dataSource={domainsInfo}
      renderRow={(domain, idx) => (
        <ListItem
          key={idx}
          tappable={true}
          className={listItemClassNames(domain)}
          onClick={() => {
            props.domainItemClick(domain)
          }}
        >
          <div className="item-container">
            <div className="item-info">
              <span className="item-state">
                <DomainStatus domain={domain} onlyIcon={true} />
              </span>
              <div className="item-title-container">
                <div className="item-title">{domain.domainName}.ton</div>
                <DomainAuctionStatus domain={domain} />
              </div>
            </div>
            <div className="item-action">
              {domain.isPin && (
                <svg
                  className="item-pin"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.6161 6.42035C11.8382 6.19827 11.8382 5.83822 11.6161 5.61614L6.71974 0.719736C6.61158 0.611578 6.46441 0.551552 6.31146 0.553211C5.99741 0.556618 5.74559 0.813964 5.749 1.12801L5.77419 3.4507C5.77493 3.51867 5.74825 3.58408 5.70018 3.63215L4.5419 4.79043C4.49451 4.83783 4.43022 4.86445 4.36319 4.86445L1.37109 4.86446C1.22027 4.86446 1.07563 4.92437 0.968987 5.03101C0.746909 5.25309 0.746909 5.61315 0.968987 5.83523L3.48058 8.34639L1.14107 10.6868L1.10109 10.7337C0.994496 10.8819 1.00782 11.0896 1.14107 11.2229L1.18806 11.2629C1.33621 11.3695 1.54396 11.3561 1.67721 11.2229L4.01672 8.88254L6.52873 11.395C6.63538 11.5016 6.78002 11.5615 6.93084 11.5615C7.24491 11.5615 7.49951 11.3069 7.49951 10.9929L7.49951 8.00077C7.49951 7.93374 7.52613 7.86945 7.57353 7.82206L8.73465 6.66093C8.78205 6.61354 8.84634 6.58691 8.91337 6.58691L11.214 6.58691C11.3649 6.58691 11.5095 6.527 11.6161 6.42035ZM6.51206 1.58449L10.7563 5.82868L8.91322 5.82868C8.64509 5.82868 8.38795 5.93519 8.19836 6.12478L7.03724 7.2859C6.84765 7.47549 6.74114 7.73264 6.74114 8.00076L6.74114 10.5352L1.82857 5.62266L4.36304 5.62266C4.63116 5.62266 4.8883 5.51615 5.0779 5.32656L6.23617 4.16828C6.42845 3.976 6.53517 3.71437 6.53222 3.44246L6.51206 1.58449Z"
                    fill="#888E94"
                  />
                </svg>
              )}
              <svg
                className="item-more"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="8.5" stroke="#037EE5" />
                <circle cx="12.8571" cy="9" r="1.28571" fill="#037EE5" />
                <circle cx="8.99995" cy="9" r="1.28571" fill="#037EE5" />
                <circle cx="5.14289" cy="9" r="1.28571" fill="#037EE5" />
              </svg>
            </div>
          </div>
        </ListItem>
      )}
    />
  )
}
