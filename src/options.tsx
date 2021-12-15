import React from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route, Link, HashRouter } from 'react-router-dom'
import ky from 'ky'

export const route = {
  Index: '/',
  A: '/a',
  B: '/b',
  Analytics: '/analytics',
}

const Options = () => {
  return (
    // インデックスが /options.html なので basename が必要
    <HashRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path={route.A} element={<PageA />} />
        <Route path={route.B} element={<PageB />} />
        <Route path={route.Analytics} element={<AnalyticsPage />} />
      </Routes>
    </HashRouter>
  )
}

const Index = () => (
  <>
    <div>Index Page</div>
    <Link to={route.A}>A Page</Link>
    <Link to={route.B}>B Page</Link>
    <Link to={route.Analytics}>Analytics Page</Link>
  </>
)

const PageA = () => (
  <>
    <div>A Page</div>
    <Link to={route.Index}>戻る</Link>
    <Link to={route.B}>B Page</Link>
    <Link to={route.Analytics}>Analytics Page</Link>
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
        <input type="text" ref={webhookUrlInputRef} />
      </div>
      <input
        type="button"
        value={'ボタン'}
        onClick={onPostSlackNotifyInformation}
      />
      <div>
        <p>LINE</p>
        <input type="text" ref={tokenInputRef} />
      </div>
      <input
        type="button"
        value={'ボタン'}
        onClick={onPostLINENotifyInformation}
      />
      <div>B Page</div>
      <Link to={route.Index}>戻る</Link>
      <Link to={route.A}>A Page</Link>
    </>
  )
}

const AnalyticsPage = () => (
  <>
    <div>Analytics Page</div>
    <Link to={route.Index}>戻る</Link>
    <Link to={route.B}>B Page</Link>
  </>
)

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
