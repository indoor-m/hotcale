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
      <SideBer />

      {/*コンテンツ*/}
      <div className={'flex-grow inset-y-0'}>
        <div className={'w-[615px] h-screen pl-16'}>
          <div className="flex pt-10 pb-8">
            <img src="/assets/icons/vector.png" className={'mr-3'} />
            {/* toggleボタン */}
            <div className="relative inline-block w-9 align-middle select-none transition duration-200 ease-in">
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

          {/*
           スクロールの設定テーブルを作成
          */}
          <table
            className={
              'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
            }
          >
            <div className={'font-bold text-xl ml-5'}>スクロール</div>
            {/* 速度 */}
            <div className={'justify-items-center m-5 flex'}>
              <p>速度</p>

              <div className={'mx-auto w-[445px]'}>
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
            <div className={'py-1 flex justify-between items-centor m-5'}>
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
            <div className={'py-1 flex justify-between items-centor m-5 mb-5'}>
              <div>再開までの時間</div>
              {/* 再開までの時間 */}
              <div className="flex mr-[6px]">
                <input
                  type="text"
                  className={
                    'bg-gray-200 w-14 rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 border-2'
                  }
                />
                <div>秒</div>
              </div>
            </div>

            {/* 巡回リンク */}
            <div
              className={
                'items-centor justify-between mx-5 flex flex-row pb-[10px]'
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

              <button
                className={
                  'bg-captionColor rounded-md text-white px-7 mr-[4px]'
                }
              >
                編集
              </button>
            </div>
            <div
              className={
                'ml-5 px-2 py-1 justify-between items-centor border-2 rounded-md flex w-[500px]'
              }
            >
              <input
                type="text"
                placeholder="巡回したいリンクを入力してください"
                className={'placeholder-opacity-25 w-5/6'}
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

const PageA = () => (
  <>
    <div className={'flex'}>
      <SideBer />
      {/*
        コンテンツ
      */}

      <div className={'flex-grow overflow-auto'}>
        <div className={'w-[615px] pl-16 h-screen'}>
          {/* 設定 */}
          <div className="font-bold text-2xl pt-7 pb-5">設定</div>

          <div className="flex pb-6">
            <img src="/assets/icons/vector.png" className={'mr-3'} />
            {/* toggleボタン */}
            <div className="relative inline-block w-9 align-middle select-none transition duration-200 ease-in">
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

          {/*
          保存リストに表示する名前をつける
          */}

          <table
            className={
              'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
            }
          >
            <div className={'mx-5 mt-1'}>
              <div className={'pb-[4px]'}>保存リストに表示する名前をつける</div>
              <div>
                <input
                  type="text"
                  className={'w-[500px] border-2 rounded-md'}
                />
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
            <div className={'font-bold text-xl m-5'}>スクロール</div>
            {/* 速度 */}
            <div className={'justify-items-center flex ml-5'}>
              <p>速度</p>

              <div className={'mx-auto w-[445px]'}>
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

            {/* 再開までの時間 */}
            <div className={'py-1 flex justify-between items-centor m-5 mb-5'}>
              <div>再開までの時間</div>
              {/* 再開までの時間 */}
              <div className="flex mr-[6px]">
                <input
                  type="text"
                  className={
                    'bg-gray-200 w-14 rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 border-2'
                  }
                />
                <div>秒</div>
              </div>
            </div>

            {/* 巡回リンク */}
            <div
              className={
                'items-centor justify-between mx-5 flex flex-row pb-[10px]'
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

              <button
                className={
                  'bg-captionColor rounded-md text-white px-7 mr-[4px]'
                }
              >
                編集
              </button>
            </div>
            <div
              className={
                'ml-5 px-2 py-1 justify-between items-centor border-2 rounded-md flex w-[500px]'
              }
            >
              <input
                type="text"
                placeholder="巡回したいリンクを入力してください"
                className={'placeholder-opacity-25 w-5/6'}
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
            <div className={'font-bold text-xl m-5'}>レポート</div>
            <div className={'mx-5 mt-1'}>
              <div className={'pb-[4px]'}>オートスクロール中断回数</div>
              {/* レポート表示部分 */}
              <div className={'w-[500px] h-[300px] border-2'}></div>
              {/* ヒートマップ表示ボタン、データ削除ボタン */}
              <div className={'flex my-5'}>
                <button
                  className={
                    'bg-captionColor rounded-md text-white mr-3 p-2 w-36'
                  }
                >
                  ヒートマップ表示
                </button>
                <button
                  className={'bg-captionColor rounded-md text-white p-2 w-36'}
                >
                  データ削除
                </button>
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
          <div className={'h-[20px]'}></div>
        </div>
      </div>
    </div>
  </>
)

const PageB = () => (
  <>
    <div>B Page</div>
    <Link to={'/'}>戻る</Link>
    <Link to={'/a'}>A Page</Link>
  </>
)

const SideBer = () => (
  <div className={'flex-none inset-y-0 w-[340px] bg-gray-100 h-screen'}>
    <img
      src="/assets/icons/hotcale_logo.png"
      width={170}
      className={'mx-auto py-5'}
    />
    <div className={'w-[200px] mx-auto'}>
      {/*新規作成ボタン*/}
      <div className={'text-center pb-1 text-base'}>
        <Link
          className={'bg-mainColor text-[#FFFFFF] rounded px-8 py-2'}
          to={'/a'}
        >
          新規作成
        </Link>
      </div>
      {/*サイドバーのメニュー*/}
      {/**完成イメージ
       *選択しているときはtext-mainColor、font-bold
       *他はデフォルト（黒）
       */}
      <div className={'px-10 text-base text-mainColor font-bold pt-4 pb-2'}>
        <a href="">全体設定</a>
      </div>
      <div className={'text-left px-10 text-base'}>
        <a href="">保存済み</a>
      </div>
      {/*ここから下はサンプル*/}
      {/**完成イメージ
       *選択しているときはtext-mainColor、font-bold
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
  </div>
)

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
