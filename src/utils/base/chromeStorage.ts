export abstract class ChromeStorageObject {
  abstract key: string
  abstract id: string
}

type ChromeStorageActions = {
  getAll: <T extends ChromeStorageObject>(
    key: string,
    callback?: (objects: T[]) => void
  ) => void
  findById: <T extends ChromeStorageObject>(
    key: string,
    id: string,
    callback?: (object: T) => void
  ) => void
  add: <T extends ChromeStorageObject>(
    key: string,
    object: T,
    callback?: () => void
  ) => void
  update: <T extends ChromeStorageObject>(
    key: string,
    id: string,
    object: T,
    callback?: () => void
  ) => void
  // T を remove 内で利用しているため警告を出ない世に。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove: <T extends ChromeStorageObject>(
    key: string,
    id: string,
    callback?: () => void
  ) => void
}

export const chromeStorageActions: ChromeStorageActions = {
  getAll: <T extends ChromeStorageObject>(
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
  },

  findById: <T extends ChromeStorageObject>(
    key: string,
    id: string,
    callback?: (object: T) => void
  ): void => {
    chrome.storage.sync.get(key, (items) => {
      const objects = items[key]

      // 値のチェック
      if (!Array.isArray(objects)) {
        return null
      }

      const chromeObjects = objects as T[]

      // idで検索
      const index = chromeObjects.findIndex(
        (chromeObject) => chromeObject.id == id
      )

      if (index == -1) {
        throw new Error(`${key} does not exists.`)
      }

      callback(chromeObjects[index])
    })
  },
  add: <T extends ChromeStorageObject>(
    key: string,
    object: T,
    callback?: () => void
  ): void => {
    chrome.storage.sync.get(key, (items) => {
      const objects = items[key]

      const chromeObjects = objects as T[]

      chrome.storage.sync.set(
        {
          [key]: [...chromeObjects, object],
        },
        callback
      )
    })
  },

  update: <T extends ChromeStorageObject>(
    key: string,
    id: string,
    object: T,
    callback?: () => void
  ): void => {
    chrome.storage.sync.get(key, (items) => {
      const objects = items[key]

      // 値のチェック
      if (!Array.isArray(objects)) {
        throw new Error(`${key} does not exists.`)
      }

      const chromeObjects = objects as T[]

      // idで検索
      const index = chromeObjects.findIndex(
        (chromeObject) => chromeObject.id == id
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
              (object: ChromeStorageObject) => object.id != id
            ),
            updatedObject,
          ],
        },
        callback
      )
    })
  },
  remove: <T extends ChromeStorageObject>(
    key: string,
    id: string,
    callback?: () => void
  ): void => {
    chrome.storage.sync.get(key, (items) => {
      const objects = items[key]

      // 値のチェック
      if (!Array.isArray(objects)) {
        throw new Error(`${key} does not exists.`)
      }

      const chromeObjects = objects as T[]

      // idで検索
      const index = chromeObjects.findIndex(
        (chromeObject) => chromeObject.id == id
      )

      if (index == -1) {
        throw new Error(`${key} does not exists.`)
      }

      chrome.storage.sync.set(
        {
          [key]: [
            ...chromeObjects.filter(
              (object: ChromeStorageObject) => object.id != id
            ),
          ],
        },
        callback
      )
    })
  },
}
