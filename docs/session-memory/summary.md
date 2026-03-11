# Project Summary

- Updated At: 2026-03-11T12:45:00Z
- Branch: work
- HEAD: f9bb979e
- Updated By: Codex

## Current Status

- `#25` は完了し、PR `#32` は merge 済み
- `#27` は完了し、PR `#37` は merge 済み
- 現在の open Issue は `#26` `#28` `#29` `#30`
- Firestore 設計の基準は [firestore.md](/Users/koutaohi/projects/vue-chat/docs/db/firestore.md)

## Recent Progress

- `#25` のレビュー内容を `docs/db/firestore.md` に反映
- PR `#32` を日本語化し、差分を `docs/db/firestore.md` のみに整理して squash merge
- GitHub Issue `#25` から `#30` をチェックボックス形式へ更新
- Obsidian の `vue-chat` タスクカードを Issue リンク形式へ更新し、`#25` を完了に変更
- マルチエージェント運用ルールを `docs/multi-agent-orchestration.md` に追加
- Obsidian `10_Knowledge` に Codex マルチエージェント運用ナレッジを追加
- `#26` `#27` `#28` `#29` `#30` のドラフト文書を作成
- 各 Issue ごとにレビュー用 PR を作成
- `#37` のレビュー指摘を受けて `chatId` を長さプレフィックス方式へ修正
- Copilot レビューコメントへ修正内容を返信
- PR `#37` を merge し、Issue `#27` を closed 確認

## Current Decisions

- `directMessages` を正式保存先とする
- `messages` の移行 / 廃止 / ロールバック条件は `#26` で決める
- `chatId` は長さプレフィックス方式 `dm:v1:<lenA>:<uidA>|<lenB>:<uidB>` で生成する
- コメントは `threads/{threadId}/comments` のサブコレクションで扱う
- 表示用の `authorName` / `senderName` はキャッシュとして保持する
- GitHub Issue の `やること` / `完了条件` はチェックボックス形式を標準とする
- GitHub Issue / PR のタイトル・本文・コメントは原則日本語で記述する
- マルチエージェントでは原則 `1 Issue = 1 子エージェント` で進める
- 並列作業では branch だけでなく worktree も分ける
- Codex のガードレールは `AGENTS.md` とは別に `.codex/rules/*.rules` で管理する
- `gh` の読み取り系は許可、変更系は都度確認、`git reset --hard` と `firebase deploy` は禁止する

## Next Actions

- PR [#33](https://github.com/ohikouta/vue-chat/pull/33) `#26` をレビューする
- PR [#36](https://github.com/ohikouta/vue-chat/pull/36) `#28` をレビューする
- PR [#35](https://github.com/ohikouta/vue-chat/pull/35) `#29` をレビューする
- PR [#34](https://github.com/ohikouta/vue-chat/pull/34) `#30` をレビューする
- `.codex/rules` を Codex 再起動後に `codex execpolicy check` で検証する

## Reference Logs

- [2026-03-08-Firestore設計整理.md](/Users/koutaohi/Library/Mobile%20Documents/iCloud~md~obsidian/Documents/obsidian-private/vue-chat/08_Logs/2026-03-08-Firestore設計整理.md)
- [audit.md](/Users/koutaohi/projects/vue-chat/docs/session-memory/audit.md)
- [multi-agent-orchestration.md](/Users/koutaohi/projects/vue-chat/docs/multi-agent-orchestration.md)
