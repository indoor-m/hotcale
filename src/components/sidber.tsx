import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { tourActions, tourState } from '../atoms/tourActions'

interface Props {
  visible: boolean
}

export const SideBer: React.FC<Props> = ({ visible }) => {
  const { tourId } = useParams()
  const tours = useRecoilValue(tourState).tours

  const reloadTour = tourActions.useReloadTour()

  useEffect(() => {
    reloadTour()
  }, [])

  return (
    <div
      className={`${
        visible ? 'hidden' : 'block z-10 bg-white'
      } lg:inline-block lg:static absolute flex-none inset-y-0 w-[340px] lg:bg-gray-100`}
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
            to={'/tours'}
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
        {tours.map((tour) => {
          const isSelected = tour.id == tourId

          return (
            <Link key={tour.id} to={`/tours/${tour.id}`}>
              <div
                className={`${isSelected && ' font-bold bg-subColor'} ${
                  !isSelected && 'hover:bg-gray-200'
                } ml-7 mr-13 px-3 text-sm text-gray-600 mt-3 mb-5 py-2 rounded-lg`}
              >
                <a href="">{tour.name}</a>
              </div>
            </Link>
          )
        })}

        {/*<div className={'text-left px-12 text-sm text-gray-600 my-7'}>*/}
        {/*  <a href="">E展用</a>*/}
        {/*</div>*/}
        {/*<div className={'text-left px-12 text-sm text-gray-600 my-7'}>*/}
        {/*  <a href="">ほっとけーる_イン...</a>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}
