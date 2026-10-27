import { rules } from '../rules.config.js';
import { handleWebhook } from '../lib/handle.js';
import { isValidSignature } from '../lib/signature.js';

// Meta 웹훅 등록 시 한 번 호출되는 확인 요청
export function GET(request) {
  const params = new URL(request.url).searchParams;
  if (
    params.get('hub.mode') === 'subscribe' &&
    params.get('hub.verify_token') === process.env.WEBHOOK_VERIFY_TOKEN
  ) {
    return new Response(params.get('hub.challenge'));
  }
  return new Response('Forbidden', { status: 403 });
}

// 댓글이 달릴 때마다 Meta가 보내는 이벤트
export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  if (!isValidSignature(rawBody, signature, process.env.IG_APP_SECRET)) {
    return new Response('Invalid signature', { status: 401 });
  }

  await handleWebhook(JSON.parse(rawBody), rules);
  // 실패한 건이 있어도 200을 돌려줘요. 그렇지 않으면 Meta가 같은 이벤트를 계속 다시 보내요.
  return new Response('OK');
}
