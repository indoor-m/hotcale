import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ky from 'ky'

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
  const tokenInputRef = React.createRef<HTMLInputElement>()
  const webhookUrlInputRef = React.createRef<HTMLInputElement>()

  const onPostSlackNotifyInformation = async () => {
    const webhookUrl = webhookUrlInputRef.current.value

    await ky
      .post(`${process.env.API_URL}/slack`, {
        json: { webhook_url: webhookUrl, text: 'test' },
      })
      .json()
  }

  const onPostLINENotifyInformation = async () => {
    const token = tokenInputRef.current.value

    await ky
      .post(`${process.env.API_URL}/line`, {
        json: { token: token, message: 'test' },
      })
      .json()
  }


  return (
    <>
      <div>
        <p>Slack</p>
        <input type='text' ref={webhookUrlInputRef} />
      </div>
      <input type='button' value={'ボタン'} onClick={onPostSlackNotifyInformation} />
      <div>
        <p>LINE</p>
        <input type='text' ref={tokenInputRef} />
      </div>
      <input type='button' value={'ボタン'} onClick={onPostLINENotifyInformation} />
      <div>B Page</div>
      <Link to={'/'}>戻る</Link>
      <Link to={'/a'}>A Page</Link>
    </>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
