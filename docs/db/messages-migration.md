# messages から directMessages への移行方針

`#26 既存 messages の移行方針とロールバック条件を策定する` の成果物ドラフト。
この文書は、現行の `messages` コレクションと `users/{userId}/messages/latest` をどう扱うかを整理し、実装時に迷わないようにするための基準とする。

## 結論

- 長期の並行運用は採用しない
- 正式な保存先は `directMessages` に一本化する
- 移行は「バックフィル -> 読み取り切り替え -> 書き込み切り替え -> 旧データ退役」の段階移行にする
- ロールバックは、旧 `messages` を一定期間残したうえで、読み取り先を戻せる状態を保ってから行う
- `users/{userId}/messages/latest` は正式保存先ではなく派生データとして扱い、DM 一覧要件を見ながら後続 Issue で再設計する

## 背景

現行実装では 1 対 1 DM が `messages` に保存されており、少なくとも次の利用箇所が確認できる。

- [PrivateChatView.vue](/Users/koutaohi/projects/vue-chat/src/views/PrivateChatView.vue)
  - `messages` を `chatId + timestamp` で購読
  - 送信時も `messages` に書き込み
- [HomeView.vue](/Users/koutaohi/projects/vue-chat/src/views/HomeView.vue)
  - `messages` 全件購読と書き込みが残っている
- [ChatView.vue](/Users/koutaohi/projects/vue-chat/src/views/ChatView.vue)
  - `messages` 全件購読と書き込みが残っている
- [UserList.vue](/Users/koutaohi/projects/vue-chat/src/components/UserList.vue)
  - `users/{userId}/messages/latest` を最新メッセージ表示に利用

一方、設計上の正式な保存先は [firestore.md](/Users/koutaohi/projects/vue-chat/docs/db/firestore.md) で `directMessages` と定義済みである。

## 現行データの整理

### `messages`

現在確認できるフィールド:

- `text`
- `timestamp`
- `senderId`
- `senderName`
- `receiverId`
- `chatId`
- `participants`

### `directMessages`

新設計で持つフィールド:

- `chatId`
- `senderId`
- `senderName`
- `receiverId`
- `text`
- `createdAt`

## 採用方針

### 採用する方式

「段階移行」を採用する。

1. `messages` から `directMessages` へ既存データをバックフィルする
2. 読み取りを `directMessages` に切り替える
3. 書き込みを `directMessages` に切り替える
4. 監視期間を経て `messages` を退役対象にする

### 採用理由

- いきなり旧データを消すと、既存チャット履歴を失うリスクがある
- 長期の二重書き込み / 二重読み取りは実装を複雑にし、`messages` を残し続ける理由も弱い
- 旧コレクションを短期間残すことで、ロールバック余地を確保できる

### 採用しない案

#### 長期並行運用

`messages` と `directMessages` を長期で併用する案は採用しない。

- 読み書き先が増えて保守が重くなる
- データ不整合の温床になる
- `directMessages` を正式保存先にした意味が薄れる

#### 即時廃止

既存データの移行前に `messages` を即廃止する案も採用しない。

- 既存履歴を失う可能性がある
- 旧画面実装が残っている現状では切り替え時の失敗耐性が低い

## 変換方針

`messages` の各ドキュメントは、次のルールで `directMessages` へ移す。

| 現行 `messages` | 移行先 `directMessages` | 備考 |
|---|---|---|
| `text` | `text` | そのまま移す |
| `senderId` | `senderId` | そのまま移す |
| `senderName` | `senderName` | そのまま移す |
| `receiverId` | `receiverId` | そのまま移す |
| `chatId` | `chatId` | そのまま移す。生成規則は `sort().join('_')` を採用済み |
| `timestamp` | `createdAt` | フィールド名を変換して保持する |
| `participants` | なし | 現時点では移行先の必須フィールドにしない |

## `users/{userId}/messages/latest` の扱い

- 正式保存先としては扱わない
- 当面は派生データとして残っていてよい
- `directMessages` 切り替え後に、必要なら `users/{userId}/messages/latest` を `directMessages` ベースで再生成する
- そもそもこの派生データが必要かどうかは、DM 一覧 UI 要件と合わせて後続で見直す

## 実施手順

### フェーズ1: バックフィル準備

- `directMessages` のコレクション定義を前提にする
- `messages.timestamp` を `directMessages.createdAt` へ変換するルールを固定する
- バックフィル対象を列挙する

### フェーズ2: 既存データ移行

- `messages` の全データを `directMessages` へコピーする
- 変換時に `timestamp` -> `createdAt` を適用する
- コピー件数とサンプル整合を確認する

### フェーズ3: 読み取り切り替え

- DM 画面の購読先を `messages` から `directMessages` へ切り替える
- `chatId` ごとの会話履歴が見えることを確認する

### フェーズ4: 書き込み切り替え

- 新規送信先を `messages` から `directMessages` へ切り替える
- 送信後に即時反映されることを確認する

### フェーズ5: 旧データ退役準備

- `messages` に新規書き込みが発生していないことを確認する
- 必要なら `users/{userId}/messages/latest` の扱いを再整理する
- 監視期間を経て `messages` を削除対象にする

## ロールバック条件

次のいずれかが起きた場合は、移行を止めて読み取り先を旧 `messages` に戻す。

- `directMessages` で過去履歴の欠落が確認された
- `chatId` 単位で期待した会話が再現できない
- 書き込み後に会話へ即時反映されない
- タイムスタンプ変換により表示順が壊れる

## ロールバック手順

1. 新規書き込みの切り替えを止める
2. 読み取り先を `messages` に戻す
3. バックフィルした `directMessages` の整合不良原因を調査する
4. 原因修正後に再度バックフィル対象と差分を確認する

`messages` を短期的に残しておくのは、このロールバック手順を成立させるためであり、長期互換のためではない。

## 完了条件に対する整理

- [x] `messages` の扱い方針を決める（長期並行運用は採用せず、段階移行）
- [x] 移行手順を明文化する
- [x] ロールバック条件を明文化する
- [x] 既存データを壊さず移行判断できる状態にする

## 未確定事項

- `chatId` は `sort().join('_')` を使う
- `directMessages` を使う画面クエリと必要インデックスは `#28` で確定する
- `directMessages` の権限制御詳細は `#29` で確定する
- バックフィル実行方法（スクリプト / エミュレータ / 本番手順）は実装時に別途決める
