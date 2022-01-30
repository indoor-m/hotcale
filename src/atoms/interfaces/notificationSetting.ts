import { ChromeStorageObject } from '../../utils/base/chromeStorage'

export class NotificationSetting extends ChromeStorageObject {
  constructor(
    isSLackEnabled: boolean,
    slackWebhookUrl: string,
    isLineEnabled: boolean,
    lineToken: string
  ) {
    super()
    this.id = 'notification'
    this.key = 'notification'
    this.isSLackEnabled = isSLackEnabled
    this.slackWebhookUrl = slackWebhookUrl
    this.isLineEnabled = isLineEnabled
    this.lineToken = lineToken
  }

  id: string
  key: string
  isSLackEnabled: boolean
  slackWebhookUrl: string
  isLineEnabled: boolean
  lineToken: string
}
