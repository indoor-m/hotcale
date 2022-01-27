import { Log, Tour } from '../atoms/interfaces/tour'
import { chromeStorageActions } from './base/chromeStorage'

// ログを追加するための処理
export const addLog = (
  tourId: string,
  log: Log,
  callback?: () => void
): void => {
  chromeStorageActions.findById<Tour>('tours', tourId, (tour) => {
    const newTour: Tour = { ...tour, logs: [...tour.logs, log] }

    chromeStorageActions.update<Tour>('tours', tourId, newTour, callback)
  })
}
