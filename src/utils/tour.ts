import { v4 as uuidV4 } from 'uuid'
import { ChromeStorageObject } from './base/chromeStorage'

export class Tour extends ChromeStorageObject {
  constructor(
    name: string,
    urls: string[],
    scrollSpeed: number,
    resumeInterval: number
  ) {
    super()
    this.key = 'tours'
    this.id = uuidV4()
    this.name = name
    this.urls = urls
    this.scrollSpeed = scrollSpeed
    this.resumeInterval = resumeInterval
  }

  key: string
  id: string
  name: string
  urls: string[]
  scrollSpeed: number
  resumeInterval: number
}
