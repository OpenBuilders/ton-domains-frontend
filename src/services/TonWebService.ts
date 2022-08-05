import TonWeb from 'tonweb'

// import * as tonMnemonic from 'tonweb-mnemonic'
import config from '../config'

const tonweb = new TonWeb(
  new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: config.tonCenterMainNetKey,
  })
)

export class TonWebService {
  static getProvider() {
    return tonweb
  }

  // static async mnemonica2key(mnemonica: string[]) {
  //   const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonica)
  //   const WalletClass = tonweb.wallet.all['v3R2']
  //   const wallet = new WalletClass(tonweb.provider, {
  //     publicKey: keyPair.publicKey,
  //   })
  //   const walletAddress = await wallet.getAddress()
  // }

  static getWalletInstance() {}

  // static async getTokenBalance(address: string) {}
}
