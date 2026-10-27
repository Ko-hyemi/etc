const normalize = (text) => text.toLowerCase().replace(/\s+/g, '');

/** 댓글에 맞는 첫 번째 규칙을 찾아요. 없으면 undefined. */
export function findRule(rules, { mediaId, text }) {
  if (!text) return undefined;
  const comment = normalize(text);
  return rules.find(
    (rule) =>
      (!rule.mediaId || rule.mediaId === mediaId) &&
      rule.keywords.some((keyword) => comment.includes(normalize(keyword))),
  );
}
