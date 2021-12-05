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
      <div className={'flex-none inset-y-0 w-60 sidebar'}>
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
      <div className={'flex-grow inset-y-0 w-100%'}>
        <div className={'w-700 h-screen mx-auto'}>
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
              'border-2 w-full text-lg rounded-lg space-0 border-separate pb-20'
            }
          >
            <div className={'font-bold text-2xl m-5'}>スクロール</div>
            {/* 速度 */}
            <div className={'justify-items-center m-5 flex'}>
              <p>速度</p>

              <div className={'mx-auto'}>
                {/* スクロールバー */}
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  className={'w-600'}
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
                  className={'bg-gray-300 w-16 rounded-lg mr-2'}
                />
                <div>秒</div>
              </div>
            </div>

            {/* 巡回リンク */}
            <div className={'py-1 justify-between items-centor m-5 mr-20'}>
              巡回リンク
            </div>
            <div className={'py-1 justify-between items-centor m-5 mr-20'}>
              <input
                type="text"
                placeholder="巡回したいリンクを入力してください"
                className={
                  'ml-14 w-600 border-2 rounded-lg placeholder-opacity-25'
                }
              />
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
