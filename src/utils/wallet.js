export const collapseAddress = (address, length = 6) => {
  return `${address.substring(0, length)}...${address.substring(
    address.length - length,
    address.length
  )}`
}
