import { useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Tour } from '../atoms/interfaces/tour'
import { SideBer } from '../components/sidber'
import { Button } from '../components/button'
import { useForm, Controller } from 'react-hook-form'
import Input from '../components/input'
import InputRange from '../components/input-range'
import { tourActions } from '../atoms/tourActions'
import CirclingLinks from '../components/circling-links'
import { motion } from 'framer-motion'
import { pageTransition } from '../utils/variants'
import { AnalyticsPage } from '../components/analytics'
import { startSavedTour } from '../utils/scrollControl'

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
  // TODO: その場しのぎ感のあるコードなのであとで処理をまとめる
  const [isEditCirclingLinks, setIsEditCirclingLinks] = useState(false)

  const navigate = useNavigate()

  const findByTourId = tourActions.useFindByTourId()
  const saveTour = tourActions.useSaveTour()
  const reloadTour = tourActions.useReloadTour()
  const deleteTour = tourActions.useDeleteTour()

  const { handleSubmit, setValue, control, formState, reset } =
    useForm<TourForm>({
      shouldUnregister: false,
    })

  const isDirty = formState.isDirty

  useEffect(() => {
    setIsLoading(true)

    findByTourId({
      tourId: tourId,
      callback: (tour) => {
        setValue('name', tour?.name ?? '')
        setValue('resumeInterval', tour?.resumeInterval ?? 0)
        setValue('scrollSpeed', tour?.scrollSpeed ?? 0)
        if (!tour) {
          // 新規作成時のデフォルト値
          findByTourId({
            key: 'general',
            tourId: 'general',
            callback: (general) => {
              setValue('scrollSpeed', general?.scrollSpeed ?? 50)
              setValue('resumeInterval', general?.resumeInterval ?? 5)
            },
          })
        }
        setValue('urls', tour?.urls ?? [])
        setTour(tour)
        setIsLoading(false)
      },
    })
  }, [tourId])

  // TODO: ツアー ID が存在しないときの処理
  if (isLoading) {
    return <div>{/* Tour is Empty */}</div>
  }

  // ツアーが存在しているかのフラグ
  const isEditing = tour != null

  const title = isEditing ? '設定' : '新規作成'

  const onSave = handleSubmit((data) => {
    // フォームの編集状態を解除
    setIsEditCirclingLinks(false)
    reset(data)

    const newTour =
      tour == null
        ? new Tour(data.name, data.urls, data.scrollSpeed, data.resumeInterval)
        : { ...tour, ...data }

    saveTour({
      tour: newTour,
      callback: () => {
        reloadTour()
        navigate(`/tours/${newTour.id}`)
      },
    })
  })

  const onDelete = () => {
    deleteTour({
      tourId: tourId,
      callback: () => {
        reloadTour()
        navigate(`/`)
      },
    })
  }

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
              src="/assets/icons/cancel.svg"
              alt="キャンセルボタン"
              className={`h-[45px] w-[45px] mt-3 mr-7 ${
                visible ? 'hidden' : 'block'
              }`}
              onClick={() => setVisible(true)}
            />
          </div>
          <div
            className={`w-[615px] h-screen mx-auto pl-16 lg:mx-0 `}
            onClick={() => setVisible(true)}
          >
            <div
              className={`flex pt-7 pb-5 ${
                tour != null ? 'justify-between ' : ''
              }`}
            >
              {/* 設定 */}
              <div className="font-bold text-2xl">{title}</div>
              <div className="flex">
                {/* 再生ボタン */}
                {tour != null && (
                  <Button
                    text="再生"
                    onClick={
                      !isEditCirclingLinks && !isDirty
                        ? () => startSavedTour(tourId)
                        : null
                    }
                    background_color={'bg-mainColor'}
                    p="p-2"
                  />
                )}
              </div>
            </div>

            {/* 保存リストに表示する名前をつける */}
            <div
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
            </div>

            {/* スクロールの設定テーブルを作成 */}
            <div
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
              }
            >
              <div className={'font-bold text-xl m-4'}>スクロール</div>

              {/* 速度 */}
              <div className={'m-5 flex'}>
                <p className="w-1/12 pt-[6px]">速度</p>
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
                <div className="flex mr-[6px] items-center">
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
                        textAlign="text-right"
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
                <div>巡回リンク</div>
              </div>
              <div className={'mx-5 py-1'}>
                <Controller
                  name={'urls'}
                  control={control}
                  render={({ field }) => {
                    return (
                      <CirclingLinks
                        setValue={(values) => {
                          setIsEditCirclingLinks(true)
                          setValue('urls', values)
                        }}
                        {...field}
                      />
                    )
                  }}
                />
              </div>
            </div>

            {/* レポートテーブル */}
            {tour != null && (
              <div
                className={
                  'border-2 w-full rounded-md space-0 border-separate mb-[20px] pb-5 shadow-md'
                }
              >
                <div className={'font-bold text-xl m-4'}>レポート</div>
                <div className={'mx-5 mt-1'}>
                  <div className={'pb-[4px] text-base'}>
                    オートスクロール中断回数
                  </div>

                  {/* レポート表示部分 */}
                  <AnalyticsPage logs={tour?.logs} />

                  {/* ヒートマップ表示ボタン、データ削除ボタン */}
                  <div className={'flex my-5'}>
                    {/* 実装不可 */}
                    {/* <Button p="p-2" text="ヒートマップ" /> */}
                    {/*<Button p="p-2" text="データ削除" />*/}
                  </div>
                </div>
              </div>
            )}

            <div className={'flex flex-row-reverse '}>
              <div className="ml-3">
                <Button
                  text="保存"
                  onClick={
                    !isEditing || isEditCirclingLinks || isDirty ? onSave : null
                  }
                  background_color={'bg-mainColor'}
                  p="p-2"
                />
              </div>
              {tour != null && (
                <Button
                  text="削除"
                  onClick={onDelete}
                  background_color="bg-[#D64450]"
                  p="p-2"
                  bold={true}
                />
              )}
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
