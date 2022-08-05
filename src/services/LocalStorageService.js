export class LocalStorageService {
  static setItem(key, value, removeIfEmpty = true) {
    if (removeIfEmpty && (value === null || value === undefined)) {
      return localStorage.removeItem(key)
    }

    localStorage.setItem(key, JSON.stringify(value))
  }

  static getItem(key, otherwise) {
    const data = localStorage.getItem(key)

    if (data !== null) {
      return JSON.parse(data)
    }

    if (otherwise) {
      return otherwise
    }

    return null
  }
}
