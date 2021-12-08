import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import '../static/style.css'

const Options = () => {
  return (
    // インデックスが /options.html なので basename が必要
    <BrowserRouter basename={'/options.html'}>
      <Routes>
        <Route index element={<Index />} />
        <Route path={'/a'} element={<PageA />} />
        <Route path={'b'} element={<PageB />} />
      </Routes>
    </BrowserRouter>
  )
}

const Index = () => (
  //設定画面のコードはここに書く！
  <>
    <div className={'flex h100'}>
      {/*サイドバー*/}
      <div className={'flex-none inset-y-0 w-[340px] sidebar'}>
        {/*新規作成ボタン*/}
        <div className={'text-center pt-10 pb-5 mx-10 border-b-2 text-base'}>
          <button className={'bg-orange rounded px-8 py-2'}>新規作成</button>
        </div>
        {/*サイドバーのメニュー*/}
        {/**完成イメージ
         *選択しているときはtxt-orange、font-bold
         *他はデフォルト（黒）
         */}
        <div className={'px-10 text-base txt-orange font-bold pt-4 pb-2'}>
          <a href="">全体設定</a>
        </div>
        <div className={'text-left px-10 text-base'}>
          <a href="">保存済み</a>
        </div>
        {/*ここから下はサンプル*/}
        {/**完成イメージ
         *選択しているときはtxt-orange、font-bold
         *他はtxt-gray
         */}
        <div className={'text-left px-10 text-sm txt-gray py-1'}>
          <a href="">indoor</a>
        </div>
        <div className={'text-left px-10 text-sm txt-gray py-1'}>
          <a href="">E展用</a>
        </div>
        <div className={'text-left px-10 text-sm txt-gray py-1'}>
          <a href="">ほっとけーる_インドアー</a>
        </div>
      </div>
      {/*コンテンツ*/}
      <div className={'flex-grow inset-y-0'}>
        <div className={'w-600 h-screen pl-16'}>
          {/* toggleボタン */}
          <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in pt-10 pb-8">
            <input
              type="checkbox"
              name="scroll"
              id="scroll"
              className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="scroll"
              className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
            ></label>
          </div>
          {/*
           スクロールの設定テーブルを作成
          */}
          <table
            className={
              'border-2 w-full text-base rounded-lg space-0 border-separate pb-20 shadow-lg'
            }
          >
            <div className={'font-bold text-xl m-5'}>スクロール</div>
            {/* 速度 */}
            <div className={'justify-items-center m-5 flex'}>
              <p>速度</p>

              <div className={'mx-auto w-5/6'}>
                {/* スクロールバー */}
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  className={'w-full'}
                />

                {/* スクロールバーの値 */}
                <div className={'pb-2 flex justify-between items-centor'}>
                  <div>遅い</div>
                  <div>速い</div>
                </div>
              </div>
            </div>

            {/* 速度をデフォルトに設定 */}
            <div className={'py-1 flex justify-between items-centor m-5 mr-20'}>
              <div>速度をデフォルトに設定</div>
              {/* toggleボタン */}
              <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
                <input
                  type="checkbox"
                  name="scroll"
                  id="scroll"
                  className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="scroll"
                  className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
                ></label>
              </div>
            </div>

            {/* 再開までの時間 */}
            <div className={'py-1 flex justify-between items-centor m-5 mr-20'}>
              <div>再開までの時間</div>
              {/* 再開までの時間 */}
              <div className="flex">
                <input
                  type="number"
                  className={'bg-gray-300 w-14 rounded-lg mr-2'}
                />
                <div>秒</div>
              </div>
            </div>

            {/* 巡回リンク */}
            <div className={'py-1 items-centor m-5 flex flex-row'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5"
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
            <div
              className={
                'mx-5 px-2 py-1 justify-between items-centor border-2 rounded-lg flex'
              }
            >
              <input
                type="text"
                placeholder="巡回したいリンクを入力してください"
                className={'w-5/6 placeholder-opacity-25'}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 txt-orange mt-0.5"
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

const PageA = () => (
  <>
    <div>A Page</div>
    <Link to={'/'}>戻る</Link>
    <Link to={'/b'}>B Page</Link>
  </>
)

const PageB = () => (
  <>
    <div>B Page</div>
    <Link to={'/'}>戻る</Link>
    <Link to={'/a'}>A Page</Link>
  </>
)

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
