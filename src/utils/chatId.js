/**
 * DM 識別用 chatId ユーティリティ
 *
 * ## 生成規則
 * 2 つの Firebase Auth UID を辞書順に並べてアンダースコアで連結する。
 *
 *   generateChatId(uid1, uid2) === generateChatId(uid2, uid1)
 *   // 例: "aaa_bbb" （uid1 < uid2 の場合）
 *
 * ## 衝突回避方針
 * Firebase Auth UID は 28 文字の URL セーフ Base64 文字列（英数字と `-`）で構成され、
 * アンダースコア（`_`）を含まない。そのため区切り文字に `_` を使うことで、
 * chatId のパースが一意に定まり、異なるペアが同一の chatId を生成することはない。
 *
 * @param {string} userId1 - 一方のユーザーの Firebase Auth UID
 * @param {string} userId2 - 他方のユーザーの Firebase Auth UID
 * @returns {string} ソート済み UID をアンダースコアで結合した chatId
 */
export function generateChatId(userId1, userId2) {
  return [userId1, userId2].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join('_');
}
