import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  visible: boolean
}

export const SideBer: React.FC<Props> = ({ visible }) => (
  <div
    className={`${
      visible ? 'hidden' : 'block z-10 bg-white'
    } lg:inline-block lg:static absolute flex-none inset-y-0 w-[340px] lg:bg-gray-100 h-screen`}
  >
    <img
      src="/assets/icons/hotcale_logo.png"
      alt="ホットケールのロゴ"
      width={200}
      className={'mx-auto py-5'}
    />
    <div className={'w-[200px] mx-auto'}>
      {/*新規作成ボタン*/}
      <div className={'text-center pb-1 text-base'}>
        <Link
          className={'bg-mainColor text-[#FFFFFF] rounded-full px-8 py-2'}
          to={'/a'}
        >
          新規作成
        </Link>
      </div>
      {/*サイドバーのメニュー*/}
      {/**完成イメージ
       *選択しているときはtext-mainColor、font-bold
       *他はデフォルト（text-gray-600）
       */}
      <div className={'px-12 text-sm pt-7 pb-5 border-b-2 text-gray-600'}>
        <a href="">全体設定</a>
      </div>
      {/*ここから下はサンプル*/}
      {/**完成イメージ
       *選択しているときはtext-mainColor、font-bold
       *他はtext-gray-600
       */}
      <div
        className={
          'text-left font-bold mx-9 px-3 text-sm text-gray-600 mt-3 mb-5 py-2 bg-subColor rounded-lg'
        }
      >
        <a href="">indoor</a>
      </div>
      <div className={'text-left px-12 text-sm text-gray-600 my-7'}>
        <a href="">E展用</a>
      </div>
      <div className={'text-left px-12 text-sm text-gray-600 my-7'}>
        <a href="">ほっとけーる_イン...</a>
      </div>
    </div>
  </div>
)
