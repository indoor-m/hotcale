import React, { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { tourActions, tourState } from '../atoms/tourActions'

interface Props {
  visible: boolean
}

export const SideBer: React.FC<Props> = ({ visible }) => {
  const { tourId } = useParams()

  const location = useLocation()
  const tours = useRecoilValue(tourState).tours

  const reloadTour = tourActions.useReloadTour()

  useEffect(() => {
    reloadTour()
  }, [])

  return (
    <div
      className={`${
        visible ? 'hidden' : 'block z-10 bg-white'
      } lg:inline-block lg:static absolute flex-none inset-y-0 w-[340px] lg:bg-gray-100 text-base`}
    >
      <img
        src="/assets/icons/hotcale_logo.png"
        alt="ホットケールのロゴ"
        width={200}
        className={'mx-auto py-5'}
      />
      <div className={'w-[200px] mx-auto'}>
        {/*新規作成ボタン*/}
        <div className={' pb-1'}>
          <Link
            className={`rounded-lg px-8 py-2 flex items-center ${
              location.pathname == '/tours'
                ? ' font-bold bg-subColor'
                : 'hover:bg-gray-200'
            }`}
            to={'/tours'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            新規作成
          </Link>
        </div>
        {/*サイドバーのメニュー*/}
        {/**完成イメージ
         *選択しているときはtext-mainColor、font-bold
         *他はデフォルト（text-gray-600）
         */}
        <div className={'pt-2'} />
        <div
          className={`${
            location.pathname == '/'
              ? ' font-bold bg-subColor'
              : 'hover:bg-gray-200'
          } px-8 py-2 rounded-lg text-center`}
        >
          <Link to={'/'} className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-[2px] mr-2 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <div
              className={`${
                location.pathname == '/'
                  ? ' font-bold bg-subColor'
                  : 'hover:bg-gray-200'
              }`}
            >
              全体設定
            </div>
          </Link>
        </div>

        <div className={'pb-4 border-b-2 mb-3'} />
        {tours.map((tour) => {
          const isSelected = tour.id == tourId

          return (
            <Link key={tour.id} to={`/tours/${tour.id}`}>
              <div
                className={`${
                  isSelected ? ' font-bold bg-subColor' : 'hover:bg-gray-200'
                } text-center px-8 py-2 mb-3 rounded-lg flex`}
              >
                {isSelected ? (
                  <img
                    src="/assets/icons/hotcake_select.svg"
                    alt="巡回リンク選択"
                    className="mr-3 h-4 w-4 mt-[5px]"
                  />
                ) : (
                  <img
                    src="/assets/icons/hotcake.svg"
                    alt="巡回リンク"
                    className="mr-3 h-4 w-4 mt-[5px]"
                  />
                )}

                <div className={`${isSelected && ' font-bold '} mb-[2px]`}>
                  {tour.name}
                </div>
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
