import { createHmac, timingSafeEqual } from 'node:crypto';

/** Meta가 보낸 X-Hub-Signature-256 헤더가 원문 body와 맞는지 확인해요. */
export function isValidSignature(rawBody, header, appSecret) {
  if (!header || !appSecret) return false;
  const expected = `sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
