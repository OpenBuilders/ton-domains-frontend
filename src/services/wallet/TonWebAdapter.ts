import {
  WalletAdapterInterface,
  WalletAdapterTransferOptions,
  WalletType,
} from '../../models'
import { TonWebService } from '../TonWebService'

export class TonWebAdapter implements WalletAdapterInterface {
  private walletAddress: string
  private type = WalletType.custom

  constructor({ walletAddress }: { walletAddress: string }) {
    this.walletAddress = walletAddress
  }

  getType(): WalletType {
    return this.type
  }

  async getBalance(): Promise<string> {
    const tonweb = TonWebService.getProvider()
    const address = await this.getWalletAddress()
    const balance = await tonweb.getBalance(address)

    return balance
  }

  async getWalletAddress(): Promise<string> {
    return new Promise<string>((resolve) => resolve(this.walletAddress))
  }

  async getWallets(): Promise<
    { publicKey: string; address: string; walletVersion: string }[]
  > {
    return new Promise(() => {})
  }


  async signString(string: string): Promise<string> {
    return new Promise<string>(() => {})
  }
}
