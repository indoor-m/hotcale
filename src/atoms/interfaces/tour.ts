import { v4 as uuidV4 } from 'uuid'
import { ChromeStorageObject } from '../../utils/base/chromeStorage'

export enum LogType {
  START = 'START',
  STOP = 'STOP',
}

export interface Log {
  type: LogType
  url: string
  date: number
}

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
    this.logs = []
  }

  key: string
  id: string
  name: string
  urls: string[]
  scrollSpeed: number
  resumeInterval: number
  logs: Log[]
}
