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
    {/*サイドバー*/}
    <div className={'absolute inset-y-0 left-0 w-60 sidebar'}>
      {/*新規作成ボタン*/}
      <div className={'text-center mt-10 mb-6'}>
        <button className={'bg-orange rounded px-8 py-2'}>新規作成</button>
      </div>
      {/*サイドバーのメニュー*/}
      {/**完成イメージ
       *選択しているときはtxt-orange、font-bold
       *他はデフォルト（黒）
       */}
      <div className={'text-left px-10 text-base txt-orange font-bold py-2'}>
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
    <div className={'absolute inset-y-0 left-60 w-full'}></div>
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
