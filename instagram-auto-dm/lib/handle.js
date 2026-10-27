import { findRule } from './rules.js';
import { sendPrivateReply, replyToComment } from './instagram.js';

/** 웹훅 payload의 댓글 이벤트를 하나씩 처리해요. */
export async function handleWebhook(payload, rules, api = { sendPrivateReply, replyToComment }) {
  const results = [];
  for (const entry of payload?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'comments') continue;
      const comment = change.value ?? {};
      const mediaId = comment.media?.id;
      console.log(`댓글 수신: media=${mediaId} comment=${comment.id} from=@${comment.from?.username} text=${JSON.stringify(comment.text)}`);

      // 내 계정이 단 댓글(공개 답글 포함)에는 반응하지 않아요.
      if (comment.from?.id === entry.id) continue;

      const rule = findRule(rules, { mediaId, text: comment.text });
      if (!rule) continue;

      try {
        await api.sendPrivateReply(entry.id, comment.id, rule.message);
        if (rule.publicReply) await api.replyToComment(comment.id, rule.publicReply);
        console.log(`DM 발송 완료: comment=${comment.id}`);
        results.push({ commentId: comment.id, ok: true });
      } catch (error) {
        // 이미 DM을 보낸 댓글(Meta 재전송 등)이면 여기서 에러가 나요. 다른 댓글 처리는 계속해요.
        console.error(`DM 발송 실패: comment=${comment.id}`, error.message);
        results.push({ commentId: comment.id, ok: false });
      }
    }
  }
  return results;
}
