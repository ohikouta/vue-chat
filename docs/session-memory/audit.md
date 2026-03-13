# Project Audit Log

## 2026-03-08T04:03:59Z

- セッション継続用の記録機構を導入
- `current.md` ベースではなく markdown 直接更新運用へ切り替え

## 2026-03-08T04:27:00Z

- `current.md` を廃止し、`audit.md` を最新監査ログの起点に変更
- Obsidian の `vue-chat` タスクカード内の Issue 表記を GitHub リンク形式へ統一

## 2026-03-08T04:39:00Z

- `#25` レビューで合意した設計判断を `docs/db/firestore.md` に反映
- Issue のクローズ判断は完了条件を基準にする運用を `AGENTS.md` に明記
- レビュー中の合意事項は関連ドキュメントと session memory に即時反映する運用を追加

## 2026-03-08T04:48:00Z

- GitHub Issue `#25` から `#30` をチェックボックス形式へ更新
- GitHub Issue / PR の `やること` / `完了条件` はチェックボックス形式を標準とする運用を追加

## 2026-03-08T05:55:00Z

- PR `#32` のタイトルと本文を日本語化
- `#25` のスコープ超過、`chatId` の確定しすぎ、`messages` の扱いに関するレビューコメントを PR `#32` に投稿
- GitHub Issue / PR のタイトル・本文・コメントは原則日本語で記述する運用を追加

## 2026-03-08T06:05:00Z

- PR `#32` の差分を `docs/db/firestore.md` のみに整理
- PR `#32` を ready 化して squash merge
- Issue `#25` を closed 確認

## 2026-03-08T06:12:00Z

- Obsidian の `タスク.md` で `#25` カードを完了へ更新
- Obsidian 実施ログ `2026-03-08-Firestore設計整理.md` を追加

## 2026-03-08T06:25:00Z

- マルチエージェント運用を今後の前提とし、`docs/multi-agent-orchestration.md` を追加
- 親エージェント / 子エージェント / 人間の役割分担を定義
- 原則 `1 Issue = 1 子エージェント`、並列作業では worktree を分ける方針を明文化
- Obsidian `10_Knowledge/Codexマルチエージェント運用.md` に再利用ナレッジを追加

## 2026-03-08T07:20:00Z

- マルチエージェントで `#26` `#27` `#28` `#29` `#30` のドラフト文書を並列作成
- `#27` は親判断で `chatId = sort().join('_')` に確定
- Issue ごとに worktree を分けて branch を作成
- レビュー用 PR を作成
  - `#33` for `#26`
  - `#37` for `#27`
  - `#36` for `#28`
  - `#35` for `#29`
  - `#34` for `#30`

## 2026-03-08T08:05:00Z

- PR `#37` のレビューで、`sort().join('_')` は UID に区切り文字が含まれる場合に衝突しうる指摘を受けた
- 仕様として後から詰まないことを優先し、`chatId` を長さプレフィックス方式 `dm:v1:<lenA>:<uidA>|<lenB>:<uidB>` へ修正
- `docs/db/chat-id.md` を更新し、衝突回避の理屈を「区切り文字依存ではなく長さで境界を確定する」として明文化
- 依存文書 `docs/db/messages-migration.md` と `docs/db/firestore-queries.md` に新しい `chatId` 仕様を反映
- PR `#37` の本文は長さプレフィックス方式に更新済み

## 2026-03-08T14:20:00Z

- `docs/db/chat-id.md` にソート順の比較規則と `generateChatId(senderId, receiverId)` を必ず通す整合性前提を追記
- PR `#37` の Copilot レビューコメント 4 件に対して、修正内容を GitHub 上で返信
- PR `#37` を merge、Issue `#27` が closed になったことを確認
- 今日の作業ログを `summary.md` `audit.md` Obsidian ログへ取りまとめ

## 2026-03-11T12:45:00Z

- Codex の project rules を `.codex/rules/` に追加
- `10-safe-default.rules` で read-only git / GitHub 確認 / `npm run lint|build` / `codex execpolicy check` を許可
- `20-approval-required.rules` で GitHub 更新、依存変更、worktree 変更、Firebase、Docker、再帰削除を都度確認に設定
- `30-forbidden.rules` で `git reset --hard` `git checkout --` `git clean -fd|-xdf` `firebase deploy` `npm|pnpm|yarn publish` を禁止
