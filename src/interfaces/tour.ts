export interface Tour {
  // uuid
  id: string

  // 保存名
  name: string

  // 巡回リンクリスト
  urls: string[]

  // スクロール速度(この巡回リストのみ)
  scrollSpeed?: number

  // 再開までの時間(秒)(この巡回リストのみ)
  resumeInterval?: number
}
