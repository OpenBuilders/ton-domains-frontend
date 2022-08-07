export const DomainStatus = (props) => {
  const { isChecking } = props

  if (isChecking) {
    return 'Checking...'
  }

  const tickSvg = (
    <svg
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
      <path
        d="M1.75447 4.67887C1.39198 4.2622 0.760338 4.21827 0.343664 4.58077C-0.0730107 4.94326 -0.116933 5.5749 0.24556 5.99157L2.85982 8.99658C3.25843 9.45478 3.97011 9.45478 4.36873 8.99658L10.7545 1.65637C11.117 1.23969 11.073 0.608052 10.6564 0.24556C10.2397 -0.116933 9.60805 -0.0730107 9.24556 0.343664L3.61427 6.81665L1.75447 4.67887Z"
        fill="#39B56B"
      />{' '}
    </svg>
  )
  const greenCircle = (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
      <circle cx="4" cy="4" r="4" fill="#50C878" />
    </svg>
  )
  const blueCircle = (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
      <circle cx="4" cy="4" r="4" fill="#037EE5" />
    </svg>
  )
  const redCircle = (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
      <circle cx="4" cy="4" r="4" fill="#FE3B30" />
    </svg>
  )

  const getStatusObj = () => {
    if (props.domain.isOwner && props.domain.status === 'sold') {
      return {
        icon: tickSvg,
        status: 'Owned',
      }
    } else if (props.domain.onPause) {
      return {
        icon: '⏸',
        status: 'Paused',
      }
    }

    switch (props.domain.status) {
      case 'free':
        return {
          icon: greenCircle,
          status: 'Available',
        }
      case 'new':
        return {
          icon: greenCircle,
          status: 'Free',
        }
      case 'booked':
      case 'processing':
      case 'auction':
      case 'sync':
        return {
          icon: blueCircle,
          status: 'Auction in process',
        }
      case 'sold':
        return {
          icon: redCircle,
          status: 'Sold',
        }
      default:
        return {
          icon: '',
          status: '',
        }
    }
  }

  const statusObj = getStatusObj()

  if (props.onlyIcon) {
    return statusObj.icon
  }

  return (
    <>
      {statusObj.icon} {statusObj.status}
    </>
  )
}
