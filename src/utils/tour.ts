import { Tour } from '../interfaces/tour'
import { v4 as uuidv4 } from 'uuid'

/**
 * Tourを作成
 *
 * @param name 保存名
 * @param urls 巡回リンクリスト
 * @param scrollSpeed スクロール速度(このTourのみ)
 * @param resumeInterval 再開までの時間(秒)(このTourのみ)
 */
export const registerTour = (
  name?: string,
  urls?: string[],
  scrollSpeed?: number,
  resumeInterval?: number
): void => {
  // 追加するTour
  const newTour: Tour = {
    id: uuidv4(),
    name,
    urls,
    scrollSpeed,
    resumeInterval,
  }

  // `tours`に追加
  chrome.storage.sync.get('tours', (tours) => {
    chrome.storage.sync.set(
      {
        tours: [Array.isArray(tours) ? tours : [], newTour],
      },
      null
    )
  })
}

/**
 * Tourの更新
 *
 * @param id 更新するTourのid
 * @param updateValues 更新値(指定されたものだけ更新)
 */
export const updateTour = (
  id: string,
  updateValues: {
    name?: string
    urls?: string[]
    scrollSpeed?: number
    resumeInterval?: number
  }
): void => {
  // 保存済みのTourを取得
  chrome.storage.sync.get('tours', ({ tours }) => {
    // 値のチェック
    if (!Array.isArray(tours)) {
      throw new Error('Tour does not exists.')
    }

    // idで検索
    const updateTour: Tour | undefined = tours.find(
      (tour: Tour) => tour.id == id
    )

    // idと一致するTourがあるか
    if (!updateTour) {
      throw new Error('Tour does not exists.')
    }

    // 更新済みのデータ
    const updatedTour = { ...updateTour, ...updateValues }

    // `tours`を更新
    chrome.storage.sync.set(
      {
        tours: [...tours.filter((tour: Tour) => tour.id != id), updatedTour],
      },
      null
    )
  })
}

/**
 * Tourの削除
 *
 * @param id 削除するTourのid
 */
export const deleteTour = (id: string): void => {
  // 保存済みのTourを取得
  chrome.storage.sync.get('tours', (tours) => {
    // 値のチェック
    if (!Array.isArray(tours)) {
      throw new Error('Tour does not exists.')
    }

    // idで検索
    const deleteTour: Tour | undefined = (tours as Tour[]).find(
      (tour) => tour.id == id
    )

    // idと一致するTourがあるか
    if (!deleteTour) {
      throw new Error('Tour does not exists.')
    }

    // `tours`を更新
    chrome.storage.sync.set(
      {
        tours: [...tours.filter((tour: Tour) => tour.id != id)],
      },
      null
    )
  })
}

/**
 * Tourを取得
 *
 * @param id Tourのid
 * @param callback Callback with `tour`.
 */
export const getTour = (
  id: string,
  callback?: (tour: Tour | undefined) => void
): void => {
  chrome.storage.sync.get('tours', ({ tours }) => {
    callback(tours)
  })
}

/**
 * Tourの一覧を取得
 *
 * @param callback Callback with `tours`.
 */
export const getTours = (callback?: (tours: Tour[]) => void): void => {
  chrome.storage.sync.get('tours', ({ tours }) => {
    callback(Array.isArray(tours) ? tours : [])
  })
}
