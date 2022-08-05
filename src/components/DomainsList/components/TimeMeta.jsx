import { getReturnValues } from '../../../services/TimeFormatter'

export const TimeMeta = ({ domain }) => {
  if (domain.status === 'sold' || !domain.finishAt) {
    return null
  }

  const dateValues = getReturnValues(domain.finishAt)

  let timeString = ''

  if (dateValues.days !== '0') {
    timeString = `${dateValues.days}d ${dateValues.hours}h`
  }

  if (dateValues.days === '0' && dateValues.hours !== '0') {
    timeString = `${dateValues.hours}h ${dateValues.minutes}m`
  }

  if (dateValues.days === '0' && dateValues.hours === '0') {
    timeString = `${dateValues.minutes}m ${dateValues.seconds}s`
  }

  return <span className="item-time">{timeString} left</span>
}
