# Firestore クエリ / インデックス設計

`#28 画面ごとの Firestore クエリと必要インデックスを定義する` の成果物。
この文書は、現状画面の Firestore 利用と、今後実装する画面で必要になるクエリ / インデックスを整理し、実装前に詰まりやすい箇所を見える化することを目的とする。

## 前提

- 画面構成は [routes.md](../routes.md) を基準にする
- データ構造は [firestore.md](./firestore.md) を基準にする
- `chatId` は `#27` で確定した長さプレフィックス方式で生成する
- 既存 `messages` の段階移行方針は `#26` で確定済み
- `users/{userId}/messages/latest` は正式保存先ではなく、必要なら後続で再設計する派生データとして扱う

## まとめ

| 画面 | 主クエリ | 想定保存先 | インデックス要否 |
|---|---|---|---|
| Home（未ログイン） | なし | - | 不要 |
| Home / Users（ログイン済み） | `users` 一覧、必要なら最新メッセージ補助取得 | `users`, `users/{userId}/messages/latest` または後続設計 | 基本不要 |
| PrivateChat | 会話単位のメッセージ一覧、相手ユーザー取得 | `directMessages`, `users` | DM 一覧は複合インデックス候補 |
| Profile | 自分のユーザー情報取得 / 更新 | `users` | 不要 |
| Timeline（今後実装） | スレッド一覧 | `threads` | 単一フィールド index で足りる想定 |
| ThreadDetail（今後実装） | スレッド本体、コメント一覧 | `threads`, `threads/{threadId}/comments` | 基本不要 |

## 現状

### HomeView

参照コード:
- [HomeView.vue](../../src/views/HomeView.vue)

現在のログイン済み分岐では `UserList` を表示しており、`HomeView` 自体でも `messages` と `users` を読んでいる。
ただし UI 上は `messages` を利用していないため、現状の `messages` 購読は将来的に削除候補。

| 用途 | クエリ | 備考 | インデックス |
|---|---|---|---|
| 全メッセージ購読 | `collection(db, "messages")` | 現状 UI では未使用。`#26` 後に再評価 | 不要 |
| 全ユーザー購読 | `collection(db, "users")` | 現状 UI では `UserList` 側と責務が重複 | 不要 |

### UserList

参照コード:
- [UserList.vue](../../src/components/UserList.vue)

| 用途 | クエリ | 備考 | インデックス |
|---|---|---|---|
| ユーザー一覧 | `getDocs(collection(db, "users"))` | 現状は全件取得。並び順は未定義 | 不要 |
| 最新メッセージ補助 | `getDoc(doc(db, \`users/${userId}/messages\`, "latest"))` | 正式保存先ではなく派生データ。必要なら後続で再設計 | 不要 |
| オンライン状態監視 | `onSnapshot(doc(db, "users", userId))` | 各ユーザーごとに購読 | 不要 |

### PrivateChat

参照コード:
- [PrivateChatView.vue](../../src/views/PrivateChatView.vue)

現状は `messages` を利用しているが、今後は `directMessages` へ移行する前提。

| 用途 | クエリ | 現状 / 今後 | インデックス |
|---|---|---|---|
| 会話メッセージ購読 | `where("chatId", "==", chatId) + orderBy("timestamp", "asc")` | 現状 `messages`。保存時には `participants` も持つ。今後は `directMessages` + `createdAt` | 複合インデックス候補 |
| 相手ユーザー取得 | `getDoc(doc(db, "users", chatPartnerId))` | 現状維持でよい | 不要 |
| 送信者表示名取得 | `getDoc(doc(db, "users", currentUser.uid))` | 送信前に 1 件取得 | 不要 |

### Profile

ルーティング上は存在するが、本成果物ではコード確認を省略している。想定としては `users/{currentUserId}` の単一ドキュメント read/write で足りるため、追加インデックスは不要。

## 今後実装する画面

### Home / Users

#### 目的

- ユーザー一覧を表示する
- 必要なら最新メッセージやオンライン状態を補助表示する

#### 想定クエリ

| 用途 | クエリ | インデックス |
|---|---|---|
| ユーザー一覧 | `collection("users")` | 不要 |
| ユーザー一覧の並び順を決める場合 | `orderBy("username")` または `orderBy("createdAt", "desc")` | 単一フィールド index で足りる想定 |
| 最新メッセージ補助表示 | `users/{userId}/messages/latest` を読む、または後続設計で代替 | 派生データの扱いを後続で再設計 |

#### メモ

- 現状コードは N+1 で `latest` を取得しているため、DM 一覧の要件が強くなるなら後続で再設計が必要
- `users/{userId}/messages/latest` は派生データなので、DM 一覧要件が固まった時点で残すか代替するかを改めて決める必要がある

### PrivateChat

#### 目的

