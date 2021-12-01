import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ky from 'ky'
import { KyHeadersInit } from 'ky/distribution/types/options'

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
  <>
    <div>Index Page</div>
    <Link to={'/a'}>A Page</Link>
    <Link to={'/b'}>B Page</Link>
  </>
)

const PageA = () => (
  <>
    <div>A Page</div>
    <Link to={'/'}>戻る</Link>
    <Link to={'/b'}>B Page</Link>
  </>
)

const PageB = () => {
  // TODO(k-shir0): 設定画面にに入力したトークンを送信する
  const token = ''

  const notify = async () => {
    await ky
      .post(`${process.env.API_URL}`, {
        json: { token: token, message: 'test' },
      })
      .json()
  }

  return (
    <>
      <input type="button" value={'ボタン'} onClick={notify} />
      <div>B Page</div>
      <Link to={'/'}>戻る</Link>
      <Link to={'/a'}>A Page</Link>
    </>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
