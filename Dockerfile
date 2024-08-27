# ベースイメージとしてNode.jsを使用
FROM node:16.15.0

# アプリケーションディレクトリを作成
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー（依存関係をインストールするため）
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# 開発サーバーを実行するためのポートを開放
EXPOSE 8080

# Vue.js開発サーバーを起動
CMD ["npm", "run", "serve"]
