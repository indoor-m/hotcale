import React, { useEffect, useState } from 'react'
import { SideBer } from '../components/sidber'
import { ToggleButton } from '../components/togglebutton'
import InputRange from '../components/input-range'
import Input from '../components/input'
import { tourActions } from '../atoms/tourActions'
import { Tour } from '../atoms/interfaces/tour'
import { Controller, useForm } from 'react-hook-form'
import { pageTransition } from '../utils/variants'
import { motion } from 'framer-motion'
import {
  setBackOnReachingBottom,
  setReloadOnBack,
} from '../utils/scrollControl'

type TourForm = {
  // id: string
  name: string
  urls: string[]
  scrollSpeed: number
  resumeInterval: number
}

const IndexPage: React.VFC = () => {
  const [visible, setVisible] = useState(true)
  const [backOnReachingBottomEnabled, setBackOnReachingBottomState] =
    useState(false)
  const [reloadOnBackEnabled, setReloadOnBackState] = useState(false)

  const [tour, setTour] = useState<Tour | null>(null)

  const findByTourId = tourActions.useFindByTourId()
  const saveTour = tourActions.useSaveTour()
  const reloadTour = tourActions.useReloadTour()

  const { setValue, control } = useForm<TourForm>({
    shouldUnregister: false,
  })

  useEffect(() => {
    findByTourId({
      key: 'general',
      tourId: 'general',
      callback: (tour) => {
        setValue('scrollSpeed', tour?.scrollSpeed ?? 50)
        setValue('resumeInterval', tour?.resumeInterval ?? 5)
        setTour(tour)
      },
    })

    // TODO: 処理を共通化した方が良い
    chrome.storage.sync.get(
      ['currentTabId', 'backOnReachingBottomEnabled', 'reloadOnBackEnabled'],
      ({ currentTabId, backOnReachingBottomEnabled, reloadOnBackEnabled }) => {
        // 開いているタブのURLを取得
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          // 最下部からスクロールを戻すかのstateを初期化
          setBackOnReachingBottomState(backOnReachingBottomEnabled)
          // 戻るときにリロードを行うかのstateを初期化
          setReloadOnBackState(reloadOnBackEnabled)

          console.log({
            currentTabId,
            backOnReachingBottomEnabled,
            reloadOnBackEnabled,
          })
          console.log({
            scrollEnabled: currentTabId == tabs[0].id,
            backOnReachingBottomEnabled,
            reloadOnBackEnabled,
          })
        })
      }
    )
  }, [])

  const onChangeScrollBar = (value: number) => {
    const newTour: Tour = { ...tour, id: 'general', scrollSpeed: value }

    saveTour({ key: 'general', tour: newTour })
  }

  const onChangeResumeInterval = (value: number) => {
    const newTour: Tour = { ...tour, id: 'general', resumeInterval: value }

    saveTour({ key: 'general', tour: newTour, callback: () => reloadTour() })
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
            className={'w-[615px] h-screen mx-auto pl-16 lg:mx-0 flex-grow'}
            onClick={() => setVisible(true)}
          >
            {/* 全体設定 */}
            <div className="font-bold text-2xl pt-7 pb-5">全体設定</div>

            {/* スクロールの設定テーブルを作成 */}
            <table
              className={
                'border-2 w-full text-base rounded-md space-0 border-separate mb-6 pb-5 shadow-md'
              }
            >
              <div className={'font-bold text-xl m-4'}>スクロール</div>
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
                    render={({ field }) => (
                      <InputRange
                        {...field}
                        onChange={(v) => {
                          const value = Number(v.currentTarget.value)

                          if (value > 0) {
                            onChangeScrollBar(value)
                          }

                          field.onChange(v)
                        }}
                      />
                    )}
                  />

                  {/* スクロールバーの値 */}
                  <div className={'pb-2 flex justify-between items-center'}>
                    <div>遅い</div>
                    <div>速い</div>
                  </div>
                </div>
              </div>

              <div
                className={'py-1 flex justify-between items-center m-5 mb-5'}
              >
                <div>再開までの時間</div>
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
                        textAlign="text-right"
                        {...field}
                        value={field.value?.toString() ?? ''}
                        onChange={(v) => {
                          const value = Number(v.currentTarget.value)

                          if (value > 0) {
                            onChangeResumeInterval(value)
                          }

                          field.onChange(v)
                        }}
                      />
                    )}
                  />
                  <div>秒</div>
                </div>
              </div>
              <div className={'py-1 flex justify-between items-center m-5'}>
                <div>最下部からスクロールを戻す</div>
                <ToggleButton
                  onChange={() => {
                    // stateを更新
                    setBackOnReachingBottomState((current) => !current)
                    if (backOnReachingBottomEnabled) {
                      // TODO: falseに変更される場合、`戻す時にリロードを行う`かのチェックボックスを無効にする
                    }

                    // storageを更新
                    setBackOnReachingBottom(!backOnReachingBottomEnabled)
                  }}
                  checked={backOnReachingBottomEnabled}
                  id="scroll_back_from_the_bottom"
                />
              </div>
              <div className={'py-1 flex justify-between items-center m-5'}>
                <div>戻す時にリロードを行う</div>
                <ToggleButton
                  onChange={() => {
                    // stateを更新
                    setReloadOnBackState((current) => !current)

                    // storageを更新
                    setReloadOnBack(!reloadOnBackEnabled)
                  }}
                  checked={reloadOnBackEnabled}
                  id="reload_when_reverting"
                />
              </div>
            </table>

            {/* 通知・API設定 */}
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
        </motion.div>
      </div>
    </>
  )
}

export default IndexPage
