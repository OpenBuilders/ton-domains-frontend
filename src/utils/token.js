import BigNumber from 'bignumber.js'

export const tonNumberToNano = (value, decimal = 9) => {
  return new BigNumber(value)
    .multipliedBy(new BigNumber(10).exponentiatedBy(decimal))
    .toString()
}

export const nanoToNumber = (value, decimal = 9) => {
  return new BigNumber(value)
    .div(new BigNumber(10).exponentiatedBy(decimal))
    .toFixed(decimal)
}

export const nanoToDisplay = (value, decimal = 9, toFixed = 0) => {
  const n = new BigNumber(value).div(new BigNumber(10).exponentiatedBy(decimal))

  if (toFixed) {
    return n.toFixed(toFixed).replace('.00', '')
  }

  return n.toFixed()
}

export const greaterThan = (valueA, valueB) => {
  const a = new BigNumber(valueA)
  const b = new BigNumber(valueB)

  return a.isGreaterThan(b)
}
