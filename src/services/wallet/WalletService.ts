import {
  WalletAdapterInterface,
  WalletAdapterTransferOptions,
  WalletType,
} from '../../models'

export class WalletService {
  private static adapter: WalletAdapterInterface

  static getAdapterType(): WalletType {
    return WalletService.adapter.getType()
  }

  static setAdapter(adapter: WalletAdapterInterface) {
    WalletService.adapter = adapter
  }

  static async getBalance(): Promise<string> {
    return await this.adapter.getBalance()
  }

  static async getWalletAddress(): Promise<string> {
    return await this.adapter.getWalletAddress()
  }

  static async getWallets() {
    return await this.adapter.getWallets()
  }

  static async transfer(
    options: WalletAdapterTransferOptions
  ): Promise<boolean> {
    return await this.adapter.transfer(options)
  }

  static async signString(stringToSign: string): Promise<string> {
    return await this.adapter.signString(stringToSign)
  }

  static isTanWalletChromeAvailable(): boolean {
    const w = window as any
    return !!(w.ton && w.ton.isTonWallet)
  }

  static isTestnet(): boolean {
    return self.location.href.indexOf('testnet') !== -1
  }
}
