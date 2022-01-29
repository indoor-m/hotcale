import { NotificationSetting } from './interfaces/notificationSetting'
import { BaseProps } from '../baseActions'
import { chromeStorageActions } from '../utils/base/chromeStorage'

type NotificationSettingActions = {
  useGetNotificationSetting: () => (props?: {
    key?: string
    notificationId?: string
    callback?: (notification: NotificationSetting | null) => void
  }) => void
  useSaveNotificationSetting: () => (
    props: BaseProps & { notification: NotificationSetting }
  ) => void
}

const defaultKey = 'notification'
const defaultId = 'notification'

export const notificationSettingActions: NotificationSettingActions = {
  useGetNotificationSetting:
    () =>
    ({ key = defaultKey, notificationId = defaultId, callback }) => {
      console.log(notificationId)

      chromeStorageActions.findById<NotificationSetting>(
        key,
        notificationId,
        (notification) => {
          callback ? callback(notification) : null
        }
      )
    },
  useSaveNotificationSetting:
    () =>
    ({ key = defaultKey, notification, callback }) => {
      chromeStorageActions.findById<NotificationSetting>(
        key,
        defaultKey,
        (findNotification) => {
          console.log('find', findNotification)

          if (findNotification == null) {
            chromeStorageActions.add<NotificationSetting>(
              key,
              notification,
              () => {
                callback ? callback() : null
              }
            )
          } else {
            chromeStorageActions.update<NotificationSetting>(
              key,
              findNotification.id,
              notification,
              () => {
                callback ? callback() : null
              }
            )
          }
        }
      )
    },
}
