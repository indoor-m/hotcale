// import id = chrome.runtime.id
//
// abstract class Equtable {
//   protected abstract readonly props: () => any[]
//
//   equals(e: Equtable): boolean {
//     const propsA = this.props()
//     const propsB = e.props()
//
//     const length = propsA.length
//
//     for (let i = 0; i < length; i++) {
//       if (propsA[i] != propsB[i]) {
//         return false
//       }
//     }
//
//     return true
//   }
// }
//
// class Tour extends Equtable {
//   constructor(test: string, place: string) {
//     super()
//     this.test = test
//     this.place = place
//   }
//
//   test: string
//   place: string
//
//   protected readonly props: () => any[] = () => [this.test, this.place]
// }
//
// class A extends Equtable {
//   id: number
//
//   constructor(id: number) {
//     super()
//     this.id = id
//   }
//
//   protected readonly props: () => any[] = () => [this.id]
// }
//
// const test = new Tour('test', 'basyo')
// const test2 = new Tour('test', 'basyo')
//
// console.log('Tour', test.equals(test2))
//
// const a1 = new A(0)
// const a2 = new A(1)
//
// console.log('A', a1.equals(a2))
//
// class Storage2<T extends Equtable> {
//   constructor(testArray: T[]) {
//     this.testArray = testArray
//   }
//
//   testArray: T[]
//
//   delete(B: T) {
//     const index = this.testArray.findIndex((test) => test.equals(B))
//
//     this.testArray = this.testArray.splice(index, 1)
//   }
// }
//
// const testClient = new Storage2<Tour>([])
//
// const test3 = new Tour('test', 'basyo')
//
// testClient.delete(test3)

abstract class ChromeStorageObject {
  abstract key: string
  abstract id: string

  equals(id: string): boolean {
    return this.id === id
  }
}

class Tour extends ChromeStorageObject {
  key: string
  id: string

  constructor(id: string) {
    super()
    this.key = 'tours'
    this.id = id
  }
}

// TODO: メッセージの修正
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
      throw new Error('Tour does not exists.')
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
      throw new Error('Tour does not exists.')
    }

    const chromeObjects = objects as T[]

    // idで検索
    const index = chromeObjects.findIndex((chromeObject) =>
      chromeObject.equals(id)
    )

    // idと一致するTourがあるか
    if (index == -1) {
      throw new Error('Tour does not exists.')
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
      throw new Error('Tour does not exists.')
    }

    const chromeObjects = objects as T[]

    // idで検索
    const index = chromeObjects.findIndex((chromeObject) =>
      chromeObject.equals(id)
    )

    if (index == -1) {
      throw new Error('Tour does not exists.')
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
