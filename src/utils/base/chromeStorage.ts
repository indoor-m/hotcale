export abstract class ChromeStorageObject {
  abstract key: string
  abstract id: string

  equals(id: string): boolean {
    return this.id === id
  }
}

export const getAll = <T extends ChromeStorageObject>(
  key: string,
  callback?: (objects: T[]) => void
): void => {
  chrome.storage.sync.get(key, (items) => {
    const objects = items[key]

    // 値のチェック
    if (!Array.isArray(objects)) {
      return null
    }

    callback(objects as T[])
  })
}

export const findById = <T extends ChromeStorageObject>(
  key: string,
  id: string,
  callback?: (object: T) => void
): T | null => {
  chrome.storage.sync.get(key, (items) => {
    const objects = items[key]

    // 値のチェック
    if (!Array.isArray(objects)) {
      return null
    }

    const chromeObject = objects as T[]

    // idで検索
    const index = chromeObject.findIndex((chromeObject) =>
      chromeObject.equals(id)
    )

    if (index == -1) {
      throw new Error(`${key} does not exists.`)
    }

    callback(chromeObject[index])
  })

  return null
}

export const add = <T extends ChromeStorageObject>(
  key: string,
  object: T
): void => {
  chrome.storage.sync.get(key, (items) => {
    const objects = items[key]

    // 値のチェック
    if (!Array.isArray(objects)) {
      throw new Error(`${key} does not exists.`)
    }

    const chromeObjects = objects as T[]

    chrome.storage.sync.set(
      {
        [key]: [...chromeObjects, object],
      },
      () => {
        chrome.storage.sync.get(key, (items) => {
          console.log('after', items)
        })
      }
    )
  })
}

export const update = <T extends ChromeStorageObject>(
  key: string,
  id: string,
  object: T
): void => {
  chrome.storage.sync.get(key, (items) => {
    const objects = items[key]

    // 値のチェック
    if (!Array.isArray(objects)) {
      throw new Error(`${key} does not exists.`)
    }

    const chromeObjects = objects as T[]

    // idで検索
    const index = chromeObjects.findIndex((chromeObject) =>
      chromeObject.equals(id)
    )

    // idと一致するTourがあるか
    if (index == -1) {
      throw new Error(`${key} does not exists.`)
    }

    const updatedObject = { ...chromeObjects[index], ...object }

    chrome.storage.sync.set(
      {
        [key]: [
          ...chromeObjects.filter(
            (object: ChromeStorageObject) => !object.equals(id)
          ),
          updatedObject,
        ],
      },
      null
    )
  })
}

export const remove = <T extends ChromeStorageObject>(
  key: string,
  id: string
): void => {
  chrome.storage.sync.get(key, (items) => {
    const objects = items[key]

    // 値のチェック
    if (!Array.isArray(objects)) {
      throw new Error(`${key} does not exists.`)
    }

    const chromeObjects = objects as T[]

    // idで検索
    const index = chromeObjects.findIndex((chromeObject) =>
      chromeObject.equals(id)
    )

    if (index == -1) {
      throw new Error(`${key} does not exists.`)
    }

    chrome.storage.sync.set(
      {
        [key]: [
          ...chromeObjects.filter(
            (object: ChromeStorageObject) => !object.equals(id)
          ),
        ],
      },
      null
    )
  })
}
