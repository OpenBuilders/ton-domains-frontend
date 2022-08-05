export class CookieService {
  static readonly documentIsAccessible = true

  private static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(
      /([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi,
      '\\$1'
    )

    return new RegExp(
      '(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)',
      'g'
    )
  }

  private static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent)
    } catch {
      return encodedURIComponent
    }
  }

  static check(name: string): boolean {
    if (!CookieService.documentIsAccessible) {
      return false
    }
    name = encodeURIComponent(name)
    const regExp: RegExp = CookieService.getCookieRegExp(name)
    return regExp.test(document.cookie)
  }

  static get(name: string): string {
    if (CookieService.documentIsAccessible && CookieService.check(name)) {
      name = encodeURIComponent(name)

      const regExp: RegExp = CookieService.getCookieRegExp(name)
      const result = regExp.exec(document.cookie)

      if (!result) {
        return ''
      }

      return result[1] ? CookieService.safeDecodeURIComponent(result[1]) : ''
    } else {
      return ''
    }
  }

  static getAll(): { [key: string]: string } {
    if (!CookieService.documentIsAccessible) {
      return {}
    }

    const cookies: { [key: string]: string } = {}

    if (document.cookie && document.cookie !== '') {
      document.cookie.split(';').forEach((currentCookie) => {
        const [cookieName, cookieValue] = currentCookie.split('=')
        cookies[
          CookieService.safeDecodeURIComponent(cookieName.replace(/^ /, ''))
        ] = CookieService.safeDecodeURIComponent(cookieValue)
      })
    }

    return cookies
  }

  static set(
    name: string,
    value: string,
    expires?: number | Date,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: 'Lax' | 'None' | 'Strict'
  ): void

  static set(
    name: string,
    value: string,
    options?: {
      expires?: number | Date
      path?: string
      domain?: string
      secure?: boolean
      sameSite?: 'Lax' | 'None' | 'Strict'
    }
  ): void

  static set(
    name: string,
    value: string,
    expiresOrOptions?: number | Date | any,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: 'Lax' | 'None' | 'Strict'
  ): void {
    if (!CookieService.documentIsAccessible) {
      return
    }

    if (
      typeof expiresOrOptions === 'number' ||
      expiresOrOptions instanceof Date ||
      path ||
      domain ||
      secure ||
      sameSite
    ) {
      const optionsBody = {
        expires: expiresOrOptions,
        path,
        domain,
        secure,
        sameSite: sameSite ? sameSite : 'Lax',
      }

      CookieService.set(name, value, optionsBody)
      return
    }

    let cookieString: string =
      encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';'

    const options = expiresOrOptions ? expiresOrOptions : {}

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const dateExpires: Date = new Date(
          new Date().getTime() + options.expires * 1000 * 60 * 60 * 24
        )

        cookieString += 'expires=' + dateExpires.toUTCString() + ';'
      } else {
        cookieString += 'expires=' + options.expires.toUTCString() + ';'
      }
    }

    if (options.path) {
      cookieString += 'path=' + options.path + ';'
    }

    if (options.domain) {
      cookieString += 'domain=' + options.domain + ';'
    }

    if (options.secure === false && options.sameSite === 'None') {
      options.secure = true
      console.warn(
        `[ngx-cookie-service] Cookie ${name} was forced with secure flag because sameSite=None.` +
          `More details : https://github.com/stevermeister/ngx-cookie-service/issues/86#issuecomment-597720130`
      )
    }
    if (options.secure) {
      cookieString += 'secure;'
    }

    if (!options.sameSite) {
      options.sameSite = 'Lax'
    }

    cookieString += 'sameSite=' + options.sameSite + ';'

    document.cookie = cookieString
  }

  static delete(
    name: string,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'
  ): void {
    if (!CookieService.documentIsAccessible) {
      return
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT')
    CookieService.set(name, '', {
      expires: expiresDate,
      path,
      domain,
      secure,
      sameSite,
    })
  }

  static deleteAll(
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'
  ): void {
    if (!CookieService.documentIsAccessible) {
      return
    }

    const cookies: any = CookieService.getAll()

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        CookieService.delete(cookieName, path, domain, secure, sameSite)
      }
    }
  }
}
