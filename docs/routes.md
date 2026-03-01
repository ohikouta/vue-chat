# Routing Specification

このドキュメントは、ルーティング仕様をまとめています。 
画面遷移の俯瞰は `docs/view-wireframes.drawio` の `FLOW_Navigation` を参照し、最終的な実装判断は本書を基準にします。

## 運用ルール

1. ルーティング変更時は、`src/router/index.js` と本書を同時更新する。
2. 画面導線レビューは drawio、実装仕様レビューは本書で行う。
3. `As-Is` は現状把握用、`To-Be` は次の実装ターゲットとして管理する。

## As-Is（現状実装）

参照: [src/router/index.js](/Users/koutaohi/projects/vue-chat/src/router/index.js)

| Path | Route Name | Component | Auth Required | Params | Notes |
|---|---|---|---|---|---|
| `/` | `Home` | `HomeView` | No | - | 未ログイン時はHero、ログイン時はUserListを表示 |
| `/register` | - | `RegisterComponent` | No | - | ログイン済みは`/`へリダイレクト |
| `/login` | - | `LoginComponent` | No | - | ログイン済みは`/`へリダイレクト |
| `/profile` | - | `ProfileComponent` | Yes | - | 未ログイン時は`/login`へ |
| `/users` | `UserList` | `UserList` | Yes | - | 未ログイン時は`/login`へ |
| `/chat/:userId` | `PrivateChat` | `PrivateChatView` | Yes | `userId` | 未ログイン時は`/login`へ |

## To-Be（設計反映後）

`FLOW_Navigation` と `SCREEN_*` 設計を踏まえたターゲット仕様。

| Path | Route Name (proposal) | Component (proposal) | Auth Required | Params | Notes |
|---|---|---|---|---|---|
| `/` | `Home` | `HomeView` | No | - | `SCREEN_Home` |
| `/login` | `Login` | `LoginComponent` | No | - | `SCREEN_Login` |
| `/register` | `Register` | `RegisterComponent` | No | - | `SCREEN_Register` |
| `/users` | `Users` | `UserList` | Yes | - | `SCREEN_Users` |
| `/chat/:userId` | `PrivateChat` | `PrivateChatView` | Yes | `userId` | `SCREEN_PrivateChat`（1:1 DM専用） |
| `/profile` | `Profile` | `ProfileComponent` | Yes | - | `SCREEN_Profile` |
| `/timeline` | `Timeline` | `TimelineView` | Yes | - | `SCREEN_Timeline`（新規） |
| `/timeline/:postId/thread` | `ThreadDetail` | `ThreadDetailView` | Yes | `postId` | `SCREEN_ThreadDetail`（新規） |

## Guard仕様

### 現状

- 認証必須: `/users`, `/profile`, `/chat/*`
- 未認証で認証必須ページへアクセス: `/login`へリダイレクト
- 認証済みで`/login`または`/register`へアクセス: `/`へリダイレクト

### To-Be

- 認証必須: `/users`, `/profile`, `/chat/*`, `/timeline`, `/timeline/*`
- 未認証で認証必須ページへアクセス: `/login`へリダイレクト
- 認証済みで`/login`または`/register`へアクセス: `/`へリダイレクト

## 実装反映チェックリスト

1. `src/router/index.js` に `Timeline` / `ThreadDetail` ルートを追加
2. `beforeEach` の認証必須判定に `/timeline` 系を追加
3. `Route Name` を表記ゆれなく統一（`Users`, `Login`, `Register`, `Profile`, `Timeline`, `ThreadDetail`）
4. `FLOW_Navigation` と差分がないことを確認
