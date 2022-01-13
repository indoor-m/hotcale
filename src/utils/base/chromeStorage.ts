abstract class ChromeStorageObject {
  abstract key: string
  abstract id: string

  equals(id: string): boolean {
    return this.id === id
  }
}

const getAll = <T extends ChromeStorageObject>(key: string): T[] => {
  chrome.storage.sync.get(key, (items) => {
    const objects = items[key]

    // 値のチェック
    if (!Array.isArray(objects)) {
      return null
    }

    return objects as T[]
  })

  return []
}

const findById = <T extends ChromeStorageObject>(
  key: string,
  id: string
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

    return chromeObject[index]
  })

  return null
}

const add = <T extends ChromeStorageObject>(key: string, object: T): void => {
  chrome.storage.sync.get(key, (items) => {
    chrome.storage.sync.set(
      {
        [key]: [...(Array.isArray(items) ? items : []), object],
      },
      null
    )
  })
}

const update = <T extends ChromeStorageObject>(
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

const remove = <T extends ChromeStorageObject>(
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
