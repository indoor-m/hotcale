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
  useReloadTour: () => (callback?: () => void) => void
  useAddTour: () => (tour: Tour, callback?: () => void) => void
  useUpdateTour: () => (tour: Tour, callback?: () => void) => void
  useDeleteTour: () => (tourId: string, callback?: () => void) => void
}

export const tourActions: TourActions = {
  useReloadTour: () =>
    useRecoilCallback(({ set }) => (callback?: () => void) => {
      chromeStorageActions.getAll<Tour>('tours', (tours) => {
        set(tourState, () => {
          return {
            tours: tours,
          }
        })

        callback()
      })
    }),
  useAddTour: () =>
    useRecoilCallback(({ set }) => (tour: Tour, callback?: () => void) => {
      chromeStorageActions.add<Tour>('tours', tour, () => {
        // TODO: reload と同じ処理
        chromeStorageActions.getAll<Tour>('tours', (tours) =>
          set(tourState, () => {
            return {
              tours: tours,
            }
          })
        )

        callback()
      })
    }),
  useUpdateTour: () =>
    useRecoilCallback(({ set }) => (tour: Tour, callback?: () => void) => {
      chromeStorageActions.update<Tour>('tours', tour.id, tour, () => {
        // TODO: reload と同じ処理
        chromeStorageActions.getAll<Tour>('tours', (tours) =>
          set(tourState, () => {
            return {
              tours: tours,
            }
          })
        )

        callback()
      })
    }),
  useDeleteTour: () =>
    useRecoilCallback(({ set }) => (tourId: string, callback?: () => void) => {
      chromeStorageActions.remove<Tour>('tours', tourId, () => {
        // TODO: reload と同じ処理
        chromeStorageActions.getAll<Tour>('tours', (tours) =>
          set(tourState, () => {
            return {
              tours: tours,
            }
          })
        )

        callback()
      })
    }),
}
