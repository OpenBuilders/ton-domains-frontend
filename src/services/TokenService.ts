const data: TokenInfo[] = [
  {
    id: '1',
    projectId: '1',
    ticker: 'GREAT',
    totalSupply: 100000000,
    initialMarketCap: 7500000,
    tokenPriceTON: 0.0075,
    tokenPriceUSD: 0.015,
    saleStartTime: 'April 29th 2022, 1:00 PM UTC',
    saleEndTime: 'March 5th 2022, 1:00 PM UTC',
    tokenAddress: '0x11a819beb0aa3327e39f52f90d65cc9bca499f33',
  },
]

export type TokenInfo = {
  id: string
  projectId: string
  ticker: string
  totalSupply: number
  initialMarketCap: number
  tokenPriceTON: number
  tokenPriceUSD: number
  saleStartTime: string
  saleEndTime: string
  tokenAddress: string
}

export class TokenService {
  static getTokenByProject(projectId: string): TokenInfo {
    const tokens = data.filter((token) => token.id === projectId)

    return tokens.length ? tokens[0] : data[0]
  }
}