import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'
import { SideBer } from './components/sidber'
import { Input } from './components/input'
import { Button } from './components/button'
import { ToggleButton } from './components/togglebutton'
import { Routes, Route, Link, HashRouter } from 'react-router-dom'
import ky from 'ky'

const Options = () => {
  return (
    // インデックスが /options.html なので basename が必要
    <HashRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path={'/a'} element={<PageA />} />
        <Route path={'b'} element={<PageB />} />
      </Routes>
    </HashRouter>
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
        <div className={`flex-grow inset-t-0 ${visible ? '' : 'contrast-50'}`}>
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
              <ToggleButton />
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
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    className={'w-full'}
                  />

                  {/* スクロールバーの値 */}
                  <div className={'pb-2 flex justify-between items-center'}>
                    <div>遅い</div>
                    <div>速い</div>
                  </div>
                </div>
              </div>
              <div className={'py-1 flex justify-between items-center m-5'}>
                <div>速度をデフォルトに設定</div>
                <ToggleButton />
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
                <Button text="編集" />
              </div>
              <div
                className={
                  'mx-5 py-1 justify-between items-center rounded-md flex'
                }
              >
                <Input
                  w="w-11/12"
                  placeholder="巡回したいリンクを入力してください"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-mainColor mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

const PageA = () => {
  const [visible, setVisible] = useState(true)

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
              onClick={() => setVisible(false)}
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
            className={`w-[615px] pl-16 h-screen mx-auto lg:pl-16 lg:mx-0 `}
            onClick={() => setVisible(true)}
          >
            {/* 設定 */}
            <div className="font-bold text-2xl pt-7 pb-5">設定</div>

            <div className="flex pb-6">
              <img
                src="/assets/icons/vector.png"
                alt="電源ボタン"
                className={'mr-3'}
              />
              {/* toggleボタン */}
              <ToggleButton />
            </div>

            {/*
          保存リストに表示する名前をつける
          */}

            <table
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
              }
            >
              <div className={'mx-5 mt-3'}>
                <div className={'pb-[4px]'}>
                  保存リストに表示する名前をつける
                </div>
                <div>
                  <Input w="w-full" />
                </div>
              </div>
            </table>

            {/*
          スクロールの設定テーブルを作成
          */}

            <table
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
              }
            >
              <div className={'font-bold text-xl m-4'}>スクロール</div>
              {/* 速度 */}
              <div className={'m-5 flex'}>
                <p className="w-1/12">速度</p>

                <div className={'mr-2 w-11/12'}>
                  {/* スクロールバー */}
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    className={'w-full'}
                  />

                  {/* スクロールバーの値 */}
                  <div className={'pb-2 flex justify-between items-center'}>
                    <div>遅い</div>
                    <div>速い</div>
                  </div>
                </div>
              </div>

              {/* 再開までの時間 */}
              <div
                className={'py-1 flex justify-between items-center m-5 mb-5'}
              >
                <div>再開までの時間</div>
                {/* 再開までの時間 */}
                <div className="flex mr-[6px]">
                  <Input w="w-14" background_color="bg-gray-200" />
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

                <Button text="編集" />
              </div>
              <div
                className={
                  'mx-5 py-1 justify-between items-center rounded-md flex'
                }
              >
                <Input
                  w="w-11/12"
                  placeholder="巡回したいリンクを入力してください"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-mainColor mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
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

            {/* 保存ボタン */}
            <div className={'flex flex-row-reverse'}>
              <Link
                className={
                  'bg-mainColor text-[#FFFFFF] rounded px-10 py-2 text-base'
                }
                to={'/'}
              >
                保存
              </Link>
            </div>

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
      <Link to={'/'}>戻る</Link>
      <Link to={'/a'}>A Page</Link>
    </>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
