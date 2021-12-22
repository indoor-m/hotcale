import React from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route, Link, HashRouter } from 'react-router-dom'
import ky from 'ky'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import _ from 'lodash'
import dayjs from 'dayjs'

export const route = {
  Index: '/',
  A: '/a',
  B: '/b',
  Analytics: '/analytics',
}

const Options = () => {
  return (
    // インデックスが /options.html なので basename が必要
    <HashRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path={route.A} element={<PageA />} />
        <Route path={route.B} element={<PageB />} />
        <Route path={route.Analytics} element={<AnalyticsPage />} />
      </Routes>
    </HashRouter>
  )
}

const Index = () => (
  <>
    <div>Index Page</div>
    <Link to={route.A}>A Page</Link>
    <Link to={route.B}>B Page</Link>
    <Link to={route.Analytics}>Analytics Page</Link>
  </>
)

const PageA = () => (
  <>
    <div>A Page</div>
    <Link to={route.Index}>戻る</Link>
    <Link to={route.B}>B Page</Link>
    <Link to={route.Analytics}>Analytics Page</Link>
  </>
)

const PageB = () => {
  const tokenInputRef = React.createRef<HTMLInputElement>()
  const webhookUrlInputRef = React.createRef<HTMLInputElement>()

  const onPostSlackNotifyInformation = async () => {
    const webhookUrl = webhookUrlInputRef.current.value

    await ky
      .post(`${process.env.API_URL}/slack`, {
        json: { webhook_url: webhookUrl, text: 'test' },
      })
      .json()
  }

  const onPostLINENotifyInformation = async () => {
    const token = tokenInputRef.current.value

    await ky
      .post(`${process.env.API_URL}/line`, {
        json: { token: token, message: 'test' },
      })
      .json()
  }

  return (
    <>
      <div>
        <p>Slack</p>
        <input type="text" ref={webhookUrlInputRef} />
      </div>
      <input
        type="button"
        value={'ボタン'}
        onClick={onPostSlackNotifyInformation}
      />
      <div>
        <p>LINE</p>
        <input type="text" ref={tokenInputRef} />
      </div>
      <input
        type="button"
        value={'ボタン'}
        onClick={onPostLINENotifyInformation}
      />
      <div>B Page</div>
      <Link to={route.Index}>戻る</Link>
      <Link to={route.A}>A Page</Link>
    </>
  )
}

enum LogType {
  START = 'START',
  STOP = 'STOP',
}

interface Log {
  type: LogType
  url: string
  date: number
}

const AnalyticsPage = () => {
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

  const series: any[] = []

  // URL ごとの処理
  Object.values(urlAndTimes1Hours).map((urlAndTimes1Hour) => {
    const data: any[] = []

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
      text: '時間帯毎のアクセス',
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
      <div>Analytics Page</div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <Link to={route.Index}>戻る</Link>
      <Link to={route.B}>B Page</Link>
    </>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
