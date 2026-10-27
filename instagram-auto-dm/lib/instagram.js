const version = () => process.env.GRAPH_API_VERSION || 'v23.0';

async function post(path, body) {
  const res = await fetch(`https://graph.instagram.com/${version()}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.IG_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Instagram API ${res.status}: ${JSON.stringify(data.error ?? data)}`);
  }
  return data;
}

/** 댓글 작성자에게 DM(Private Reply)을 보내요. 댓글 하나당 한 번만, 댓글 후 7일 안에만 가능해요. */
export function sendPrivateReply(igUserId, commentId, text) {
  return post(`${igUserId}/messages`, {
    recipient: { comment_id: commentId },
    message: { text },
  });
}

/** 댓글에 공개 답글을 달아요. */
export function replyToComment(commentId, text) {
  return post(`${commentId}/replies`, { message: text });
}
