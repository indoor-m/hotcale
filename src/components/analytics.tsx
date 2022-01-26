import dayjs from 'dayjs'
import _ from 'lodash'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from 'highcharts'
import { Link } from 'react-router-dom'
import React from 'react'
import { route } from '../options'

enum LogType {
  START = 'START',
  STOP = 'STOP',
}

interface Log {
  type: LogType
  url: string
  date: number
}

export const AnalyticsPage: React.FC = () => {
  // 過去何時間分
  const pastTime = 24

  // 挿入する際にはこの形式で追加していけば良い
  // テストログ
  const logs: Log[] = [
    // case 2件カウント出来るか
    {
      type: LogType.START,
      url: 'http://localhost:8000',
      date: dayjs().toDate().getTime(),
    },
    {
      type: LogType.START,
      url: 'http://localhost:8000',
      date: dayjs().toDate().getTime(),
    },
    // case 時間帯ををずらしても計測できるか
    {
      type: LogType.START,
      url: 'http://localhost:8000',
      date: dayjs().subtract(1, 'hour').toDate().getTime(),
    },
    // case URIをずらしたら別で計測されるか
    {
      type: LogType.START,
      url: 'http://localhost:9000',
      date: dayjs().toDate().getTime(),
    },
    {
      type: LogType.START,
      url: 'http://localhost:9000',
      date: dayjs().toDate().getTime(),
    },
    {
      type: LogType.START,
      url: 'http://localhost:9000',
      date: dayjs().toDate().getTime(),
    },
    {
      type: LogType.START,
      url: 'http://localhost:9000',
      date: dayjs().toDate().getTime(),
    },
    {
      type: LogType.START,
      url: 'http://localhost:9000',
      date: dayjs().toDate().getTime(),
    },
  ]

  // LOG[] を入力 -> URLごとのデータ かつ 過去24時間を1時間ごと
  // に計測したデータに変換する
  const logToUrlAndTimes1Hours = (logs: Log[]) => {
    const urls = _.uniq(logs.map((log) => log.url))

    const urlAndTimes = urls.map((url) => {
      return {
        name: url,
        data: logs
          .filter((lo) => lo.url == url)
          .map((lo) => lo.date)
          .sort((a, b) => a - b),
      }
    })

    // 今日の日付
    const toDay = dayjs()
      .set('second', 0)
      .set('minutes', 0)
      .set('millisecond', 0)

    // URLごとのデータ かつ 過去24時間を1時間ごとに計測したデータ
    const urlAndTimes1Hours: {
      [key: string]: {
        url: string
        data: Map<string, number>
      }
    } = {}

    urlAndTimes.map((urlAndTime) => {
      const hourDate = new Map<string, number>()

      // 24時間前までのマップを生成
      for (let i = 0; i < pastTime; i++) {
        const hour = toDay.subtract(i, 'hour')

        hourDate.set(String(hour.toDate().getTime()), 0)
      }

      // どの時間帯にデータが入るかをカウント
      urlAndTime.data.map((time) => {
        const hour = dayjs(time)
          .set('second', 0)
          .set('minutes', 0)
          .set('millisecond', 0)

        if (hourDate.has(hour.toDate().getTime().toString())) {
          hourDate.set(
            hour.toDate().getTime().toString(),
            hourDate.get(String(hour.toDate().getTime())) + 1
          )
        }
      })

      urlAndTimes1Hours[urlAndTime.name] = {
        url: urlAndTime.name,
        data: hourDate,
      }
    })

    return urlAndTimes1Hours
  }

  //
  // 以下折れ線グラフの処理
  //

  const urlAndTimes1Hours = logToUrlAndTimes1Hours(logs)

  interface Series {
    name: string
    data: number[][]
  }

  const series: Series[] = []

  // URL ごとの処理
  Object.values(urlAndTimes1Hours).map((urlAndTimes1Hour) => {
    const data: number[][] = []

    // データに挿入
    urlAndTimes1Hour.data.forEach((k, v) => {
      data.push([Number(v), k])
    })

    series.push({
      name: urlAndTimes1Hour.url,
      data: data,
    })
  })

  // TODO: tooltipの日本語化
  // TODO: google analytics を参考にする
  const options = {
    title: {
      text: '',
    },
    series: series,
    xAxis: {
      type: 'datetime',
      ordinal: false,
      labels: {
        format: '{value:%d日%H時}',
      },
    },
    yAxis: {
      title: {
        text: '閲覧数',
      },
      labels: {
        format: '{value}',
      },
    },
  }

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  )
}
