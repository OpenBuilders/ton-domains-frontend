export function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000
  var msPerHour = msPerMinute * 60
  var msPerDay = msPerHour * 24
  var msPerMonth = msPerDay * 30
  var msPerYear = msPerDay * 365

  var elapsed = current - previous

  if (elapsed === 0) {
    return 'Just now'
  }

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' sec ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' min ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return 'about ' + Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return 'about ' + Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return 'about ' + Math.round(elapsed / msPerYear) + ' years ago'
  }
}

export const getReturnValues = (targetDate) => {
  const now = new Date().getTime()
  const countDown = new Date(targetDate).getTime() - now

  let days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  let hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  days = days <= 0 ? 0 : days
  hours = hours <= 0 ? 0 : hours
  minutes = minutes <= 0 ? 0 : minutes
  seconds = seconds <= 0 ? 0 : seconds

  return {
    days: days < 10 ? `${days}` : days.toString(),
    hours: hours < 10 ? `${hours}` : hours.toString(),
    minutes: minutes < 10 ? `${minutes}` : minutes.toString(),
    seconds: seconds < 10 ? `${seconds}` : seconds.toString(),
  }
}
