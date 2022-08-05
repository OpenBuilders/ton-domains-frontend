import TonWeb from 'tonweb'

// import * as tonMnemonic from 'tonweb-mnemonic'
// import { Contract } from 'tonweb/dist/types/contract/contract'
import {
  WalletAdapterInterface,
  WalletAdapterTransferOptions,
  WalletType,
} from '../../models'
import { TonWebService } from '../TonWebService'

export class TonWebAdapter implements WalletAdapterInterface {
  private walletAddress: string
  // private mnemonica: string[] = []
  // private seed: string = ''
  private type = WalletType.custom

  constructor({ walletAddress }: { walletAddress: string }) {
    this.walletAddress = walletAddress
  }
  // constructor({ mnemonica, seed }: { mnemonica?: string[]; seed?: string }) {
  //   this.mnemonica = mnemonica || []
  //   this.seed = seed || ''
  // }

  getType(): WalletType {
    return this.type
  }

  // async init() {
  //   if (!this.mnemonica && !this.seed) {
  //     throw new Error('Provide seed or mnemonica')
  //   }

  //   if (!this.seed) {
  //     const seed = await tonMnemonic.mnemonicToSeed(this.mnemonica)
  //     this.seed = TonWeb.utils.bytesToBase64(seed)
  //   }

  //   const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(
  //     TonWeb.utils.base64ToBytes(this.seed)
  //   )
  //   const tonweb = TonWebService.getProvider()
  //   const WalletClass = tonweb.wallet.all['v3R2']

  //   this.walletInstance = new WalletClass(tonweb.provider, {
  //     publicKey: keyPair.publicKey,
  //   })
  // }

  // getProvider(): Contract {
  //   return this.walletInstance
  // }

  // getSeed(): string {
  //   return this.seed
  // }

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

  async transfer(options: WalletAdapterTransferOptions): Promise<boolean> {
    // console.log(options)

    // const request = this.getProvider().methods.transfer({
    //   secretKey: keyPair.secretKey,
    //   toAddress: minterAddress.toString(true, true, true),
    //   amount: TonWeb.utils.toNano(0.5),
    //   seqno: seqno,
    //   payload: null, // body
    //   sendMode: 3,
    //   stateInit: (await minter.createStateInit()).stateInit,
    // })

    return new Promise<boolean>(() => {})
  }

  async signString(string: string): Promise<string> {
    return new Promise<string>(() => {})
  }
}
