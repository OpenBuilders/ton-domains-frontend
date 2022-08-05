import { LocalStorageService } from './LocalStorageService'

const accessTokenName = 'accessToken'
const refreshTokenName = 'refreshToken'

export class AuthService {
  static setCredentials(credentials) {
    LocalStorageService.setItem(accessTokenName, credentials.accessToken)
    LocalStorageService.setItem(refreshTokenName, credentials.refreshToken)
  }

  static getCredentials() {
    return {
      accessToken: LocalStorageService.getItem(accessTokenName),
      refreshToken: LocalStorageService.getItem(refreshTokenName),
    }
  }

  static isAuth() {
    return !!AuthService.getCredentials().accessToken
  }

  static clearCredentials() {
    LocalStorageService.setItem(accessTokenName, null)
    LocalStorageService.setItem(refreshTokenName, null)
  }
}
