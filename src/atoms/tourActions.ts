import { Tour } from './interfaces/tour'
import { atom, useRecoilCallback } from 'recoil'
import { chromeStorageActions } from '../utils/base/chromeStorage'

type TourState = {
  tours: Tour[]
}

export const tourState = atom<TourState>({
  key: 'TOUR_STATE',
  default: {
    tours: [],
  },
})

type TourActions = {
  useReloadTour: () => () => void
  useAddTour: () => (tour: Tour) => void
  useUpdateTour: () => (tour: Tour) => void
}

export const tourActions: TourActions = {
  useReloadTour: () =>
    useRecoilCallback(({ set }) => () => {
      chromeStorageActions.getAll<Tour>('tours', (tours) =>
        set(tourState, () => {
          return {
            tours: tours,
          }
        })
      )
    }),
  useAddTour: () =>
    useRecoilCallback(({ set }) => (tour: Tour) => {
      chromeStorageActions.add<Tour>('tours', tour, () => {
        // TODO: reload と同じ処理
        chromeStorageActions.getAll<Tour>('tours', (tours) =>
          set(tourState, () => {
            return {
              tours: tours,
            }
          })
        )
      })
    }),
  useUpdateTour: () =>
    useRecoilCallback(({ set }) => (tour: Tour) => {
      chromeStorageActions.update<Tour>('tours', tour.id, tour, () => {
        // TODO: reload と同じ処理
        chromeStorageActions.getAll<Tour>('tours', (tours) =>
          set(tourState, () => {
            return {
              tours: tours,
            }
          })
        )
      })
    }),
}
