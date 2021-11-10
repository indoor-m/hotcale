# Hotcale

## 開発環境 - Environment
- Windows 10 Home
- chrome v95.0.4638.69
- node.js v14.18.1
- yarn v1.22.17

## スタートガイド - Getting Started

### 環境 - Prerequisites

- yarn がインストール済み

### インストール Installing

#### 1. yarnを実行

```
yarn
yarn dev
```

#### 2. Chromeの設定

[拡張機能](chrome://extensions/)にアクセス

"パッケージ化されていない拡張機能を読み込む" をクリック

"dist" フォルダを選択

## コマンドリスト

### package.json を読み込み、必要なパッケージをインストールする。

```
yarn
```

### ホットリロードする。

```
yarn dev
```

### distフォルダに展開する。
```
yarn build
```