- 1 対 1 の会話履歴を時系列で表示する
- 新規メッセージを送信する

#### 想定クエリ

| 用途 | クエリ | インデックス |
|---|---|---|
| 会話一覧取得 | `query(collection("directMessages"), where("chatId", "==", chatId), orderBy("createdAt", "asc"))` | `chatId + createdAt` の複合インデックス候補 |
| 会話を降順で読みたい場合 | `query(..., orderBy("createdAt", "desc"))` | `chatId + createdAt(desc)` の複合インデックス候補 |
| 相手ユーザー取得 | `getDoc(doc("users", userId))` | 不要 |

#### メモ

- `chatId` の生成規則は `#27` 依存
- 現状コードは `timestamp` を使っているが、今後は `createdAt` 前提に寄せる

### Profile

#### 想定クエリ

| 用途 | クエリ | インデックス |
|---|---|---|
| 自分のプロフィール取得 | `getDoc(doc("users", currentUserId))` | 不要 |
| プロフィール更新 | `updateDoc(doc("users", currentUserId), ...)` | 不要 |

### Timeline

#### 目的

- スレッド一覧を新着順または更新順に表示する

#### 想定クエリ

| 用途 | クエリ | インデックス |
|---|---|---|
| スレッド一覧（新着順） | `query(collection("threads"), orderBy("createdAt", "desc"))` | 単一フィールド index で足りる想定 |
| スレッド一覧（更新順） | `query(collection("threads"), orderBy("lastCommentAt", "desc"))` | `lastCommentAt` を採用する場合は単一フィールド index で足りる想定 |
| 投稿者絞り込み | `query(collection("threads"), where("authorId", "==", userId), orderBy("createdAt", "desc"))` | `authorId + createdAt` の複合インデックス候補 |
| タグ絞り込み | `query(collection("threads"), where("tags", "array-contains", tag), orderBy("createdAt", "desc"))` | `tags + createdAt` の複合インデックス候補 |

#### メモ

- `lastCommentAt` は必須前提にしない。採用する場合だけ、全 thread に値が入る前提で運用するほうが安全
- タグ絞り込みを MVP に含めるかは別途 UI 要件と合わせて確認が必要

### ThreadDetail

#### 目的

- スレッド本体と、その配下コメントを時系列で表示する

#### 想定クエリ

| 用途 | クエリ | インデックス |
|---|---|---|
| スレッド本体取得 | `getDoc(doc("threads", threadId))` | 不要 |
| コメント一覧 | `query(collection("threads", threadId, "comments"), orderBy("createdAt", "asc"))` | 不要 |
| コメント降順 | `query(..., orderBy("createdAt", "desc"))` | 不要 |

#### メモ

- スレッド配下サブコレクションの単純 `orderBy` で足りるため、現時点では複合インデックス不要
- 将来的に全コメント横断一覧をやる場合は `collectionGroup("comments")` と追加インデックスを検討する

## インデックス候補一覧

### 追加候補

| コレクション | フィールド | 用途 | 依存 |
|---|---|---|---|
| `directMessages` | `chatId ASC, createdAt ASC` | PrivateChat の時系列表示 | なし |
| `directMessages` | `chatId ASC, createdAt DESC` | PrivateChat の逆順取得 | なし |
| `threads` | `authorId ASC, createdAt DESC` | 投稿者ごとのスレッド一覧 | 投稿者絞り込みを採用する場合 |
| `threads` | `tags ARRAY_CONTAINS, createdAt DESC` | タグ絞り込み + 新着順 | タグ検索を採用する場合 |

### 追加不要

| クエリ | 理由 |
|---|---|
| `users/{userId}` 単一ドキュメント取得 | ドキュメント直接参照のため |
| `users` コレクション全件取得 | 現状の単純取得では複合インデックス不要 |
| `threads/{threadId}/comments` の `orderBy("createdAt")` | サブコレクション単体の単純並び替えで足りる想定 |

## `#27` 反映事項

- `chatId` は長さプレフィックス方式を前提にする
- `directMessages` は `chatId` を単一文字列フィールドとして扱う
- `PrivateChat` は `directMessages.createdAt` を正式タイムスタンプとして使う前提で整理する

## `#26` 依存の未確定事項

- `users/{userId}/messages/latest` を残すか、別の DM 一覧設計へ置き換えるか
- 現行 `messages.timestamp` と今後の `directMessages.createdAt` の完全な移行方針
- UserList における最新メッセージ表示を現行のまま残すかどうか

## この成果物で言えること

- PrivateChat の本命クエリは `directMessages` の `chatId + createdAt`
- ThreadDetail のコメント表示は単純クエリで足りる
- Timeline のタグ絞り込みをやるなら `threads` に複合インデックスが増える
- UserList の最新メッセージ表示は `#26` の結論待ち要素がある
