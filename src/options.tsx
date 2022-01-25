import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'
import { SideBer } from './components/sidber'
import Input from './components/input'
import { ToggleButton } from './components/togglebutton'
import { Routes, Route, Link, HashRouter } from 'react-router-dom'
import ky from 'ky'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import _ from 'lodash'
import dayjs from 'dayjs'
import TourPage from './pages/tourPage'
import { RecoilRoot } from 'recoil'
import InputRange from './components/input-range'
import CirclingLinks from './components/circling-links'
import { Button } from './components/button'

export const route = {
  Index: '/',
  A: '/a',
  B: '/b',
  Analytics: '/analytics',
  Tours: '/tours',
}

const Options = () => {
  return (
    // インデックスが /options.html なので basename が必要
    <RecoilRoot>
      <HashRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path={route.A} element={<TourPage />} />
          <Route path={route.B} element={<PageB />} />
          <Route path={route.Analytics} element={<AnalyticsPage />} />
          <Route path={`${route.Tours}`} element={<TourPage />} />
          <Route path={`${route.Tours}/:tourId`} element={<TourPage />} />
        </Routes>
      </HashRouter>
    </RecoilRoot>
  )
}

const Index = () => {
  const [visible, setVisible] = useState(true)

  //設定画面のコードはここに書く！
  return (
    <>
      <div className={`flex ${visible ? 'bg-white' : 'backdrop-contrast-50'}`}>
        <SideBer visible={visible} />

        {/*コンテンツ*/}
        <div
          className={`flex-grow overflow-auto ${visible ? '' : 'contrast-50'}`}
        >
          {/* 画面サイズが小さくなった時の三本線のアイコン表示 */}
          <div className="lg:hidden inline-block mr-10 absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[75px] w-[75px] bg-mainColor text-white p-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => setVisible(!visible)}
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {/* 画面サイズが小さくなった時の×のアイコン表示 */}
          <div className="lg:hidden inline-block absolute top-0 right-0">
            <img
              src="/assets/icons/cancel.png"
              alt="キャンセルボタン"
              className={`h-[45px] w-[45px] mt-3 mr-7 ${
                visible ? 'hidden' : 'block'
              }`}
              onClick={() => setVisible(true)}
            />
          </div>
          <div
            className={'w-[615px] h-screen mx-auto lg:pl-16 lg:mx-0 flex-grow'}
            onClick={() => setVisible(true)}
          >
            <div className="flex lg:pt-10 lg:pb-8 pt-7 pb-6">
              <img
                src="/assets/icons/vector.png"
                alt="電源ボタン"
                className={'mr-3'}
              />
              <ToggleButton id="vector" />
            </div>

            {/*
         スクロールの設定テーブルを作成
        */}
            <table
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
              }
            >
              <div className={'font-bold text-xl m-4'}>スクロール</div>
              <div className={'m-5 flex'}>
                <p className="w-1/12">速度</p>

                <div className={'mr-2 w-11/12'}>
                  {/* スクロールバー */}
                  <InputRange />

                  {/* スクロールバーの値 */}
                  <div className={'pb-2 flex justify-between items-center'}>
                    <div>遅い</div>
                    <div>速い</div>
                  </div>
                </div>
              </div>
              <div className={'py-1 flex justify-between items-center m-5'}>
                <div>速度をデフォルトに設定</div>
                <ToggleButton id="default_speed" />
              </div>
              <div
                className={'py-1 flex justify-between items-center m-5 mb-5'}
              >
                <div>再開までの時間</div>
                <div className="flex mr-[6px]">
                  <Input background_color="bg-gray-200" w="w-14" />
                  <div>秒</div>
                </div>
              </div>

              {/* 巡回リンク */}
              <div
                className={
                  'items-center justify-between mx-5 flex flex-row pb-[10px]'
                }
              >
                <div className={'flex'}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>巡回リンク</div>
                </div>
              </div>
              <div className={'mx-5 py-1'}>
                <CirclingLinks />
              </div>
            </table>

            {/*
          レポートテーブル
          */}

            <table
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-[20px] pb-5 shadow-md'
              }
            >
              <div className={'font-bold text-xl m-4'}>レポート</div>
              <div className={'mx-5 mt-1'}>
                <div className={'pb-[4px]'}>オートスクロール中断回数</div>
                {/* レポート表示部分 */}
                <div className={'w-auto h-[300px] border-2'} />
                {/* ヒートマップ表示ボタン、データ削除ボタン */}
                <div className={'flex my-5'}>
                  <Button p="p-2" text="ヒートマップ" />
                  <Button p="p-2" text="データ削除" />
                </div>
              </div>
            </table>

            {/*
            通知・API設定
            */}

            <table
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
              }
            >
              <div className={'font-bold text-xl m-5'}>通知・API設定</div>
              <div className={'py-1 flex justify-between items-center mx-6'}>
                <div>Slackと連携</div>
                <ToggleButton id="connect_to_slack" />
              </div>
              <div className={'mx-5 mt-2'}>
                <Input
                  w="w-full"
                  placeholder="連携するアカウントのトークンを入力してください"
                />
              </div>
              <div
                className={'py-1 flex justify-between items-center mx-5 mt-6'}
              >
                <div>LINEと連携</div>
                <ToggleButton id="connect_to_line" />
              </div>
              <div className={'mx-5 mt-3'}>
                <Input
                  w="w-full"
                  placeholder="連携するアカウントのトークンを入力してください"
                />
              </div>
            </table>
            {/* 下にスペース */}
            <div className={'h-[20px]'} />
          </div>
        </div>
      </div>
    </>
  )
}

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
