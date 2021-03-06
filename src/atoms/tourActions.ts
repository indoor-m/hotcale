import { Tour } from './interfaces/tour'
import { atom, useRecoilCallback } from 'recoil'
import { chromeStorageActions } from '../utils/base/chromeStorage'
import { BaseProps } from '../baseActions'

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
  useReloadTour: () => (props?: BaseProps) => void
  // useAddTour: () => (props: BaseProps & { tour: Tour }) => void
  // useUpdateTour: () => (props: BaseProps & { tour: Tour }) => void
  useSaveTour: () => (props: BaseProps & { tour: Tour }) => void
  useDeleteTour: () => (props: BaseProps & { tourId: string }) => void
  useFindByTourId: () => (props: {
    key?: string
    tourId: string
    callback?: (tour: Tour | null) => void
  }) => void
}

export const tourActions: TourActions = {
  useReloadTour: () =>
    useRecoilCallback(
      ({ set }) =>
        ({ key, callback } = { key: 'tours', callback: null }) => {
          chromeStorageActions.getAll<Tour>(key, (tours) => {
            set(tourState, () => {
              return {
                tours: tours,
              }
            })

            callback ? callback() : null
          })
        }
    ),
  // TODO: もしかしたら今後使用するかもしれない
  // useAddTour: () =>
  //   useRecoilCallback(({ set }) => ({ key = 'tours', tour, callback }) => {
  //     chromeStorageActions.add<Tour>(key, tour, () => {
  //       // TODO: reload と同じ処理
  //       chromeStorageActions.getAll<Tour>(key, (tours) =>
  //         set(tourState, () => {
  //           return {
  //             tours: tours,
  //           }
  //         })
  //       )
  //
  //       callback ? callback() : null
  //     })
  //   }),
  // useUpdateTour: () =>
  //   useRecoilCallback(({ set }) => ({ key = 'tours', tour, callback }) => {
  //     chromeStorageActions.update<Tour>(key, tour, () => {
  //       // TODO: reload と同じ処理
  //       chromeStorageActions.getAll<Tour>(key, (tours) =>
  //         set(tourState, () => {
  //           return {
  //             tours: tours,
  //           }
  //         })
  //       )
  //
  //       callback ? callback() : null
  //     })
  //   }),
  useSaveTour: () =>
    useRecoilCallback(() => ({ key = 'tours', tour, callback }) => {
      chromeStorageActions.findById<Tour>(key, tour.id, (findTour) => {
        if (findTour == null) {
          chromeStorageActions.add<Tour>(key, tour, () => {
            callback ? callback() : null
          })
        } else {
          chromeStorageActions.update<Tour>(key, findTour.id, tour, () => {
            callback ? callback() : null
          })
        }
      })
    }),
  useDeleteTour: () =>
    useRecoilCallback(() => ({ key = 'tours', tourId, callback }) => {
      chromeStorageActions.remove<Tour>(key, tourId, () => {
        callback ? callback() : null
      })
    }),
  useFindByTourId: () =>
    useRecoilCallback(() => ({ key = 'tours', tourId, callback }) => {
      chromeStorageActions.findById<Tour>(key, tourId, (tour) => {
        callback ? callback(tour) : null
      })
    }),
}
