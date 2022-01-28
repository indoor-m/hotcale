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

interface BaseProps {
  key?: string
  callback?: () => void
}

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

            if (callback) {
              callback()
            }
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
  //       callback()
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
  //       callback()
  //     })
  //   }),
  useSaveTour: () =>
    useRecoilCallback(({ set }) => ({ key = 'tours', tour, callback }) => {
      chromeStorageActions.findById<Tour>(key, tour.id, (findTour) => {
        const reload = () => {
          chromeStorageActions.getAll<Tour>(key, (tours) => {
            set(tourState, () => {
              return {
                tours: tours,
              }
            })

            callback()
          })
        }

        if (findTour == null) {
          chromeStorageActions.add<Tour>(key, tour, () => {
            reload()
          })
        } else {
          chromeStorageActions.update<Tour>(key, findTour.id, tour, () => {
            reload()
          })
        }
      })
    }),
  useDeleteTour: () =>
    useRecoilCallback(({ set }) => ({ key = 'tours', tourId, callback }) => {
      chromeStorageActions.remove<Tour>(key, tourId, () => {
        // TODO: reload と同じ処理
        chromeStorageActions.getAll<Tour>(key, (tours) =>
          set(tourState, () => {
            return {
              tours: tours,
            }
          })
        )

        callback()
      })
    }),
  useFindByTourId: () =>
    useRecoilCallback(() => ({ key = 'tours', tourId, callback }) => {
      chromeStorageActions.findById<Tour>(key, tourId, (tour) => {
        callback(tour)
      })
    }),
}
