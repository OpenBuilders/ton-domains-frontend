import {
  WalletAdapterInterface,
  WalletAdapterTransferOptions,
  WalletType,
} from '../../models'

export class TonWalletAdapter implements WalletAdapterInterface {
  private type = WalletType.tonWallet

  getType(): WalletType {
    return this.type
  }

  getProvider() {
    return (window as any).ton
  }

  async getBalance(): Promise<string> {
    return await this.getProvider().send('ton_getBalance')
  }

  async getWalletAddress(): Promise<string> {
    const accounts = await this.getProvider().send('ton_requestAccounts')

    return accounts[0]
  }

  async getWallets(): Promise<
    { publicKey: string; address: string; walletVersion: string }[]
  > {
    return await this.getProvider().send('ton_requestWallets')
  }

  async transfer(options: WalletAdapterTransferOptions): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const transferPromise = this.getProvider().send('ton_sendTransaction', [
        {
          value: options.value,
          to: options.to,
        },
      ])

      transferPromise.then(() => {
        resolve(true)
      })

      transferPromise.catch(() => {
        resolve(false)
      })
    })
  }

  async signString(stringToSign: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const signPromise = this.getProvider().send('ton_rawSign', [
        {
          data: stringToSign,
        },
      ])

      signPromise.then((raw: string) => {
        resolve(raw)
      })

      signPromise.catch((error: any) => {
        reject(error)
      })
    })
  }
}
