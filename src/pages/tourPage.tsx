import { useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Tour } from '../atoms/interfaces/tour'
import { chromeStorageActions } from '../utils/base/chromeStorage'
import { SideBer } from '../components/sidber'
import { ToggleButton } from '../components/togglebutton'
import { Button } from '../components/button'
import { useForm, Controller } from 'react-hook-form'
import Input from '../components/input'
import InputRange from '../components/input-range'
import { tourActions } from '../atoms/tourActions'
import CirclingLinks from '../components/circling-links'
import { motion } from 'framer-motion'
import { pageTransition } from '../utils/variants'

type TourForm = {
  // id: string
  name: string
  urls: string[]
  scrollSpeed: number
  resumeInterval: number
}

const TourPage: React.VFC = () => {
  const { tourId } = useParams()

  const [tour, setTour] = useState<Tour | null>(null)
  const [visible, setVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const updateTour = tourActions.useUpdateTour()
  const addTour = tourActions.useAddTour()

  const { handleSubmit, setValue, control } = useForm<TourForm>({
    shouldUnregister: true,
  })

  useEffect(() => {
    setIsLoading(true)

    // TODO: どこかにまとめる
    chromeStorageActions.findById<Tour>('tours', tourId, (tour) => {
      setValue('name', tour?.name ?? '')
      setValue('resumeInterval', tour?.resumeInterval ?? 0)
      setValue('scrollSpeed', tour?.scrollSpeed ?? 0)
      setValue('urls', tour?.urls ?? [])
      setTour(tour)
      setIsLoading(false)
    })
  }, [tourId])

  // TODO: ツアー ID が存在しないときの処理
  if (isLoading) {
    return <div>Tour is Empty</div>
  }

  const onSave = handleSubmit((data) => {
    if (tour == null) {
      const newTour = new Tour(
        data.name,
        data.urls,
        data.scrollSpeed,
        data.resumeInterval
      )

      addTour(newTour)

      navigate(`/tours/${newTour.id}`)
    }

    // TODO: debug
    console.log(data)

    const newTour: Tour = { ...tour, ...data }

    updateTour(newTour)
  })

  return (
    <>
      <div className={`flex ${visible ? 'bg-white' : 'backdrop-contrast-50'}`}>
        <SideBer visible={visible} />

        {/*コンテンツ*/}
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={pageTransition}
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
                  <Controller
                    name={'name'}
                    rules={{
                      required: true,
                      validate: (value) => value.length > 0,
                    }}
                    control={control}
                    render={({ field }) => <Input w="w-full" {...field} />}
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
              <div className={'font-bold text-xl m-4'}>スクロール</div>
              {/* 速度 */}
              <div className={'m-5 flex'}>
                <p className="w-1/12">速度</p>

                <div className={'mr-2 w-11/12'}>
                  {/* スクロールバー */}
                  <Controller
                    name={'scrollSpeed'}
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) => value >= 0,
                    }}
                    defaultValue={0}
                    render={({ field }) => <InputRange {...field} />}
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
                  <Controller
                    name={'resumeInterval'}
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) => value >= 0,
                    }}
                    render={({ field }) => (
                      <Input
                        w="w-14"
                        {...field}
                        value={field.value?.toString() ?? ''}
                      />
                    )}
                  />
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
                <Controller
                  name={'urls'}
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <CirclingLinks
                      setValue={(values) => setValue('urls', values)}
                      {...field}
                    />
                  )}
                />
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
            <div className={'flex flex-row-reverse '}>
              <div
                onClick={onSave}
                className={
                  'bg-mainColor text-[#FFFFFF] rounded px-10 py-2 text-base mou'
                }
              >
                保存
              </div>
            </div>

            {/* 下にスペース */}
            <div className={'h-[20px]'} />
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default TourPage
